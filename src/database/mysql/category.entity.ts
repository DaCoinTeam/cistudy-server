import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { CourseCategoryEntity } from "./course-category.entity"
import { CategoryParentEntity } from "./category-parent.entity"

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

  @Field(() => [CourseCategoryEntity])
  @OneToMany(
    () => CourseCategoryEntity,
    (courseCategory) => courseCategory.category,
  )
  courseCategories: Array<CourseCategoryEntity>

  @Field(() => ID)
  @Column({ type: "uuid"})
  categoryParentId: string

  @Field(() => CategoryParentEntity)
    @ManyToOne(() => CategoryParentEntity, (categoryParent) => categoryParent.categories)
    @JoinColumn({ name: "categoryParentId" })
    categoryParent: CategoryParentEntity

    @Field(() => [CategoryParentEntity])
    @OneToMany(() => CategoryParentEntity, (categoryParent) => categoryParent.baseCategory)
    baseCategoryParents: Array<CategoryParentEntity>
}
