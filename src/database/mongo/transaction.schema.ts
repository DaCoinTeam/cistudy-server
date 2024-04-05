import { Field, ObjectType } from "@nestjs/graphql"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"
import { Address, LogsOutput } from "web3"

export type TransactionMongoEntityDocument = HydratedDocument<TransactionMongoEntity>;

@ObjectType()
@Schema({
    collection: "transaction"
})
export class TransactionMongoEntity {
    @Field(() => String)
    @Prop()
        transactionHash: string

    @Field(() => String)
    @Prop()
        from: Address

    @Field(() => String)
    @Prop()
        to: Address

    @Field(() => String)
    @Prop()
        value: string

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false})
        isValidated: boolean

    @Field(() => Date)
    @Prop({ type: Date, default: Date.now })
        createdAt: Date

    @Field(() => Date)
    @Prop({ type: Date, default: Date.now })
        updatedAt: Date

    @Prop({
        type: Object
    })
        log: LogsOutput
}

export const TransactionMongoEntitySchema = SchemaFactory.createForClass(TransactionMongoEntity)

TransactionMongoEntitySchema.pre("findOneAndUpdate", async function (next) {
    const data = this.getUpdate()
    if (data && "updatedAt" in data) {
        data.updatedAt = new Date()
    }
    next()
})