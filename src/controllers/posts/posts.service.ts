import { StorageService } from "@global"
import { Injectable } from "@nestjs/common"
import {
    CreateCommentInput,
    CreatePostInput,
    ReactPostInput,
    UpdateCommentInput,
    UpdatePostInput,
    ContentData,
} from "./posts.input"
import { ContentType, IndexFileAppended } from "@common"
import {
    PostMySqlEntity,
    PostReactMySqlEntity,
    PostCommentMySqlEntity,
    PostContentMySqlEntity,
    PostCommentContentMySqlEntity,
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial } from "typeorm"

@Injectable()
export class PostsService {
    constructor(
    @InjectRepository(PostMySqlEntity)
    private readonly postMySqlRepository: Repository<PostMySqlEntity>,
    @InjectRepository(PostReactMySqlEntity)
    private readonly postReactMySqlRepository: Repository<PostReactMySqlEntity>,
    @InjectRepository(PostCommentMySqlEntity)
    private readonly postCommentMySqlRepository: Repository<PostCommentMySqlEntity>,
    @InjectRepository(PostContentMySqlEntity)
    private readonly postContentsMySqlRepository: Repository<PostContentMySqlEntity>,
    @InjectRepository(PostCommentContentMySqlEntity)
    private readonly postCommentContentMySqlRepository: Repository<PostCommentContentMySqlEntity>,

    private readonly storageService: StorageService,
    ) {}

    private appendIndexFile<T extends ContentData>(
        postContents: Array<T>,
    ): Array<IndexFileAppended<T>> {
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
                   // const file = files.at(appendedPostContent.indexFile)
                  //  const { assetId } = await this.storageService.upload(file)
                  //  appendedPostContent.content = assetId
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
            title,
        }
        await this.postMySqlRepository.update(postId, post)

        await this.postContentsMySqlRepository.delete({
            postId,
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
                  //  const { assetId } = await this.storageService.upload(file)
                 //   appendedPostContent.content = assetId
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
        const found = await this.postReactMySqlRepository.findOneBy({
            userId,
            postId,
        })

        let postReactId: string
        let liked: boolean

        if (found === null) {
            // do claim rewards action
        } else {
            postReactId = found.postReactId
            liked = !found.liked
        }

        const postReact = await this.postReactMySqlRepository.save({
            postReactId,
            userId,
            postId,
            liked,
        })

        return `Successfully react the post with id ${postReact.postReactId}.`
    }

    async createComment(input: CreateCommentInput) {
        const { userId, data, files } = input
        const { postId, postCommentContents } = data

        const promises: Array<Promise<void>> = []
        const appendedPostCommentContents =
      this.appendIndexFile(postCommentContents)

        for (const appendedPostCommentContent of appendedPostCommentContents) {
            if (
                appendedPostCommentContent.contentType === ContentType.Image ||
        appendedPostCommentContent.contentType === ContentType.Video
            ) {
                const promise = async () => {
                    const file = files.at(appendedPostCommentContent.indexFile)
                  //  const { assetId } = await this.storageService.upload(file)
                  //  appendedPostCommentContent.content = assetId
                }
                promises.push(promise())
            }
        }
        await Promise.all(promises)

        const postComment: DeepPartial<PostCommentMySqlEntity> = {
            ...data,
            userId,
            postId,
            postCommentContents: appendedPostCommentContents.map(
                (appendedPostContent, index) => ({
                    ...appendedPostContent,
                    index,
                }),
            ),
        }

        const created = await this.postCommentMySqlRepository.save(postComment)
        return `A post comment with id ${created.postCommentId} has been created successfully.`
    }

    async updateComment(input: UpdateCommentInput) {
        const { data, files } = input
        const { postCommentContents, postCommentId } = data

        await this.postCommentMySqlRepository.update(postCommentId, {})

        await this.postCommentContentMySqlRepository.delete({
            postCommentId,
        })

        const promises: Array<Promise<void>> = []
        const appendedPostCommentContents =
      this.appendIndexFile(postCommentContents)

        for (const appendedPostCommentContent of appendedPostCommentContents) {
            appendedPostCommentContent.postCommentId = postCommentId
            if (
                appendedPostCommentContent.contentType === ContentType.Image ||
        appendedPostCommentContent.contentType === ContentType.Video
            ) {
                const promise = async () => {
                    const file = files.at(appendedPostCommentContent.indexFile)
                    //  const { assetId } = await this.storageService.upload(file)
                    // appendedPostCommentContent.postCommentId = assetId
                }
                promises.push(promise())
            }
        }
        await Promise.all(promises)

        await this.postCommentContentMySqlRepository.save(appendedPostCommentContents)

        return `A post comment with id ${postCommentId} has been updated successfully.`
    }
}
