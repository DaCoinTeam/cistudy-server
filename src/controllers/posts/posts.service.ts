import {
    NotificationType,
    ReportProcessStatus,
    TransactionStatus,
    TransactionType,
    computeFixedFloor,
} from "@common"
import { appConfig, blockchainConfig } from "@config"
import {
    AccountMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    NotificationMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentMediaMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentReplyMySqlEntity,
    PostLikeMySqlEntity,
    PostMediaMySqlEntity,
    PostMySqlEntity,
    ReportPostCommentMySqlEntity,
    ReportPostMySqlEntity,
    TransactionDetailMySqlEntity,
    TransactionMySqlEntity,
} from "@database"
import { ConfigurationService, MailerService, StorageService } from "@global"
import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, DeepPartial, Repository } from "typeorm"
import {
    CreatePostCommentInput,
    CreatePostCommentReplyInput,
    CreatePostCommentReportInput,
    CreatePostInput,
    CreatePostReportInput,
    DeletePostCommentInput,
    DeletePostCommentReplyInput,
    DeletePostInput,
    MarkPostCommentAsSolutionInput,
    ResolvePostCommentReportInput,
    ResolvePostReportInput,
    ToggleLikePostCommentInput,
    ToggleLikePostInput,
    UpdatePostCommentInput,
    UpdatePostCommentReplyInput,
    UpdatePostCommentReportInput,
    UpdatePostInput,
    UpdatePostReportInput,
} from "./posts.input"
import {
    CreatePostCommentOutput,
    CreatePostCommentReplyOutput,
    CreatePostCommentReportOutput,
    CreatePostOutput,
    CreatePostReportOutput,
    DeletePostCommentOutput,
    DeletePostCommentReplyOutput,
    DeletePostOutput,
    MarkPostCommentAsSolutionOutput,
    ResolvePostCommentReportOutput,
    ResolvePostReportOutput,
    ToggleCommentLikePostOutputData,
    ToggleLikePostOutputData,
    UpdatePostCommentOutput,
    UpdatePostCommentReplyOutput,
    UpdatePostCommentReportOutput,
    UpdatePostOutput,
    UpdatePostReportOutput,
} from "./posts.output"

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
        @InjectRepository(ReportPostMySqlEntity)
        private readonly reportPostMySqlRepository: Repository<ReportPostMySqlEntity>,
        @InjectRepository(ReportPostCommentMySqlEntity)
        private readonly reportPostCommentMySqlRepository: Repository<ReportPostCommentMySqlEntity>,
        @InjectRepository(NotificationMySqlEntity)
        private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
        @InjectRepository(TransactionMySqlEntity)
        private readonly transactionMySqlRepository: Repository<TransactionMySqlEntity>,
        @InjectRepository(TransactionDetailMySqlEntity)
        private readonly transactionDetailMySqlRepository: Repository<TransactionDetailMySqlEntity>,
        private readonly storageService: StorageService,
        private readonly dataSource: DataSource,
        private readonly mailerService: MailerService,
        private readonly configurationService: ConfigurationService,
    ) { }

    async createPost(input: CreatePostInput): Promise<CreatePostOutput> {
        const { data, files, accountId } = input
        const { postMedias, title, courseId, html } = data

        const { creatorId } = await this.courseMySqlRepository.findOneBy({
            courseId,
        })

        const isInstructor = accountId === creatorId

        if (!isInstructor) {
            const isEnrolled = await this.enrolledInfoMySqlRepository.findOneBy({
                accountId,
                courseId,
            })
            if (!isEnrolled) {
                throw new ConflictException(
                    "You must be enrolled to this course before creating a post inside. ",
                )
            }
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

        let earnAmount: number

        if (!isInstructor) {
            const numberOfUserPost = await this.postMySqlRepository.find({
                where: {
                    creatorId: accountId,
                    courseId,
                },
            })

            if (numberOfUserPost.length < 3) {
                post.isRewardable = true
                const { priceAtEnrolled } =
                    await this.enrolledInfoMySqlRepository.findOneBy({
                        accountId,
                        courseId,
                    })

                const { earn } =
                    await this.configurationService.getConfiguration(courseId)

                earnAmount = computeFixedFloor(
                    ((priceAtEnrolled * earn) / 300) *
            blockchainConfig().earns.createPostEarnCoefficient,
                )

                await this.notificationMySqlRepository.save({
                    receiverId: accountId,
                    title: "You will have new update on your balance!",
                    type: NotificationType.Transaction,
                    description: `You will received ${earnAmount} STARCI(s) if your post is not being reported for 3 days.`,
                })
            }
        }

        const { postId } = await this.postMySqlRepository.save(post)
        await this.transactionMySqlRepository.save({
            accountId,
            type: TransactionType.Earn,
            status: TransactionStatus.Pending,
            amountDepositedChange: earnAmount,
            preTextEarn: "Create post ",
            courseId,
            transactionDetails: [
                {
                    postId,
                },
            ],
        })

        return {
            message: "Post has been created successfully.",
            others: {
                postId,
                earnAmount,
            },
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

        const updatePost = await this.postMySqlRepository.findOne({
            where: {
                postId,
            },
        })

        if (!updatePost) {
            throw new NotFoundException("Post not found or has been deleted.")
        }

        if (updatePost.creatorId !== accountId) {
            throw new ConflictException("You are not the owner of this post")
        }

        if (updatePost.isCompleted) {
            throw new ConflictException("This post is closed.")
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

        const deletedPostMedias = await this.postMediaMySqlRepository.findBy({
            postId,
        })
        await this.postMediaMySqlRepository.delete({ postId })
        await this.postMySqlRepository.save(post)

        const mediaIds = deletedPostMedias.map(
            (deletedPostMedia) => deletedPostMedia.mediaId,
        )

        await this.storageService.delete(...mediaIds)

        return { message: "Post Updated Successfully" }
    }

    async deletePost(input: DeletePostInput): Promise<DeletePostOutput> {
        const { data } = input
        const { postId } = data

        const deletedPostMedias = await this.postMediaMySqlRepository.findBy({
            postId,
        })

        await this.postMySqlRepository.delete({ postId })

        const mediaIds = deletedPostMedias.map(
            (deletedPostMedia) => deletedPostMedia.mediaId,
        )
        await this.storageService.delete(...mediaIds)

        return { message: "Post Deleted Successfully" }
    }

    //like
    async toggleLikePost(
        input: ToggleLikePostInput,
    ): Promise<ToggleLikePostOutputData> {
        const { accountId, data } = input
        const { postId } = data

        let earnAmount: number

        const { courseId, creatorId, isRewardable, course, isCompleted, title } =
            await this.postMySqlRepository.findOne({
                where: {
                    postId,
                },
                relations: {
                    course: true,
                },
            })

        if (isCompleted == true) {
            throw new ConflictException("This post is closed")
        }

        const isEnrolled = await this.enrolledInfoMySqlRepository.findOne({
            where: {
                accountId,
                courseId,
            },
            relations: {
                account: true,
            },
        })
        const isInstructor = accountId === course.creatorId

        if (!isInstructor) {
            if (!isEnrolled) {
                throw new ConflictException(
                    `You must be enrolled to course: ${course.title} to interact with this post`,
                )
            }
        }

        const isLiked = await this.postLikeMySqlRepository.findOne({
            where: {
                accountId,
                postId,
            },
        })

        if (isLiked) {
            throw new ConflictException("You have already liked this post.")
        }

        const numberOfPostLike = await this.postLikeMySqlRepository.findBy({
            postId,
        })

        const numberOfRewardedLike = numberOfPostLike.filter(
            (likeCount) => likeCount.accountId !== creatorId,
        )

        if (isRewardable) {
            if (creatorId !== accountId) {
                if (!isInstructor) {
                    const { priceAtEnrolled } = isEnrolled
                    if (numberOfRewardedLike.length < 20) {
                        const { earn } = await this.configurationService.getConfiguration(courseId)
                        earnAmount = computeFixedFloor(
                            priceAtEnrolled *
                (earn / 300) *
                blockchainConfig().earns.likePostEarnCoefficient,
                        )
                        await this.transactionMySqlRepository.save({
                            accountId,
                            type: TransactionType.Earn,
                            status: TransactionStatus.Pending,
                            amountDepositedChange: earnAmount,
                            courseId,
                            preTextEarn: "Like post ",
                            transactionDetails: [
                                {
                                    postId,
                                },
                            ],
                        })

                        await this.notificationMySqlRepository.save({
                            receiverId: accountId,
                            title: "You will have new update on your balance!",
                            type: NotificationType.Transaction,
                            description: `You will received ${earnAmount} STARCI(s) if the post you liked is not being reported for 3 days.`,
                        })
                    }
                }
            }
        }

        const { postLikeId } = await this.postLikeMySqlRepository.save({
            accountId,
            postId,
        })
        if (creatorId !== accountId) {
            await this.notificationMySqlRepository.save({
                senderId: accountId,
                receiverId: creatorId,
                title: `You have new react on your post: ${title}`,
                description: `User ${isEnrolled.account.username} has reacted to your post ${title}`,
                referenceLink: `${appConfig().frontendUrl}/courses/${courseId}/home`,
            })
        }

        return {
            message: "Post liked successfully.",
            others: {
                postLikeId,
                earnAmount,
            },
        }
    }

    async createPostComment(
        input: CreatePostCommentInput,
    ): Promise<CreatePostCommentOutput> {
        const { data, files, accountId } = input
        const { postCommentMedias, postId, html } = data

        const post = await this.postMySqlRepository.findOne({
            where: {
                postId,
            },
            relations: {
                course: true,
            },
        })

        if (!post) {
            throw new NotFoundException("Post not found or has been deleted")
        }

        const { courseId, creatorId, isRewardable, course, isCompleted } = post

        if (isCompleted) {
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

        let earnAmount: number
        let isOwner: boolean
        let alreadyRewarded: boolean

        if (creatorId == accountId) {
            isOwner = true
        } else {
            alreadyRewarded = false
        }

        const isEnrolled = await this.enrolledInfoMySqlRepository.findOne({
            where: {
                accountId,
                courseId,
            },
            relations: {
                account: true,
            },
        })
        const isInstructor = accountId === course.creatorId

        if (!isInstructor) {
            if (!isEnrolled) {
                throw new ConflictException(
                    `You must be enrolled to course: ${course.title} to interact with this post`,
                )
            }
        }

        const numberOfPostComments = await this.postCommentMySqlRepository.findBy({
            postId,
        })
        const creatorIdsSeen = new Set()

        const filteredComments = numberOfPostComments.filter((comment) => {
            if (comment.creatorId === creatorId) {
                return false
            }
            if (creatorIdsSeen.has(comment.creatorId)) {
                return false
            }
            creatorIdsSeen.add(comment.creatorId)
            return true
        })

        const numberOfRewardedComments = filteredComments.length

        if (!isInstructor) {
            if (isRewardable) {
                if (creatorId !== accountId) {
                    const isCommented = await this.postCommentMySqlRepository.find({
                        where: {
                            creatorId: accountId,
                            postId,
                        },
                    })
                    if (!isCommented || isCommented.length < 1) {
                        const { priceAtEnrolled } = isEnrolled
                        if (numberOfRewardedComments < 20) {
                            const { earn } =
                                await this.configurationService.getConfiguration(courseId)

                            earnAmount = computeFixedFloor(
                                ((priceAtEnrolled * earn) / 300) *
                  blockchainConfig().earns.commentPostEarnCoefficient,
                            )

                            await this.notificationMySqlRepository.save({
                                receiverId: accountId,
                                title: "You will have new update on your balance!",
                                type: NotificationType.Transaction,
                                description: `You will received ${earnAmount} STARCI(s) if your comment is not being reported for 3 days.`,
                            })
                        }
                    } else {
                        alreadyRewarded = true
                    }
                    await this.notificationMySqlRepository.save({
                        senderId: isEnrolled.account.accountId,
                        receiverId: post.creatorId,
                        type: NotificationType.Interact,
                        title: "You have new comment on your post",
                        description: `User ${isEnrolled.account.username} has commented to your post ${post.title}`,
                        referenceLink: `/posts/${post.postId}`,
                    })
                }
            }
        }

        const { postCommentId } =
            await this.postCommentMySqlRepository.save(postComment)
        await this.transactionMySqlRepository.save({
            accountId,
            type: TransactionType.Earn,
            status: TransactionStatus.Pending,
            amountDepositedChange: earnAmount,
            courseId,
            preTextEarn: "Create comment on post ",
            transactionDetails: [
                {
                    postId,
                },
            ],
        })

        return {
            message: "Comment Posted Successfully",
            others: {
                postCommentId,
                alreadyRewarded,
                earnAmount,
                isOwner,
            },
        }
    }

    async updatePostComment(
        input: UpdatePostCommentInput,
    ): Promise<UpdatePostCommentOutput> {
        const { data, files, accountId } = input
        const { postCommentMedias, postCommentId, html } = data

        const postComment: DeepPartial<PostCommentMySqlEntity> = {
            postCommentId,
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

        const accountPostComment = await this.postCommentMySqlRepository.findOne({
            where: {
                postCommentId,
            },
            relations: {
                post: true,
            },
        })

        if (!accountPostComment) {
            throw new NotFoundException("Post comment not found or has been deleted.")
        }

        if (accountPostComment.creatorId !== accountId) {
            throw new ConflictException("You are not the owner of this comment.")
        }

        if (accountPostComment.post.isCompleted) {
            throw new ConflictException("This post is closed.")
        }

        const deletedPostCommentMedias =
            await this.postCommentMediaMySqlRepository.findBy({ postCommentId })
        await this.postCommentMediaMySqlRepository.delete({ postCommentId })
        await this.postCommentMySqlRepository.save(postComment)

        const mediaIds = deletedPostCommentMedias.map(
            (deletedPostCommentMedia) => deletedPostCommentMedia.mediaId,
        )
        await this.storageService.delete(...mediaIds)

        return { message: "Comment updated successfully" }
    }

    async deletePostComment(
        input: DeletePostCommentInput,
    ): Promise<DeletePostCommentOutput> {
        const { data } = input
        const { postCommentId } = data

        const deletedPostCommentMedias =
            await this.postCommentMediaMySqlRepository.findBy({ postCommentId })
        await this.postCommentMySqlRepository.delete({ postCommentId })

        const mediaIds = deletedPostCommentMedias.map(
            (deletedPostCommentMedia) => deletedPostCommentMedia.mediaId,
        )
        await this.storageService.delete(...mediaIds)

        return { message: "Comment deleted successfully" }
    }

    async toggleLikePostComment(
        input: ToggleLikePostCommentInput,
    ): Promise<ToggleCommentLikePostOutputData> {
        const { accountId, data } = input
        const { postCommentId } = data

        let earnAmount: number
        const postComment = await this.postCommentMySqlRepository.findOne({
            where: {
                postCommentId,
            },
            relations: {
                post: true,
            },
        })

        if (!postComment) {
            throw new NotFoundException("Comment not found or has been deleted.")
        }

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
        } else {
            const { postCommentLikeId, liked } = found
            await this.postCommentLikeMySqlRepository.update(postCommentLikeId, {
                liked: !liked,
            })
        }
        const { postCommentLikeId } = found
        const { username } = await this.accountMySqlRepository.findOneBy({
            accountId,
        })

        if (accountId !== postComment.creatorId) {
            await this.notificationMySqlRepository.save({
                senderId: accountId,
                receiverId: postComment.creatorId,
                title: "You have new react on your comment",
                type: NotificationType.Interact,
                description: `User ${username} has reacted to your comment at post : ${postComment.post.title}`,
                referenceLink: `posts/${postComment.post.postId}`,
            })
        }

        return {
            message: "",
            others: {
                postCommentLikeId,
                earnAmount,
            },
        }
    }

    async createPostCommentReply(
        input: CreatePostCommentReplyInput,
    ): Promise<CreatePostCommentReplyOutput> {
        const { data, accountId } = input
        const { content, postCommentId } = data

        const postComment = await this.postCommentMySqlRepository.findOne({
            where: {
                postCommentId,
            },
            relations: {
                post: {
                    course: true,
                },
                creator: true,
            },
        })

        if (!postComment) {
            throw new NotFoundException("Post comment not found or has been deleted.")
        }

        const { postCommentReplyId } =
            await this.postCommentReplyMySqlRepository.save({
                content,
                creatorId: accountId,
                postCommentId,
            })

        const { username } = await this.accountMySqlRepository.findOneBy({
            accountId,
        })

        if (accountId !== postComment.creatorId) {
            await this.notificationMySqlRepository.save({
                senderId: accountId,
                receiverId: postComment.creatorId,
                title: "You have new reply on your comment",
                type: NotificationType.Interact,
                description: `User ${username} has replied to your comment at post : ${postComment.post.title}`,
                referenceLink: `/posts/${postComment.post.postId}`,
            })
        }

        return {
            message: "Reply created successfully",
            others: { postCommentReplyId },
        }
    }

    async updatePostCommentReply(
        input: UpdatePostCommentReplyInput,
    ): Promise<UpdatePostCommentReplyOutput> {
        const { data } = input
        const { content, postCommentReplyId } = data

        const commentReply = await this.postCommentReplyMySqlRepository.findOne({
            where: {
                postCommentReplyId,
            },
            relations: {
                postComment: {
                    post: true,
                },
            },
        })

        if (!commentReply) {
            throw new NotFoundException(
                "Comment's reply not found or has been deleted",
            )
        }

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

    async markPostCommentAsSolution(
        input: MarkPostCommentAsSolutionInput,
    ): Promise<MarkPostCommentAsSolutionOutput> {
        const { data, accountId } = input
        const { postCommentId } = data

        const postComment = await this.postCommentMySqlRepository.findOne({
            where: {
                postCommentId,
            },
            relations: {
                post: true,
            },
        })

        if (!postComment) {
            throw new NotFoundException("Post comment not found")
        }

        const { creatorId, isRewardable, courseId, postId } =
            await this.postMySqlRepository.findOneBy({ postId: postComment.postId })

        if (creatorId !== accountId) {
            throw new ConflictException("You aren't the creator of the post.")
        }

        if (postComment.creatorId == creatorId) {
            throw new ConflictException("You can't mark your comment as a solution.")
        }

        const hasRewardedComment = await this.postCommentMySqlRepository.find({
            where: {
                postId: postComment.postId,
            },
        })

        if (
            hasRewardedComment.some(
                (accountComment) => accountComment.isSolution === true,
            )
        ) {
            throw new ConflictException("There's already exist a solution comment")
        }

        await this.postCommentMySqlRepository.update(postCommentId, {
            isSolution: true,
        })

        if (isRewardable) {
            const { priceAtEnrolled } =
                await this.enrolledInfoMySqlRepository.findOne({
                    where: {
                        accountId: postComment.creatorId,
                        courseId,
                    },
                })
            const { earn } = await this.configurationService.getConfiguration(courseId)
            const earnAmount = computeFixedFloor(
                priceAtEnrolled *
                (earn / 300) *
          blockchainConfig().earns.rewardCommentPostEarnCoefficient,
            )

            await this.transactionMySqlRepository.save({
                accountId: postComment.creatorId,
                type: TransactionType.Earn,
                status: TransactionStatus.Pending,
                amountDepositedChange: earnAmount,
                courseId,
                preTextEarn: "Your solution is marked on post ",
                transactionDetails: [
                    {
                        postId,
                    },
                ],
            })

            await this.notificationMySqlRepository.save({
                receiverId: postComment.creatorId,
                title: "You will have new update on your balance!",
                type: NotificationType.Transaction,
                description: `You will received ${earnAmount} STARCI(s) if your post is not being reported for 3 days.`,
            })
        }

        await this.postMySqlRepository.update(postId, { isCompleted: true })

        await this.notificationMySqlRepository.save({
            senderId: postComment.post.creatorId,
            receiverId: postComment.creatorId,
            referenceLink: `/posts/${postId}`,
            title: "Your comment has been marked as post's solution",
            description: `Your comment on the post "${postComment.post.title}" has been marked as the solution by the post owner. 
                        ${isRewardable ? "You will receive an amount of STARCI for this." : null} Keep up the great work!`,
        })

        return {
            message:
                "Comment has been marked as a solution and no more comments are allowed to this post",
        }
    }

    async createPostReport(
        input: CreatePostReportInput,
    ): Promise<CreatePostReportOutput> {
        const { data, accountId } = input
        const { postId, title, description } = data

        const reportedPost = await this.postMySqlRepository.findOneBy({ postId })

        if (!reportedPost) {
            throw new NotFoundException(
                "Reported post is not found or has been deleted",
            )
        }

        const processing = await this.reportPostMySqlRepository.find({
            where: {
                postId,
            },
        })

        if (
            processing &&
            processing.some(
                (processing) =>
                    processing.processStatus === ReportProcessStatus.Processing,
            )
        ) {
            throw new ConflictException(
                "You have reported this accout before and it is processing. Try update your report instead.",
            )
        }

        const { reportPostId } = await this.reportPostMySqlRepository.save({
            accountId,
            postId,
            title,
            description,
        })

        return {
            message: `A report to post ${reportedPost.title} has been submitted.`,
            others: {
                reportPostId,
            },
        }
    }

    async updatePostReport(
        input: UpdatePostReportInput,
    ): Promise<UpdatePostReportOutput> {
        const { data, accountId } = input
        const { reportPostId, title, description } = data

        const found = await this.reportPostMySqlRepository.findOneBy({
            reportPostId,
        })

        if (!found) {
            throw new NotFoundException("Post's report not found.")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has been resolved and closed.")
        }

        if (found.accountId !== accountId) {
            throw new ConflictException("You aren't the owner of this report.")
        }

        await this.reportPostMySqlRepository.update(reportPostId, {
            title,
            description,
        })

        return {
            message: "Your Report has been updated successfully",
            others: {
                reportPostId,
            },
        }
    }

    async createPostCommentReport(
        input: CreatePostCommentReportInput,
    ): Promise<CreatePostCommentReportOutput> {
        const { data, accountId } = input
        const { postCommentId, title, description } = data

        const reportedPostComment = await this.postCommentMySqlRepository.findOneBy(
            { postCommentId },
        )

        if (!reportedPostComment) {
            throw new NotFoundException(
                "Reported post's comment is not found or has been deleted",
            )
        }

        const processing = await this.reportPostCommentMySqlRepository.find({
            where: {
                postCommentId,
            },
        })

        if (
            processing &&
            processing.some(
                (processing) =>
                    processing.processStatus === ReportProcessStatus.Processing,
            )
        ) {
            throw new ConflictException(
                "You have reported this accout before and it is processing. Try update your report instead.",
            )
        }

        const { reportPostCommentId } =
            await this.reportPostCommentMySqlRepository.save({
                accountId,
                postCommentId,
                title,
                description,
            })

        return {
            message: `A report to a post's comment with id ${reportedPostComment.postCommentId} has been submitted.`,
            others: {
                reportPostCommentId,
            },
        }
    }

    async updatePostCommentReport(
        input: UpdatePostCommentReportInput,
    ): Promise<UpdatePostCommentReportOutput> {
        const { data, accountId } = input
        const { reportPostCommentId, title, description } = data

        const found = await this.reportPostCommentMySqlRepository.findOneBy({
            reportPostCommentId,
        })

        if (!found) {
            throw new NotFoundException("Post comment's report not found.")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has been resolved and closed.")
        }

        if (found.accountId !== accountId) {
            throw new ConflictException("You aren't the owner of this report.")
        }

        await this.reportPostCommentMySqlRepository.update(reportPostCommentId, {
            title,
            description,
        })

        return {
            message: "Your Report has been updated successfully",
            others: {
                reportPostCommentId,
            },
        }
    }

    async resolvePostReport(
        input: ResolvePostReportInput,
    ): Promise<ResolvePostReportOutput> {
        const { data } = input
        const { reportPostId, processNote, processStatus } = data

        const found = await this.reportPostMySqlRepository.findOne({
            where: {
                reportPostId,
            },
            relations: {
                reportedPost: {
                    creator: true,
                    postComments: true
                },
                reporterAccount: true,
            },
        })

        if (!found) {
            throw new NotFoundException("Report not found")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has already been resolved")
        }

        await this.reportPostMySqlRepository.update(reportPostId, {
            processStatus,
            processNote,
        })

        const {
            reportedPost,
            reporterAccount,
            createdAt,
            title,
            description,
            postId,
        } = found

        if (processStatus === ReportProcessStatus.Approved) {
            await this.postMySqlRepository.update(postId, { isDisabled: true })

            const relateTransactionDetails =
                await this.transactionDetailMySqlRepository.find({
                    where: {
                        postId: postId,
                    },
                    relations: {
                        transaction: true,
                    },
                })

            const transactions = relateTransactionDetails
                .map((transaction) => transaction.transaction)
                .filter(
                    (transaction) => transaction.status === TransactionStatus.Pending,
                )
            console.log(transactions)
            transactions.map((transaction) => {
                transaction.status = TransactionStatus.Failed
                return transaction
            })
            await this.transactionMySqlRepository.save(transactions)
        }

        await this.mailerService.sendReportPostMail(
            reportedPost.creator.email,
            reporterAccount.username,
            reportedPost.title,
            createdAt,
            title,
            description,
            processStatus,
            processNote,
        )

        const commentors = found.reportedPost.postComments
        const uniqueNotifications = new Map<string, DeepPartial<NotificationMySqlEntity>>()

        commentors.forEach(({ creatorId }) => {
            if (!uniqueNotifications.has(creatorId)) {
                uniqueNotifications.set(creatorId, {
                    receiverId: creatorId,
                    title: "New update on post you commented",
                    type: NotificationType.System,
                    description: `Post: ${found.reportedPost.title} you commented has been reported, so it has been removed from course forum.`,
                })
            }
        })

        const notificationsToCommentors = Array.from(uniqueNotifications.values())


        // const notificationsToCommentors: Array<
        //     DeepPartial<NotificationMySqlEntity>
        // > = commentors.map(({ creatorId }) => ({
        //     receiverId: creatorId,
        //     title: "New update on post you commented",
        //     type: NotificationType.System,
        //     description: `Post: ${found.reportedPost.title} you commented has been reported, so it has been removed from course forum.`,
        // }))

        await this.notificationMySqlRepository.save(notificationsToCommentors)

        return {
            message: "Report successfully resolved and closed.",
        }
    }

    async resolvePostCommentReport(
        input: ResolvePostCommentReportInput,
    ): Promise<ResolvePostCommentReportOutput> {
        const { data } = input
        const { reportPostCommentId, processNote, processStatus } = data

        const found = await this.reportPostCommentMySqlRepository.findOne({
            where: {
                reportPostCommentId,
            },
            relations: {
                reportedPostComment: {
                    creator: true,
                },
                reporterAccount: true,
            },
        })

        if (!found) {
            throw new NotFoundException("Report not found")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has already been resolved")
        }

        await this.reportPostCommentMySqlRepository.update(reportPostCommentId, {
            processStatus,
            processNote,
        })
        const {
            reportedPostComment,
            reporterAccount,
            createdAt,
            title,
            description,
            postCommentId,
        } = found

        if (processStatus === ReportProcessStatus.Approved) {
            await this.postCommentMySqlRepository.update(postCommentId, {
                isDisabled: true,
            })
        }
        await this.mailerService.sendReportPostCommentMail(
            reportedPostComment.creator.email,
            reporterAccount.username,
            reportedPostComment.html,
            createdAt,
            title,
            description,
            processStatus,
            processNote,
        )

        return {
            message: "Report successfully resolved and closed.",
        }
    }
}
