import { SupabaseService } from "@global"
import { Injectable } from "@nestjs/common"
import { CreatePostInput, PostContentData, ReactPostInput, UpdatePostInput } from "./shared"
import { ContentType, IndexFileAppended } from "@common"
import {
    PostMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostContentMySqlEntity,
    PostCommentContentMySqlEntity,
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial } from "typeorm"

@Injectable()
export default class PostService {
    constructor(
    @InjectRepository(PostMySqlEntity)
    private readonly postMySqlRepository: Repository<PostMySqlEntity>,
    @InjectRepository(PostLikeMySqlEntity)
    private readonly postLikeMySqlRepository: Repository<PostLikeMySqlEntity>,
    @InjectRepository(PostCommentMySqlEntity)
    private readonly postCommentMySqlRepository: Repository<PostCommentMySqlEntity>,
    @InjectRepository(PostContentMySqlEntity)
    private readonly postContentsMySqlRepository: Repository<PostContentMySqlEntity>,
    @InjectRepository(PostCommentContentMySqlEntity)
    private readonly postCommentContentMySqlRepository: Repository<PostCommentContentMySqlEntity>,

    private readonly supabaseService: SupabaseService,
    ) {}

    private appendIndexFile(
        postContents: Array<PostContentData>,
    ): Array<IndexFileAppended<PostContentData>> {
        let indexFile = 0
        return postContents.map((postContent) => {
            if (
                postContent.contentType !== ContentType.Image &&
        postContent.contentType !== ContentType.Video
            )
                return postContent

            const appended = {
                ...postContent,
                indexFile,
            }
            indexFile++
            return appended
        })
    }

    async createPost(input: CreatePostInput): Promise<string> {
        const { data, files, userId } = input
        const { postContents } = data

        const promises: Array<Promise<void>> = []
        const appendedPostContents = this.appendIndexFile(postContents)

        for (const appendedPostContent of appendedPostContents) {
            if (
                appendedPostContent.contentType === ContentType.Image ||
        appendedPostContent.contentType === ContentType.Video
            ) {
                const promise = async () => {
                    const file = files.at(appendedPostContent.indexFile)
                    const { assetId } = await this.supabaseService.upload(file)
                    appendedPostContent.content = assetId
                }
                promises.push(promise())
            }
        }
        await Promise.all(promises)

        const post: DeepPartial<PostMySqlEntity> = {
            ...data,
            creatorId: userId,
            postContents: appendedPostContents.map((appendedPostContent, index) => ({
                ...appendedPostContent,
                index,
            })),
        }

        const created = await this.postMySqlRepository.save(post)
        return `A post with id ${created.postId} has been created successfully.`
    }

    async updatePost(input: UpdatePostInput): Promise<string> {
        const { data, files } = input
        const { postContents, postId, title } = data

        const post: DeepPartial<PostMySqlEntity> = {
            postId,
            title
        }
        await this.postMySqlRepository.update(postId, post)

        await this.postContentsMySqlRepository.delete({
            postId
        })
        
        const promises: Array<Promise<void>> = []
        const appendedPostContents = this.appendIndexFile(postContents)

        for (const appendedPostContent of appendedPostContents) {
            appendedPostContent.postId = postId
            if (
                appendedPostContent.contentType === ContentType.Image ||
        appendedPostContent.contentType === ContentType.Video
            ) {
                const promise = async () => {
                    const file = files.at(appendedPostContent.indexFile)
                    const { assetId } = await this.supabaseService.upload(file)
                    appendedPostContent.content = assetId
                }
                promises.push(promise())
            }
        }
        await Promise.all(promises)

        await this.postContentsMySqlRepository.save(appendedPostContents)

        return `A post with id ${postId} has been updated successfully.`
    }

    async reactPost(input: ReactPostInput) {
        const { userId, data } = input
        const { postId } = data
        const found = await this.postLikeMySqlRepository.findOneBy({
            userId,
            postId,
        })

        let postLikeId : string
        let isDeleted = false

        if (found === null)
        {
            // do claim rewards action
        } else {
            postLikeId = found.postLikeId
            isDeleted = !found.isDeleted
        }

        const postLike = await this.postLikeMySqlRepository.save({
            postLikeId,
            userId,
            postId,
            isDeleted
        })

        return `Successfully react the post with id ${postLike.postLikeId}.`
    }
}
