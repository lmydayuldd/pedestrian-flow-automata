# Automata Based Crowd Simulation

Human being itself is really smart, but when are enclosed on a crowded situations, its behavior might change, and some reason seems to be shaded by the surrounding crowd. The complete group of people then will distribute following a chaotic pattern, where smaller groups of persons will move pursuing a specific objective. 
Given the described scenario, is possible to model the situation using a cellular automata, which will try to represent closely the behaviour of the crowd. 
The way to model this automata is using objective matrices. The group then, would be split into smaller groups represented by colors. Each group would have it's own moving pattern specified by a layer which is a probability matrix. Every iteration of the automata will evaluate each cell, and will determinate the objective matrix associated to the cell value, to calculate where the cell is going to be placed the next iteration. The purpose of this simulation is to demonstrate how the crowd would move given some specific situations.    

## Controls

This software gives the user the ability to change the simulation behaviour. Starting from the predefined cases, the user is able to add more cells, add entrances, add exits, empty cells and change the complete movement of the cells modifying the probability matrices. This all can be achieved through the simulation controls, located inside the "Edit" Submenu. Also, inside this same menu, the speed of the simulation can be modified. At any time the simulation can be paused an resumed as the user request it. 

## Future Work

* Implement saving of the current state of the automata so it can be loaded as initial data. 
* Add stats support, so the application can show a general overview of the sate of the automata
* Optimize cell drawing, so iterations are not heavy
* Clear and concise separation of ui elements
