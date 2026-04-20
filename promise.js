function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms); // After ms, call resolve()
    });
}


const tasks = [
    () => delay(300).then(() => "Task 1"),
    () => delay(200).then(() => "Task 2"),
    () => delay(100).then(() => "Task 3"),
    () => delay(400).then(() => "Task 4"),
    () => delay(150).then(() => "Task 5"),
];

async function runWithConcurrency(tasks, limit) {
    let mainAnswerArray = []
    let runningPool = new Set()
    for (let i = 0; i < tasks.length; i++) {

        let p = Promise.resolve().then(() => {
            return tasks[i]()
        }).then((value) => {
            return {
                index: i,
                value: value,
                promise: p
            }
        }).then((result) => {
            mainAnswerArray[result.index] = result.value
            runningPool.delete(result.promise)
        })

        runningPool.add(p)

        if (runningPool.size >= limit) {
            await Promise.race(runningPool)
        }

    }
    await Promise.all(runningPool)
    return mainAnswerArray
}

runWithConcurrency(tasks, 2)
    .then(results => {
        console.log(results);
    });
