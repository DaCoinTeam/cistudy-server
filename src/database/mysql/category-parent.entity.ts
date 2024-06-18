import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne, JoinColumn } from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CategoryEntity } from "./category.entity"

@ObjectType()
@Entity("category-parent")
export class CategoryParentEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  categoryParentId: string

  @Field(() => ID)
  @Column({ type: "uuid" })
  categoryId: string

  @Field(() => [CategoryEntity])
  @ManyToOne(() => CategoryEntity, (category) => category.baseCategoryParents)
  @JoinColumn({name: "categoryParentId"})
  baseCategory: CategoryEntity
    
  @Field(() => [CategoryEntity])
  @OneToMany(() => CategoryEntity, (category) => category.categoryParent)
  categories: Array<CategoryEntity>
}
