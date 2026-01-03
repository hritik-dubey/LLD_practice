/*
You need to design a SortingService that can sort numbers using different algorithms.
The algorithm must be switchable at runtime.

Sorting strategies to implement:

BubbleSortStrategy

QuickSortStrategy

MergeSortStrategy

Requirements:

Each strategy must implement:

sort(data: number[]): number[];


SortingService must provide:

setStrategy(strategy: SortStrategy): void;
sort(numbers: number[]): number[];


The client should be able to do:

const sorter = new SortingService();

sorter.setStrategy(new QuickSortStrategy());
console.log(sorter.sort([5, 3, 1, 4]));

sorter.setStrategy(new BubbleSortStrategy());
console.log(sorter.sort([9, 2, 6, 1]));

Rules:

No if-else or switch inside SortingService for selecting strategy.

sort(data: number[]): number[];


SortingService must provide:

Strategy must be interchangeable without modifying service code (OCP).

Implement minimal working sorting logic (not theoretical pseudo-code — real implementations).

🎯 Your Task

Write complete TypeScript code for:

SortStrategy interface

All three sorting strategies

SortingService

I will check:

correctness

clean strategy separation

mutation safety

interview-level quality

Reply with your code when ready.
*/

interface ISortingStrategy {
    sort(data: number[]): number[];
}

// BubbleSortStrategy
class BubbleSortStrategy implements ISortingStrategy {
    sort(data: number[]): number[] {
        console.log("implementing bubble sort")
        return data;
    }
}

// QuickSortStrategy
class QuickSortStrategy implements ISortingStrategy {
    sort(data: number[]): number[] {
        console.log("implementing quick sort")
        return data;
    }
}

// MergeSortStrategy
class MergeSortStrategy implements ISortingStrategy {
    sort(data: number[]): number[] {
        console.log("implementing merge sort")
        return data;
    }
}

class SortingService {
    private sortTechnique!: ISortingStrategy;

    public setStrategy(sortStrategy: ISortingStrategy): void {
        this.sortTechnique = sortStrategy
    }
    public sort(data: number[]) {
        return this.sortTechnique.sort(data)
    }
}

const sorter = new SortingService();

sorter.setStrategy(new QuickSortStrategy());
console.log(sorter.sort([5, 3, 1, 4]));

sorter.setStrategy(new BubbleSortStrategy());
console.log(sorter.sort([9, 2, 6, 1]));

/*

we have seen that we need to assign to the variable which we create
    private sortTechnique!: ISortingStrategy;

    via default value,constructor

    we can use this "!"
    to tell ts that we will assign this before using 
*/