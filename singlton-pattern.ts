// You need to design a Logger class for a backend system. Requirements:

// Only one instance of Logger should exist.

// log(message: string) should print the message with a timestamp.

// Any class that imports Logger should always get the same instance, no matter how many times it's used.

class Logger{
    
    private static isObjectCreated:boolean = false
    private static loggerInstance:Logger;
    private constructor(){
    }

    public static getInstance(){
        if(!this.isObjectCreated){
            this.loggerInstance = new Logger() 
            this.isObjectCreated = true
        }
        return this.loggerInstance
    }

    public log(message:string){
        console.log(message +" " + new Date())
    }

}

let logger1 =  Logger.getInstance()
logger1.log("hello from logger2")



let logger2 =  Logger.getInstance()
logger2.log("hello from logger2")



/* learning
    here we don't need to  create the  isObjectCreated variable instead we can managed this buy using the instance only,
    class Logger{

    private static loggerInstance:Logger|null = null;
    private constructor(){
    }

    public static getInstance(){
        if(!this.loggerInstance){
            this.loggerInstance = new Logger() 
        }
        return this.loggerInstance
    }

    public log(message:string){
        console.log(message +" " + new Date())
    }

}
*/