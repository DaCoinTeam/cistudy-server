import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "./category.entity"
import { TopicEntity } from "./topic.entity"

@ObjectType()
@Entity("sub_category")
export class SubCategoryEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        subCategoryId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 1000, nullable: true })
        name: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        categoryId: string

    @Field(() => CategoryEntity)
    @ManyToOne(() => CategoryEntity, (category) => category.subCategories)
    @JoinColumn({ name: "categoryId" })
        category: CategoryEntity

    @Field(() => [TopicEntity])
    @OneToMany(() => TopicEntity, (topic) => topic.subCategory)
        topics: Array<TopicEntity>
}