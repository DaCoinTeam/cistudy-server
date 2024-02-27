import { StorageService } from "@global"
import { Injectable } from "@nestjs/common"
import {
    CreateCommentInput,
    CreatePostInput,
    UpsertReactPostInput,
    UpdateCommentInput,
    UpdatePostInput,
} from "./posts.input"
import {
    PostMySqlEntity,
    PostReactMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentMediaMySqlEntity,
    PostMediaMySqlEntity
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
        private readonly storageService: StorageService,
    ) { }

    async createPost(input: CreatePostInput): Promise<string> {
        console.log(input)
        const { data, files, userId } = input

        const { postMedias, title, courseId, html } = data
        const post: DeepPartial<PostMySqlEntity> = {
            title,
            courseId,
            creatorId: userId,
            html,
            postMedias: [],
        }

        const promises: Array<Promise<void>> = []

        let mediaPosition = 0
        for (const postMedia of postMedias) {
            const { mediaIndex, mediaType } = postMedia

            const position = mediaPosition
            const promise = async () => {
                const file = files.at(mediaIndex)
                const { assetId } = await this.storageService.upload({
                    rootFile: file,
                })
                post.postMedias.push({
                    position,
                    mediaId: assetId,
                    mediaType
                } as PostMediaMySqlEntity)
            }
            mediaPosition++
            promises.push(promise())
        }
        await Promise.all(promises)

        const created = await this.postMySqlRepository.save(post)

        return `A post with id ${created.postId} has been created successfully.`
    }

    async updatePost(input: UpdatePostInput): Promise<string> {
        // const { data, files } = input
        // const { postContents, postId, title } = data

        // const post: DeepPartial<PostMySqlEntity> = {
        //     postId,
        //     title,
        // }
        // await this.postMySqlRepository.update(postId, post)

        // await this.postContentsMySqlRepository.delete({
        //     postId,
        // })

        // const promises: Array<Promise<void>> = []
        // const appendedPostContents = this.appendIndexFile(postContents)

        // for (const appendedPostContent of appendedPostContents) {
        //     appendedPostContent.postId = postId
        //     if (
        //         appendedPostContent.contentType === ContentType.Image ||
        // appendedPostContent.contentType === ContentType.Video
        //     ) {
        //         const promise = async () => {
        //             const file = files.at(appendedPostContent.indexFile)
        //           //  const { assetId } = await this.storageService.upload(file)
        //          //   appendedPostContent.content = assetId
        //         }
        //         promises.push(promise())
        //     }
        // }
        // await Promise.all(promises)

        //await this.postContentsMySqlRepository.save(appendedPostContents)

        return "A post with id  has been updated successfully."
    }

    async upsertReactPost(input: UpsertReactPostInput) {
        const { userId, data } = input
        const { postId, liked } = data
        const found = await this.postReactMySqlRepository.findOne({
            where: {
                userId,
                postId,
            }
        })

        if (found === null) {
            // do claim rewards action

            const postReact = await this.postReactMySqlRepository.save({
                userId,
                postId,
                liked
            })
            return `A react with ${postReact.postReactId} has been created successfully.`
        }

        const { postReactId } = found
        await this.postReactMySqlRepository.update(postReactId, {
            liked
        })

        return `A react with ${postReactId} has been updated successfully.`
    }

    async createComment(input: CreateCommentInput) {
        const { data, files, userId } = input
        const { postCommentMedias, postId, html } = data
        const postComment: DeepPartial<PostCommentMySqlEntity> = {
            postId,
            creatorId: userId,
            html,
            postCommentMedias: [],
        }

        const promises: Array<Promise<void>> = []

        let mediaPosition = 0
        for (const postCommentMedia of postCommentMedias) {
            const { mediaIndex, mediaType } = postCommentMedia
            const position = mediaPosition
            const promise = async () => {
                const file = files.at(mediaIndex)
                const { assetId } = await this.storageService.upload({
                    rootFile: file,
                })
                postComment.postCommentMedias.push({
                    position,
                    mediaId: assetId,
                    mediaType
                } as PostCommentMediaMySqlEntity)
            }
            mediaPosition++
            promises.push(promise())
        }

        await Promise.all(promises)

        const created = await this.postCommentMySqlRepository.save(postComment)
        return `A post comment with id ${created.postCommentId} has been created successfully.`
    }

    async updateComment(input: UpdateCommentInput) {
        //     const { data, files } = input
        //     const { postCommentContents, postCommentId } = data

        //     await this.postCommentMySqlRepository.update(postCommentId, {})

        //     await this.postCommentContentMySqlRepository.delete({
        //         postCommentId,
        //     })

        //     const promises: Array<Promise<void>> = []
        //     const appendedPostCommentContents =
        //   this.appendIndexFile(postCommentContents)

        //     for (const appendedPostCommentContent of appendedPostCommentContents) {
        //         appendedPostCommentContent.postCommentId = postCommentId
        //         if (
        //             appendedPostCommentContent.contentType === ContentType.Image ||
        //     appendedPostCommentContent.contentType === ContentType.Video
        //         ) {
        //             const promise = async () => {
        //                 const file = files.at(appendedPostCommentContent.indexFile)
        //                 //  const { assetId } = await this.storageService.upload(file)
        //                 // appendedPostCommentContent.postCommentId = assetId
        //             }
        //             promises.push(promise())
        //         }
        //     }
        //     await Promise.all(promises)

        //     await this.postCommentContentMySqlRepository.save(appendedPostCommentContents)

        return "A post comment with id has been updated successfully."
    }
}
