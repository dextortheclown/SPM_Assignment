# SPM_Assignment

## City Building Game

Welcome to the City Building Game! In this game, you play as the mayor of Ngee Ann City, with the goal of building the happiest and most prosperous city possible. The game features two modes: Arcade mode and Free Play mode. Your objective is to strategically place different types of buildings to maximize your city's score and manage resources effectively.

## Game Modes

### Arcade Mode
- **Starting Coins**: 16
- **Grid Size**: 20x20
- **Gameplay**: Each turn, you can construct one of two randomly selected buildings. Each construction costs 1 coin. The first building can be placed anywhere, but subsequent buildings must be adjacent to existing ones. The objective is to maximize your score with limited coins.

### Free Play Mode
- **Starting Coins**: Unlimited
- **Grid Size**: Starts at 5x5, expands as needed
- **Gameplay**: You can construct any building each turn, with each construction costing 1 coin. The grid expands by 5 rows and columns when a building is placed on the border. The objective is to build the most prosperous city without any coin limitations.

## Building Types

- **Residential (R)**: Scores 1 point per adjacent Residential (R) or Commercial (C), and 2 points per adjacent Park (O). If adjacent to an Industry (I), it scores only 1 point. Generates 1 coin per turn. Requires 1 coin per turn for upkeep per cluster of adjacent Residential buildings.
- **Industry (I)**: Scores 1 point per Industry in the city. Generates 2 coins per turn and costs 1 coin per turn for upkeep.
- **Commercial (C)**: Scores 1 point per adjacent Commercial. Generates 3 coins per turn and costs 2 coins per turn for upkeep.
- **Park (O)**: Scores 1 point per adjacent Park. Costs 1 coin per turn for upkeep.
- **Road (*)**: Scores 1 point per connected road in the same row. Unconnected road segments cost 1 coin per turn for upkeep.

## Installation and Setup

### Prerequisites

- **Python**: Ensure you have Python installed. You can download it from [python.org](https://www.python.org/).
- **tkinter**: A built-in Python library for GUI development.

### Getting Started
