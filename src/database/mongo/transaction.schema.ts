import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { Address, LogsOutput } from "web3"

export type TransactionMongoDocument = HydratedDocument<TransactionMongo>;

@Schema({
    collection: "transaction"
})
export class TransactionMongo {
    @Prop()
        transactionHash: string

    @Prop()
        from: Address

    @Prop()
        to: Address

    @Prop()
        value: string

    @Prop({ type: Boolean, default: false})
        isValidated: boolean

    @Prop({ type: Date, default: Date.now })
        createdAt: Date

    @Prop({ type: Date, default: Date.now })
        updatedAt: Date

    @Prop({
        type: Object
    })
        log: LogsOutput
}

export const TransactionMongoSchema = SchemaFactory.createForClass(TransactionMongo)



TransactionMongoSchema.pre("findOneAndUpdate", async function (next) {
    const data = this.getUpdate()
    if (data && "updatedAt" in data) {
        data.updatedAt = new Date()
    }
    next()
})