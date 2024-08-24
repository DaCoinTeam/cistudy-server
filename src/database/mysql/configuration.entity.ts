import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@ObjectType()
@Entity("configuration")
export class ConfigurationEntity {
    @Field(() => ID, { nullable: true})
    @PrimaryGeneratedColumn("uuid")
        configurationId: string
    
    @Field(() => Float, { defaultValue: 10, nullable: true })
    @Column({ type: "float", default: 10 })
        foundation: number

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date
}
