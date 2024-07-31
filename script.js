function generateMoves() {
    // Get the nodes input and split by new lines into an array
    const nodes = document.getElementById('nodes').value.trim().split('\n');
    
    // Get the edges input, split by new lines, and map to an array of edge objects
    const edges = document.getElementById('edges').value.trim().split('\n').map(edge => {
        const [name, node1, node2, journeyTime] = edge.split(',');
        return { name, node1, node2, journeyTime: parseInt(journeyTime) * 60 }; // Convert journey time to seconds
    });
    
    // Get the trains input, split by new lines, and map to an array of train objects
    const trains = document.getElementById('trains').value.trim().split('\n').map(train => {
        const [name, capacity, startingNode] = train.split(',');
        return { name, capacity: parseInt(capacity), startingNode }; // Convert capacity to an integer
    });
    
    // Get the packages input, split by new lines, and map to an array of package objects
    const packages = document.getElementById('packages').value.trim().split('\n').map(pkg => {
        const [name, weight, startingNode, destinationNode] = pkg.split(',');
        return { name, weight: parseInt(weight), startingNode, destinationNode }; // Convert weight to an integer
    });

    // Calculate the moves based on the inputs and set the output text content
    const moves = calculateMoves(nodes, edges, trains, packages);
    document.getElementById('output').textContent = moves.join('\n');
}


function calculateMoves(nodes, edges, trains, packages) {
    let currentTime = 0;

    // Initialize an empty array to store moves
    let moves = [];

    packages.forEach(pkg => {
        // Find a suitable train that can carry the package and starts at the package's starting node
        let train = trains.find(t => t.capacity >= pkg.weight && t.startingNode === pkg.startingNode);
        if (!train) {
            // Fallback to the first train if no suitable train is found
            train = trains[0]; 
        }

        // Find the route to move the train to the package's starting location
        const routeToPickup = findRoute(nodes, edges, train.startingNode, pkg.startingNode);
        // Find the route to move the train from the package's starting location to its destination
        const routeToDropoff = findRoute(nodes, edges, pkg.startingNode, pkg.destinationNode);

        // Move train to pickup location
        routeToPickup.forEach(edge => {
            moves.push(`\nMove ${train.name} to ${edge.node2} via ${edge.name}, |⏱️ ${edge.journeyTime / 60} minutes.`);
            moves.push(`W=${currentTime / 60}, T=${train.name}, N1=${edge.node1}, P1=[], N2=${edge.node2}, P2=[]`);

            // Update the current time by adding the journey time
            currentTime += edge.journeyTime;
        });

        // Move train to dropoff location with package
        routeToDropoff.forEach((edge, index) => {
            if (index === 0) {
                moves.push(`\nMove ${train.name} to ${edge.node2} via ${edge.name}, |⏱️ ${edge.journeyTime / 60} minutes.`);
                moves.push(`W=${currentTime / 60}, T=${train.name}, N1=${pkg.startingNode}, P1=[${pkg.name}], N2=${edge.node2}, P2=[]`);
            } else {
                moves.push(`\nMove ${train.name} to ${edge.node2} via ${edge.name}, |⏱️ ${edge.journeyTime / 60} minutes.`);
                moves.push(`W=${currentTime / 60}, T=${train.name}, N1=${edge.node1}, P1=[${pkg.name}], N2=${edge.node2}, P2=[]`);
            }
            currentTime += edge.journeyTime;
        });

        // Dropoff package
        moves.push(`\nDrop off package ${pkg.name}. |⏱️ ${currentTime / 60} minutes total`);
        moves.push(`W=${currentTime / 60}, T=${train.name}, N1=${pkg.destinationNode}, P1=[], N2=${pkg.destinationNode}, P2=[${pkg.name}]`);
    });

    return moves; // Return the list of moves
}



function findRoute(nodes, edges, startNode, endNode) {
    const distances = {}; // Initialize distances from the start node to each node
    const prevNodes = {}; // Initialize previous nodes to reconstruct the path
    const unvisited = new Set(nodes); // Create a set of all unvisited nodes

    // Set initial distances to infinity and 0 for the start node
    nodes.forEach(node => distances[node] = Infinity);
    distances[startNode] = 0;

    // Dijkstra's algorithm main loop
    while (unvisited.size > 0) {

        // Find the unvisited node with the smallest distance
        const currentNode = [...unvisited].reduce((minNode, node) => (distances[node] < distances[minNode] ? node : minNode), [...unvisited][0]);
        unvisited.delete(currentNode); // Remove the current node from the unvisited set

        // If the end node is reached, exit the loop
        if (currentNode === endNode) break;

        // Find all neighbors of the current node
        const neighbors = edges.filter(edge => edge.node1 === currentNode || edge.node2 === currentNode);
        neighbors.forEach(neighbor => {

            // Determine the neighbor node
            const neighborNode = neighbor.node1 === currentNode ? neighbor.node2 : neighbor.node1;

            if (unvisited.has(neighborNode)) {
                const newDist = distances[currentNode] + neighbor.journeyTime; // Calculate the new distance
                if (newDist < distances[neighborNode]) {
                    distances[neighborNode] = newDist; // Update the distance if the new distance is smaller
                    prevNodes[neighborNode] = { name: neighbor.name, node1: currentNode, node2: neighborNode, journeyTime: neighbor.journeyTime }; // Update the previous node
                }
            }
        });
    }

    // Reconstruct the path from the end node to the start node
    const path = [];
    let step = endNode;
    while (step !== startNode) {
        const edge = prevNodes[step];
        path.unshift(edge); // Add the edge to the path
        step = edge.node1; // Move to the previous node
    }

    return path; // Return the reconstructed path
}


// Auto-fill the form with test data as input
window.onload = function() {
    document.getElementById('nodes').value = 'A\nB\nC';
    document.getElementById('edges').value = 'E1,A,B,30\nE2,B,C,10';
    document.getElementById('trains').value = 'Q1,6,B';
    document.getElementById('packages').value = 'K1,5,A,C';
};
