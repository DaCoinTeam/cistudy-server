import { StorageService } from "@global"
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
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
    MarkPostCommentRewardedInput,
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
    AccountMySqlEntity,
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial, DataSource } from "typeorm"
import {
    CreatePostCommentOutput,
    CreatePostCommentReplyOutput,
    CreatePostOutput,
    DeletePostCommentOutput,
    DeletePostCommentReplyOutput,
    DeletePostOutput,
    MarkPostCommentRewardedOutput,
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
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(EnrolledInfoMySqlEntity)
        private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
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

    async createPost(input: CreatePostInput): Promise<CreatePostOutput> {
        console.log(input)
        const { data, files, accountId } = input
        const { postMedias, title, courseId, html } = data

        const isEnrolled = await this.enrolledInfoMySqlRepository.findOneBy({ accountId, courseId })

        if (!isEnrolled) {
            throw new ConflictException("You must be enrolled to this course before creating a post inside. ")
        }

        const post: DeepPartial<PostMySqlEntity> = {
            title,
            courseId,
            creatorId: accountId,
            html: html ? html : null,
            postMedias: [],
        }
        if (files) {
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
        }

        let earnAmount : number

        const numberOfUserPost = await this.postMySqlRepository.find({
            where: {
                creatorId: accountId,
                courseId
            }
        })

        if (numberOfUserPost.length < 3) {
            post.isRewarded = true
            const { priceAtEnrolled } = await this.enrolledInfoMySqlRepository.findOneBy({accountId, courseId})
            earnAmount = priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.createPostEarnCoefficient
            await this.accountMySqlRepository.increment({ accountId }, "balance", earnAmount)
        }

        const created = await this.postMySqlRepository.save(post)

        return {
            message: `A post with id ${created.postId} has been created successfully.`,
            others: {
                earnAmount
            }
        }
    }

    async updatePost(input: UpdatePostInput): Promise<UpdatePostOutput> {
        const { data, files, accountId } = input
        const { postMedias, title, postId, html } = data

        const post: DeepPartial<PostMySqlEntity> = {
            postId,
            title,
            creatorId: accountId,
            html,
            postMedias: [],
        }

        if (files) {
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
        }



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

            return { message: "Post Updated Successfully" }
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

            return { message: "Post Deleted Successfully" }
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
        const { accountId, data } = input
        const { postId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let earnAmount: number

            const { courseId, creatorId, isRewarded, course, allowComments } = await this.postMySqlRepository.findOne({
                where: {
                    postId
                },
                relations: {
                    course: true
                }
            })

            if(allowComments == false){
                throw new ConflictException("This post is closed")
            }

            const isEnrolled = await this.enrolledInfoMySqlRepository.findOne({
                where: {
                    accountId,
                    courseId
                }
            })

            if (!isEnrolled) {
                throw new ConflictException(`You must be enrolled to course: ${course.title} to interact with this post`)
            }

            const isLiked = await this.postLikeMySqlRepository.findOne({
                where: {
                    accountId,
                    postId
                }
            })

            if (isLiked) {
                throw new ConflictException("You have already liked this post.")
            }

            const numberOfPostLike = await this.postLikeMySqlRepository.findBy({ postId }) 
            
            const numberOfRewardedLike = numberOfPostLike.filter(likeCount => likeCount.accountId !== creatorId)
            

            if (isRewarded) {
                if (creatorId !== accountId) {
                    const { priceAtEnrolled } = isEnrolled
                    if (numberOfRewardedLike.length < 20) {
                        earnAmount = priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.likePostEarnCoefficient
                        await this.accountMySqlRepository.increment({ accountId }, "balance", earnAmount)
                    }
                }
            }

            const { postLikeId } = await this.postLikeMySqlRepository.save({ accountId, postId })

            return {
                message: "Post liked successfully.",
                others: {
                    postLikeId,
                    earnAmount,
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async createPostComment(
        input: CreatePostCommentInput,
    ): Promise<CreatePostCommentOutput> {
        const { data, files, accountId } = input
        const { postCommentMedias, postId, html } = data

        const { courseId, creatorId, isRewarded, course, allowComments } = await this.postMySqlRepository.findOne({
            where: {
                postId
            },
            relations: {
                course: true
            }
        })

        if(allowComments == false){
            throw new ConflictException("This post is closed.")
        }

        const postComment: DeepPartial<PostCommentMySqlEntity> = {
            postId,
            creatorId: accountId,
            html,
            postCommentMedias: [],
        }

        if (files) {
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
        }


        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            let earnAmount: number 
            let isOwner : boolean

            if(creatorId == accountId){
                isOwner = true
            }

            const isEnrolled = await this.enrolledInfoMySqlRepository.findOne({
                where: {
                    accountId,
                    courseId
                }
            })

            if (!isEnrolled) {
                throw new ConflictException(`You must be enrolled to course: ${course.title} to interact with this post`)
            }

            const numberOfPostComments = await this.postCommentMySqlRepository.findBy({ postId });
            const creatorIdsSeen = new Set();

            const filteredComments = numberOfPostComments.filter(comment => {
                if (comment.creatorId === creatorId) {
                    return false;
                }
                if (creatorIdsSeen.has(comment.creatorId)) {
                    return false;
                }
                creatorIdsSeen.add(comment.creatorId);
                return true;
            });

            const numberOfRewardedComments = filteredComments.length;

            if (isRewarded) {
                if (creatorId !== accountId) {
                    const isCommented = await this.postCommentMySqlRepository.find({
                        where: {
                            creatorId: accountId,
                            postId
                        }
                    })
                    if (!isCommented || isCommented.length < 1) {
                        const { priceAtEnrolled } = isEnrolled
                        if (numberOfRewardedComments < 20) {
                            earnAmount = priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.commentPostEarnCoefficient
                            await this.accountMySqlRepository.increment({ accountId }, "balance", earnAmount)
                            
                        }
                    }

                }
            }

            const { postCommentId } = await this.postCommentMySqlRepository.save(postComment)
            return {
                message: "Comment Posted Successfully",
                others: {
                    postCommentId,
                    earnAmount,
                    isOwner
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

            return { message: "Comment updated successfully" }
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

            return { message: "Comment deleted successfully" }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async toggleLikePostComment(input: ToggleLikePostCommentInput): Promise<ToggleCommentLikePostOutputData> {
        const { accountId, data } = input
        const { postCommentId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let earnAmount: number
            let found = await this.postCommentLikeMySqlRepository.findOne({
                where: {
                    accountId,
                    postCommentId,
                },
            })

            if (found === null) {
                found = await this.postCommentLikeMySqlRepository.save({
                    accountId,
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

                const { priceAtEnrolled } = await this.enrolledInfoMySqlRepository.findOneBy({
                    accountId,
                    courseId: post.courseId
                })

            } else {
                const { postCommentLikeId, liked } = found
                await this.postCommentLikeMySqlRepository.update(postCommentLikeId, {
                    liked: !liked,
                })
            }
            const { postCommentLikeId } = found
            return {
                message: "",
                others: {
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
        const { data, accountId } = input
        const { content, postCommentId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const { postCommentReplyId } = await this.postCommentReplyMySqlRepository.save({
                content,
                creatorId: accountId,
                postCommentId,
            })

            return {
                message: "Reply created successfully",
                others: { postCommentReplyId }
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

        return { message: "Reply Updated Successfully" }
    }

    async deletePostCommentReply(
        input: DeletePostCommentReplyInput,
    ): Promise<DeletePostCommentReplyOutput> {
        const { data } = input
        const { postCommentReplyId } = data

        await this.postCommentReplyMySqlRepository.delete(postCommentReplyId)

        return { message: "Reply deleted successfully" }
    }

    async markPostCommentRewarded(input: MarkPostCommentRewardedInput): Promise<MarkPostCommentRewardedOutput> {
        const { data, accountId } = input
        const { postCommentId } = data
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const postComment = await this.postCommentMySqlRepository.findOne({
                where: {
                    postCommentId
                }
            })

            if (!postComment) {
                throw new NotFoundException("Post comment not found")
            }

            const post = await this.postMySqlRepository.findOneBy({ postId: postComment.postId })

            if (post.creatorId !== accountId) {
                throw new ConflictException("You aren't the creator of the post.")
            }

            if (postComment.creatorId == post.creatorId) {
                throw new ConflictException("You can't mark your comment as rewarded.")
            }

            const hasRewardedComment = await this.postCommentMySqlRepository.find({
                where: {
                    postId: postComment.postId
                }
            })

            if (hasRewardedComment.some(accountComment => accountComment.isRewarded == true)) {
                throw new ConflictException("There's already exist a rewarded comment")
            }

            await this.postCommentMySqlRepository.update(postCommentId, { isRewarded: true })

            if (post.isRewarded) {
                const { priceAtEnrolled } = await this.enrolledInfoMySqlRepository.findOne({
                    where: {
                        accountId: postComment.creatorId,
                        courseId: post.courseId
                    }
                })

                const earnAmount = priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.rewardCommentPostEarnCoefficient
                await this.accountMySqlRepository.increment({ accountId: postComment.creatorId }, "balance", earnAmount)
            }

            await this.postMySqlRepository.update(post, { allowComments: false })

            return {
                message: `Comment of user ${postComment.creatorId} has been rewarded and no more comments are allowed to this post`
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}
