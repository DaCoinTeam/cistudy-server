import { StorageService } from "@global"
import { Injectable } from "@nestjs/common"
import {
    CreatePostCommentInput,
    CreatePostInput,
    ToggleLikePostInput,
    ToggleLikePostCommentInput,
    CreatePostCommentReplyInput,
    UpdatePostCommentReplyInput,
    DeletePostCommentReplyInput,
    UpdatePostCommentInput,
    DeletePostCommentInput,
} from "./posts.input"
import {
    PostMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentMediaMySqlEntity,
    PostMediaMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentReplyMySqlEntity,
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial, DataSource } from "typeorm"
import {
    CreatePostCommentOutput,
    CreatePostCommentReplyOutput,
    DeletePostCommentOutput,
    DeletePostCommentReplyOutput,
    UpdatePostCommentOutput,
    UpdatePostCommentReplyOutput,
} from "./posts.output"

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostMySqlEntity)
        private readonly postMySqlRepository: Repository<PostMySqlEntity>,
        @InjectRepository(PostLikeMySqlEntity)
        private readonly postLikeMySqlRepository: Repository<PostLikeMySqlEntity>,
        @InjectRepository(PostCommentLikeMySqlEntity)
        private readonly postCommentLikeMySqlRepository: Repository<PostCommentLikeMySqlEntity>,
        @InjectRepository(PostCommentMySqlEntity)
        private readonly postCommentMySqlRepository: Repository<PostCommentMySqlEntity>,
        @InjectRepository(PostCommentMediaMySqlEntity)
        private readonly postCommentMediaMySqlRepository: Repository<PostCommentMediaMySqlEntity>,
        @InjectRepository(PostCommentReplyMySqlEntity)
        private readonly postCommentReplyMySqlRepository: Repository<PostCommentReplyMySqlEntity>,
        private readonly storageService: StorageService,
        private readonly dataSource: DataSource
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
                    mediaType,
                } as PostMediaMySqlEntity)
            }
            mediaPosition++
            promises.push(promise())
        }
        await Promise.all(promises)

        const created = await this.postMySqlRepository.save(post)

        return `A post with id ${created.postId} has been created successfully.`
    }

    async toggleLikePost(input: ToggleLikePostInput) {
        const { userId, data } = input
        const { postId } = data

        const found = await this.postLikeMySqlRepository.findOne({
            where: {
                userId,
                postId,
            },
        })

        const responseMessage = (postLikeId: string, liked: boolean = true) =>
            `${liked ? "Like" : "Unlike"} post successfully with id ${postLikeId}`

        if (found === null) {
            // do claim rewards action

            const postLike = await this.postLikeMySqlRepository.save({
                userId,
                postId,
            })
            const { postLikeId, liked } = postLike
            return responseMessage(postLikeId, liked)
        }

        const { postLikeId, liked } = found
        await this.postLikeMySqlRepository.update(postLikeId, {
            liked: !liked,
        })

        return responseMessage(postLikeId, !liked)
    }

    async createPostComment(input: CreatePostCommentInput): Promise<CreatePostCommentOutput> {
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
                    mediaType,
                } as PostCommentMediaMySqlEntity)
            }
            mediaPosition++
            promises.push(promise())
        }

        await Promise.all(promises)

        const { postCommentId } = await this.postCommentMySqlRepository.save(postComment)
        return {
            postCommentId
        }
    }

    async updatePostComment(input: UpdatePostCommentInput): Promise<UpdatePostCommentOutput> {
        const { data, files } = input
        const { postCommentMedias, postCommentId, html } = data
        const postComment: DeepPartial<PostCommentMySqlEntity> = {
            postCommentId,
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
                    mediaType,
                } as PostCommentMediaMySqlEntity)
            }
            mediaPosition++
            promises.push(promise())
        }

        await Promise.all(promises)

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const deletedPostCommentMedias = await this.postCommentMediaMySqlRepository.findBy({ postCommentId })
            await this.postCommentMediaMySqlRepository.delete({ postCommentId })
            await this.postCommentMySqlRepository.save(postComment)

            await queryRunner.commitTransaction()

            const mediaIds = deletedPostCommentMedias.map(deletedPostCommentMedia => deletedPostCommentMedia.mediaId)
            await this.storageService.delete(...mediaIds)

            return {}
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async deletePostComment(input: DeletePostCommentInput ): Promise<DeletePostCommentOutput> {
        const { data } = input
        const { postCommentId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const deletedPostCommentMedias = await this.postCommentMediaMySqlRepository.findBy({ postCommentId })
            await this.postCommentMySqlRepository.delete({ postCommentId })
            
            await queryRunner.commitTransaction()

            const mediaIds = deletedPostCommentMedias.map(deletedPostCommentMedia => deletedPostCommentMedia.mediaId)
            await this.storageService.delete(...mediaIds)

            return {}
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        return {}
    }

    async toggleLikePostComment(input: ToggleLikePostCommentInput) {
        const { userId, data } = input
        const { postCommentId } = data

        const found = await this.postCommentLikeMySqlRepository.findOne({
            where: {
                userId,
                postCommentId,
            },
        })

        const responseMessage = (
            postCommentLikeId: string,
            liked: boolean = true,
        ) =>
            `${liked ? "Like" : "Unlike"} post comment successfully with id ${postCommentLikeId}`

        if (found === null) {
            // do claim rewards action

            const postCommentLike = await this.postCommentLikeMySqlRepository.save({
                userId,
                postCommentId,
            })
            const { postCommentLikeId, liked } = postCommentLike
            return responseMessage(postCommentLikeId, liked)
        }

        const { postCommentLikeId, liked } = found
        await this.postCommentLikeMySqlRepository.update(postCommentLikeId, {
            liked: !liked,
        })

        return responseMessage(postCommentLikeId, !liked)
    }

    async createPostCommentReply(
        input: CreatePostCommentReplyInput,
    ): Promise<CreatePostCommentReplyOutput> {
        const { data, userId } = input
        const { content, postCommentId } = data

        const { postCommentReplyId } = await this.postCommentReplyMySqlRepository.save({
            content,
            creatorId: userId,
            postCommentId,
        })

        return {
            postCommentReplyId,
        }
    }

    async updatePostCommentReply(
        input: UpdatePostCommentReplyInput,
    ): Promise<UpdatePostCommentReplyOutput> {
        const { data } = input
        const { content, postCommentReplyId } = data

        await this.postCommentReplyMySqlRepository.update(postCommentReplyId, {
            content,
        })

        return {}
    }

    async deletePostCommentReply(
        input: DeletePostCommentReplyInput,
    ): Promise<DeletePostCommentReplyOutput> {
        const { data } = input
        const { postCommentReplyId } = data

        await this.postCommentReplyMySqlRepository.delete(postCommentReplyId)

        return {}
    }
}
