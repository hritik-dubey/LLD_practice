enum ElevatorState {
    IDLE = "IDLE",
    UP = "UP",
    DOWN = "DOWN",
}

enum Direction {
    UP = "UP",
    DOWN = "DOWN",
}

class Elevator {
    private id: number;
    private currentFloor: number;
    private state: ElevatorState;

    constructor(id: number) {
        this.id = id;
        this.currentFloor = 0;
        this.state = ElevatorState.IDLE;
    }

    getId(): number { return this.id; }
    getCurrentFloor(): number { return this.currentFloor; }
    getState(): ElevatorState { return this.state; }

    moveTo(floor: number): void {
        this.currentFloor = floor;
    }

    setState(state: ElevatorState): void {
        this.state = state;
    }
}

interface ElevatorStrategy {
    addHallRequest(floor: number, direction: Direction): void;
    addCabinRequest(elevatorId: number, destinationFloor: number): void;
    getNextFloor(elevator: Elevator): number | null;
}

class ElevatorController {
    private elevators: Elevator[];
    private strategy: ElevatorStrategy;

    constructor(strategy: ElevatorStrategy) {
        this.elevators = [];
        this.strategy = strategy;
    }

    addElevator(elevator: Elevator): void {
        this.elevators.push(elevator);
    }

    // Hall call — person on floor presses up/down button
    callElevator(floor: number, direction: Direction): void {
        this.strategy.addHallRequest(floor, direction);
    }

    // Cabin call — person inside elevator presses destination floor
    assignFloor(elevatorId: number, floor: number): void {
        this.strategy.addCabinRequest(elevatorId, floor);
    }

    // Advances the simulation by one tick
    step(): void {
        for (const elevator of this.elevators) {
            const nextFloor = this.strategy.getNextFloor(elevator);

            if (nextFloor === null) {
                elevator.setState(ElevatorState.IDLE);
                continue;
            }

            if (nextFloor > elevator.getCurrentFloor()) {
                elevator.setState(ElevatorState.UP);
            } else {
                elevator.setState(ElevatorState.DOWN);
            }

            elevator.moveTo(nextFloor);
        }
    }
}

// --- Main ---

class FCFSStrategy implements ElevatorStrategy {
    // TODO: implement FCFS
    addHallRequest(_floor: number, _direction: Direction): void {}
    addCabinRequest(_elevatorId: number, _destinationFloor: number): void {}
    getNextFloor(_elevator: Elevator): number | null { return null; }
}

const strategy = new FCFSStrategy();
const controller = new ElevatorController(strategy);

const elevator1 = new Elevator(1);
const elevator2 = new Elevator(2);

controller.addElevator(elevator1);
controller.addElevator(elevator2);

// Hall call — someone on floor 3 wants to go up
controller.callElevator(3, Direction.UP);

// Cabin call — someone inside elevator 1 wants floor 7
controller.assignFloor(1, 7);

// Tick the simulation
controller.step();
controller.step();


//
