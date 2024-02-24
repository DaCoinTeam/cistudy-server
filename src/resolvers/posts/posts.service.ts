import { PostCommentMySqlEntity, PostMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FindManyPostsInput, FindOnePostCommentInput, FindOnePostInput } from "./posts.input"

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostMySqlEntity)
        private readonly postMySqlRepository: Repository<PostMySqlEntity>,
        @InjectRepository(PostCommentMySqlEntity)
        private readonly postCommentMySqlRepository: Repository<PostCommentMySqlEntity>,
    ) { }

    async findOnePost(input: FindOnePostInput): Promise<PostMySqlEntity> {
        const { data } = input
        return await this.postMySqlRepository.findOne({
            where: data,
            relations: {
                creator: true,
                course: true,
                postReacts: true,
                postComments: {
                    creator: true,
                    postCommentMedias: true  
                },
                postMedias: true
            },
        })
    }

    async findOnePostComment(input: FindOnePostCommentInput): Promise<PostCommentMySqlEntity> {
        const { data } = input
        return await this.postCommentMySqlRepository.findOne({
            where: data,
            relations: {
                creator: true,
                postCommentMedias: true
            },
        })
    }

    async findManyPosts(input: FindManyPostsInput): Promise<Array<PostMySqlEntity>> {
        const { data } = input
        return await this.postMySqlRepository.find({
            where: {
                courseId: data.courseId,
            },
            take: data.options?.take,
            skip: data.options?.skip,
            relations: {
                postMedias: true,
                creator: true,
                course: true,
                postReacts: true
            },
        })
    }
}
