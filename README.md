# autonomous-mail-delivery-trains

## Overview
The Autonomous Mail Delivery Trains project is a web application designed to manage a network of autonomous mail delivery trains. The system allows users to input nodes, edges, trains, and packages, and calculates the optimal moves required to deliver packages from their starting locations to their destinations.

## Features
- Input Nodes: Define the nodes (locations) in the network.
- Input Edges: Define the connections between nodes, including journey times.
- Input Trains: Specify the trains with their capacities and starting nodes.
- Input Packages: List packages with their weights, starting nodes, and destination nodes.
- Calculate Moves: Generate the sequence of moves for trains to deliver all packages efficiently.

## Sample Input Interface
![image](https://github.com/user-attachments/assets/b90e2756-5ed2-476b-94c8-0f9082dc6568)

## Sample Output
![image](https://github.com/user-attachments/assets/c082bf3a-3abc-4211-9e93-bfad812bdd68)

## Usage
Define Nodes:
Enter nodes in the "Nodes" textarea, one per line.

Define Edges:
Enter edges in the format Name, Node1, Node2, JourneyTimeInMinutes in the "Edges" textarea.

Define Trains:
Enter trains in the format TrainName, CapacityInKg, StartingNode in the "Trains" textarea.

Define Packages:
Enter packages in the format PackageName, WeightInKg, StartingNode, DestinationNode in the "Packages" textarea.

Generate Moves:
Click the "Generate Moves" button to calculate and display the sequence of moves for the trains.


