import { PostMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FindManyPostsInput, FindOnePostInput } from "./posts.input"

@Injectable()
export class PostsService {
    constructor(
    @InjectRepository(PostMySqlEntity)
    private readonly postMySqlRepository: Repository<PostMySqlEntity>,
    ) {}

    async findOnePost(input: FindOnePostInput): Promise<PostMySqlEntity> {
        return await this.postMySqlRepository.findOneBy(input)
    }

    async findManyPosts(input: FindManyPostsInput): Promise<PostMySqlEntity[]> {
        const founds = await this.postMySqlRepository.findAndCount({
            where: {
                courseId: input.courseId,
            },
            take: input.take,
            skip: input.skip,
            relations: {
                postContents: true,
                creator: true,
                course: true,
            },
        })
        return founds[0]
    }
}
