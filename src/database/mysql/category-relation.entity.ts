import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { CategoryEntity } from "./category.entity"

@ObjectType()
@Entity("category-relation")
export class CategoryRelationEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      categoryRelationId: string

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => ID)
  @Column({ type: "uuid", length: 36 })
      categoryId: string

  @Field(() => ID)
  @Column({ type: "uuid", length: 36 })
      categoryParentId: string

  @Field(() => CategoryEntity, {nullable: true})
  @ManyToOne(() => CategoryEntity, (category) => category.categoryRelations, {
      onDelete: "CASCADE",
  })
  @JoinColumn({ name: "categoryId" })
      category: CategoryEntity

  @Field(() => CategoryEntity, {nullable : true})
  @ManyToOne(
      () => CategoryEntity,
      (category) => category.categoryParentRelations,
      { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "categoryParentId" })
      categoryParent: CategoryEntity
}
