import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm"

import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PostEntity } from "./post.entity"
import { MediaType } from "@common"

@ObjectType()
@Entity("post_media")
export class PostMediaEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        postMediaId: string

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        position: number

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        mediaId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        postId: string

    @Field(() => String)
    @Column({
        type: "enum",
        enum: MediaType,
        default: MediaType.Image,
    })
        mediaType: MediaType
    
    @Field(() => PostEntity)
    @ManyToOne(
        () => PostEntity,
        (post) => post.postMedias,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "postId" })
        post: PostEntity

}
