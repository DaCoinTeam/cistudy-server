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
import { CategoryRelationEntity } from "./category-relation.entity"

@ObjectType()
@Entity("category")
export class CategoryEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  categoryId: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 1000, nullable: true })
  name: string

  @Field(() => ID, { nullable: true })
  @Column({ type: "uuid", length: 36, nullable: true })
  imageId?: string

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(() => [CourseCategoryEntity], {nullable: true})
  @OneToMany(
    () => CourseCategoryEntity,
    (courseCategory) => courseCategory.category,
  )
  courseCategories: Array<CourseCategoryEntity>

  @Field(() => [CategoryRelationEntity], {nullable: true})
  @OneToMany(
    () => CategoryRelationEntity,
    (categoryParentRelation) => categoryParentRelation.categoryParent,
    { cascade: true }
  )
  categoryParentRelations: Array<CategoryRelationEntity>

  @Field(() => [CategoryRelationEntity], {nullable: true})
  @OneToMany(
    () => CategoryRelationEntity,
    (categoryRelation) => categoryRelation.category,
    { cascade: true }
  )
  categoryRelations: Array<CategoryRelationEntity>
}
