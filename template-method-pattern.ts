/*
You need to design a DataProcessor that defines a fixed workflow:

Workflow (template method):

read()

process(data)

save(result)

This order must not change.

But different data sources implement these steps differently.

Implement two subclasses:

CSVDataProcessor

JSONDataProcessor

Requirements:

DataProcessor must contain a run() method (template method) that executes the 3 steps in order.

Subclasses override the steps (read, process, save), but cannot override run().

All methods must log something so we can see they’re being executed.

Expected usage:
const csv = new CSVDataProcessor();
csv.run();

const json = new JSONDataProcessor();
json.run();

🎯 Your Task

Write full TypeScript code for:

Abstract class DataProcessor

Method run() (final template method)

Implementations for CSVDataProcessor and JSONDataProcessor

Do not implement real CSV/JSON parsing—just simulate with console logs.
*/

abstract class IDataProcessor{
    run():void{
        this.read()
        this.read()
        this.read()

    }

    protected read():any
    process(data:any):any
    save(data:any):any


}
// CSVDataProcessor
class CSVDataProcessor extends IDataProcessor{
    run():void{
        this.read()
        this.process()
        this.save()
    }

    read(): void {
        console.log("reading")
    }

    process(data?: BufferSource): void {   
        console.log("buffer process")
    }

    save(result?: BufferSource[]): boolean {
        // suppose this is failed
        return false   
    }
}



// JSONDataProcessor
class JSONDataProcessor extends IDataProcessor{
    run():void{
        this.read()
        this.process()
        this.save()
    }

    read(): void {
        console.log("reading")
    }

    process(data?: BufferSource): void {
        console.log("buffer process")
    }

    save(result?: BufferSource[]): boolean {
        // suppose this is success
        return true   
    }
}

const csv = new CSVDataProcessor();
csv.run();

const json = new JSONDataProcessor();
json.run();

