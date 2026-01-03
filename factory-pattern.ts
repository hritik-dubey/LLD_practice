/*
    You are building a payment module.
    Based on input "UPI" | "CARD" | "WALLET" you must return the correct payment processor.

    Each processor must implement:

    process(amount: number): void;


    Create:

    UPIPayment

    CardPayment

    WalletPayment

    PaymentFactory

    Calling:

    PaymentFactory.create("UPI").process(100);


    should work.

    Goal:

    Factory must follow OCP: adding a new payment method must NOT modify existing code.

    No if/else chains inside process().

    No object creation spread across the system — only the factory creates them.
*/


// interface IPaymentProcess{
//     process(amount:number):void
// }

// class UPIPayment implements IPaymentProcess{
//     public process(amount:number):void{
//         console.log(amount)
//     }
// }

// class CardPayment implements IPaymentProcess{
//     public process(amount:number):void{
//         console.log(amount)
//     }
// }

// class WalletPayment implements IPaymentProcess{
//     public process(amount:number):void{
//         console.log(amount)
//     }
// }

// enum PaymentType{
//     UPI,
//     CARD,
//     WALLET
// }

// class PaymentFactory{
//     static create(paymentType: PaymentType):IPaymentProcess|undefined{
//         switch (paymentType){
//             case PaymentType.UPI:{
//                 return new UPIPayment()
//             }
//             case PaymentType.CARD:{
//                 return new CardPayment()
//             }
//             case PaymentType.WALLET:{
//                 return new WalletPayment()
//             }
//             default:
//                 return undefined
//         }
//     }
// }

// PaymentFactory.create(PaymentType.UPI)?.process(100)
// PaymentFactory.create(PaymentType.CARD)?.process(100)

/*
    learning here we are using the switch every time we have to add the new type we have to add the switch conditions so we need to avoid this by making one variable we we store the complete things
    example create one mapper which store the type and the value which we will use 

    one more thing in this here we are accepting the class and returning the object so fro this we have to send this like this  { new(): IPaymentProcess }

    now one more thing how to decide the singleton class,
    we we don't need to store the state of the object  

*/

interface IPaymentProcess {
    process(amount: number): void
}

class UPIPayment implements IPaymentProcess {
    public process(amount: number): void {
        console.log(amount)
    }
}

class CardPayment implements IPaymentProcess {
    public process(amount: number): void {
        console.log(amount)
    }
}

class WalletPayment implements IPaymentProcess {
    public process(amount: number): void {
        console.log(amount)
    }
}

enum PaymentType {
    UPI,
    CARD,
    WALLET
}

class PaymentFactory {

    private static registeredMethods = new Map<PaymentType,{ new(): IPaymentProcess }>()

    public static registerMethods(name: PaymentType, instance: { new(): IPaymentProcess }): void {
        this.registeredMethods.set(name, instance)

    }

    public static create(paymentType: PaymentType): IPaymentProcess {
        let instance = this.registeredMethods.get(paymentType)
        if (!instance) {
            throw new Error("payment type not found")
        }
        return new instance()
    }
}


PaymentFactory.registerMethods(PaymentType.UPI,UPIPayment)
PaymentFactory.registerMethods(PaymentType.CARD,CardPayment)

PaymentFactory.create(PaymentType.UPI)?.process(100)
PaymentFactory.create(PaymentType.CARD)?.process(100)



