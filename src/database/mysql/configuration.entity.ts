import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@ObjectType()
@Entity("configuration")
export class ConfigurationEntity {
    @Field(() => ID, { nullable: true})
    @PrimaryGeneratedColumn("uuid")
        configurationId: string
    
    @Field(() => Float, { defaultValue: 0, nullable: true })
    @Column({ type: "float", default: 0 })
        earn: number

    @Field(() => Float, { defaultValue: 0, nullable: true })
    @Column({ type: "float", default: 0 })
        instructor: number

    @Field(() => Float, { defaultValue: 0, nullable: true })
    @Column({ type: "float", default: 0 })
        completed: number

    @Field(() => Float, { defaultValue: 0, nullable: true })
    @Column({ type: "float", default: 0 })
        foundation: number

    @Field(() => Date)
    @Column({ type: "datetime" })
        appliedAt: Date
    
    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date
}
