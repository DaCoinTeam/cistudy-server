import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { SubCategoryEntity } from "./sub-category.entity"

@ObjectType()
@Entity("category")
export class CategoryEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        categoryId: string
    
    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 1000, nullable: true })
        name: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => [SubCategoryEntity])
    @OneToMany(() => SubCategoryEntity, (subCategory) => subCategory.category)
        subCategories: Array<SubCategoryEntity>
}