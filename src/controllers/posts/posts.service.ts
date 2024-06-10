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
    UpdatePostInput,
    DeletePostInput,
} from "./posts.input"
import {
    PostMySqlEntity,
    PostLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentMediaMySqlEntity,
    PostMediaMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentReplyMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    UserMySqlEntity,
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial, DataSource } from "typeorm"
import {
    CreatePostCommentOutput,
    CreatePostCommentReplyOutput,
    DeletePostCommentOutput,
    DeletePostCommentReplyOutput,
    DeletePostOutput,
    ToggleCommentLikePostOutputData,
    ToggleLikePostOutputData,
    UpdatePostCommentOutput,
    UpdatePostCommentReplyOutput,
    UpdatePostOutput,
} from "./posts.output"
import { blockchainConfig } from "@config"

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostMySqlEntity)
        private readonly postMySqlRepository: Repository<PostMySqlEntity>,
        @InjectRepository(PostMediaMySqlEntity)
        private readonly postMediaMySqlRepository: Repository<PostMediaMySqlEntity>,
        @InjectRepository(UserMySqlEntity)
        private readonly userMySqlRepository: Repository<UserMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(EnrolledInfoMySqlEntity)
        private readonly enrolledInfoMySqlEntity: Repository<EnrolledInfoMySqlEntity>,
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
        private readonly dataSource: DataSource,
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
        console.log("tong so hinh la :" + postMedias.length)
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

    async updatePost(input: UpdatePostInput): Promise<UpdatePostOutput> {
        const { data, files, userId } = input

        const { postMedias, title, postId, html } = data
        const post: DeepPartial<PostMySqlEntity> = {
            postId,
            title,
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

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const deletedPostMedias = await this.postMediaMySqlRepository.findBy({
                postId,
            })
            await this.postMediaMySqlRepository.delete({ postId })
            await this.postMySqlRepository.save(post)

            await queryRunner.commitTransaction()

            const mediaIds = deletedPostMedias.map(
                (deletedPostMedia) => deletedPostMedia.mediaId,
            )
            await this.storageService.delete(...mediaIds)

            return {message : "Post Updated Successfully"}
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async deletePost(input: DeletePostInput): Promise<DeletePostOutput> {
        const { data } = input
        const { postId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const deletedPostMedias = await this.postMediaMySqlRepository.findBy({
                postId,
            })
            await this.postMySqlRepository.delete({ postId })

            await queryRunner.commitTransaction()

            const mediaIds = deletedPostMedias.map(
                (deletedPostMedia) => deletedPostMedia.mediaId,
            )
            await this.storageService.delete(...mediaIds)

            return {message: "Post Deleted Successfully"}
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    //like
    async toggleLikePost(
        input: ToggleLikePostInput,
    ): Promise<ToggleLikePostOutputData> {
        const { userId, data } = input
        const { postId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let earnAmount: number
            let found = await this.postLikeMySqlRepository.findOne({
                where: {
                    userId,
                    postId,
                },
            })

            if (found === null) {
                found = await this.postLikeMySqlRepository.save({
                    userId,
                    postId,
                })

                const { courseId } = await this.postMySqlRepository.findOneBy({
                    postId,
                })

                const { priceAtEnrolled } = await this.enrolledInfoMySqlEntity.findOneBy({
                    userId,
                    courseId
                })

                earnAmount = priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.likePostEarnCoefficient
                await this.userMySqlRepository.increment({ userId }, "balance", earnAmount)
            } else {
                const { postLikeId, liked } = found
                await this.postLikeMySqlRepository.update(postLikeId, {
                    liked: !liked,
                })
            }

            const { postLikeId } = found
            return {
                message: "",
                others:{
                    postLikeId :postLikeId,
                    earnAmount: earnAmount
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async createPostComment(
        input: CreatePostCommentInput,
    ): Promise<CreatePostCommentOutput> {
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

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const { postCommentId } =
            await this.postCommentMySqlRepository.save(postComment)

            const { post } = await this.postCommentMySqlRepository.findOne({
                where: {
                    postCommentId
                },
                relations: {
                    post: {
                        course: true
                    }
                }
            })

            const { priceAtEnrolled } = await this.enrolledInfoMySqlEntity.findOneBy({
                userId,
                courseId: post.courseId
            })

            const earnAmount = priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.commentPostEarnCoefficient
            await this.userMySqlRepository.increment({ userId }, "balance", earnAmount)

            return {
                message: "Comment Posted Successfully",
                others:{
                    postCommentId,
                    earnAmount
                }
                
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async updatePostComment(
        input: UpdatePostCommentInput,
    ): Promise<UpdatePostCommentOutput> {
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
            const deletedPostCommentMedias =
                await this.postCommentMediaMySqlRepository.findBy({ postCommentId })
            await this.postCommentMediaMySqlRepository.delete({ postCommentId })
            await this.postCommentMySqlRepository.save(postComment)

            await queryRunner.commitTransaction()

            const mediaIds = deletedPostCommentMedias.map(
                (deletedPostCommentMedia) => deletedPostCommentMedia.mediaId,
            )
            await this.storageService.delete(...mediaIds)

            return {message :"Comment updated successfully"}
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async deletePostComment(
        input: DeletePostCommentInput,
    ): Promise<DeletePostCommentOutput> {
        const { data } = input
        const { postCommentId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const deletedPostCommentMedias =
                await this.postCommentMediaMySqlRepository.findBy({ postCommentId })
            await this.postCommentMySqlRepository.delete({ postCommentId })

            await queryRunner.commitTransaction()

            const mediaIds = deletedPostCommentMedias.map(
                (deletedPostCommentMedia) => deletedPostCommentMedia.mediaId,
            )
            await this.storageService.delete(...mediaIds)

            return {message: "Comment deleted successfully"}
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async toggleLikePostComment(input: ToggleLikePostCommentInput) : Promise<ToggleCommentLikePostOutputData> {
        const { userId, data } = input
        const { postCommentId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let earnAmount: number
            let found = await this.postCommentLikeMySqlRepository.findOne({
                where: {
                    userId,
                    postCommentId,
                },
            })

            if (found === null) {
                found = await this.postCommentLikeMySqlRepository.save({
                    userId,
                    postCommentId,
                })

                const { post } = await this.postCommentMySqlRepository.findOne({
                    where: {
                        postCommentId
                    },
                    relations: {
                        post: {
                            course: true
                        }
                    }
                })

                const { priceAtEnrolled } = await this.enrolledInfoMySqlEntity.findOneBy({
                    userId,
                    courseId: post.courseId
                })

                earnAmount = priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.likePostCommentEarnCoefficient
                await this.userMySqlRepository.increment({ userId }, "balance", earnAmount)
            } else {
                const { postCommentLikeId, liked } = found
                await this.postCommentLikeMySqlRepository.update(postCommentLikeId, {
                    liked: !liked,
                })
            }
            const { postCommentLikeId } = found
            return {
                message:"",
                others:{
                    postCommentLikeId,
                    earnAmount
                }
                
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async createPostCommentReply(
        input: CreatePostCommentReplyInput,
    ): Promise<CreatePostCommentReplyOutput> {
        const { data, userId } = input
        const { content, postCommentId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const { postCommentReplyId } = await this.postCommentReplyMySqlRepository.save({
                content,
                creatorId: userId,
                postCommentId,
            })

            return {
                message:"Reply created successfully",
                others: {postCommentReplyId}
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
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

        return {message : "Reply Updated Successfully"}
    }

    async deletePostCommentReply(
        input: DeletePostCommentReplyInput,
    ): Promise<DeletePostCommentReplyOutput> {
        const { data } = input
        const { postCommentReplyId } = data

        await this.postCommentReplyMySqlRepository.delete(postCommentReplyId)

        return {message : "Reply deleted successfully"}
    }
}
