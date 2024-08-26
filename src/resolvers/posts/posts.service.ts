import {
    PostCommentLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentReplyMySqlEntity,
    PostLikeMySqlEntity,
    PostMySqlEntity,
    ReportPostCommentMySqlEntity,
    ReportPostMySqlEntity,
} from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { PostCommentReplyEntity } from "src/database/mysql/post-comment-reply.entity"
import { DataSource, Not, Repository } from "typeorm"
import {
    FindManyPostCommentRepliesInput,
    FindManyPostCommentReportsInput,
    FindManyPostCommentsInput,
    FindManyPostReportsInput,
    FindManyPostsInput,
    FindOnePostCommentInput,
    FindOnePostInput,
} from "./posts.input"
import { FindManyPostCommentRepliesOutputData, FindManyPostCommentReportsOutputData, FindManyPostCommentsOutputData, FindManyPostReportsOutputData, FindManyPostsOutputData, FindOnePostOutput } from "./posts.output"
import { ReportProcessStatus } from "@common"


@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostMySqlEntity)
        private readonly postMySqlRepository: Repository<PostMySqlEntity>,
        @InjectRepository(PostCommentMySqlEntity)
        private readonly postCommentMySqlRepository: Repository<PostCommentMySqlEntity>,
        @InjectRepository(PostCommentReplyEntity)
        private readonly postCommentReplyMySqlRepository: Repository<PostCommentReplyEntity>,
        @InjectRepository(PostLikeMySqlEntity)
        private readonly postLikeMySqlRepository: Repository<PostLikeMySqlEntity>,
        @InjectRepository(ReportPostMySqlEntity)
        private readonly reportPostMySqlRepository: Repository<ReportPostMySqlEntity>,
        @InjectRepository(ReportPostCommentMySqlEntity)
        private readonly reportPostCommentMySqlRepository: Repository<ReportPostCommentMySqlEntity>,
        @InjectRepository(PostCommentLikeMySqlEntity)
        private readonly postCommentLikeMySqlRepository: Repository<PostCommentLikeMySqlEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async findOnePost(input: FindOnePostInput): Promise<FindOnePostOutput> {
        const { data, accountId } = input
        const { params } = data
        const { postId } = params

        const post = await this.postMySqlRepository.findOne({
            where: {
                postId
            },
            relations: {
                creator: true,
                course: true,
                postReacts: true,
                postComments: {
                    creator: true,
                    postCommentMedias: true,
                },
                postMedias: true,
            },
        })

        const numberOfLikes = await this.postLikeMySqlRepository.count(
            {
                where: {
                    postId
                }
            }
        )
        const numberOfComments = await this.postCommentMySqlRepository.count(
            {
                where: {
                    postId
                }
            }
        )
        let numberOfRewardableLikesLeft: number
        let numberOfRewardableCommentsLeft: number

        if (post.isRewardable) {
            const rewardedLikes = await this.postLikeMySqlRepository.find({
                where: {
                    postId,
                    accountId: post.creatorId
                },
                order: {
                    createdAt: "ASC"
                }
            })

            const rewardedLikesCount = rewardedLikes.length
            numberOfRewardableLikesLeft = Math.max(20 - rewardedLikesCount, 0)

            const rewardedComments = await this.postCommentMySqlRepository.find({
                where: {
                    postId: post.postId,
                    creatorId: post.creatorId
                },
                order: {
                    createdAt: "ASC"
                }
            })

            const uniqueRewardedCommentors = new Set(rewardedComments.map(comment => comment.creatorId))
            const rewardedCommentsCount = uniqueRewardedCommentors.size
            numberOfRewardableCommentsLeft = Math.max(20 - rewardedCommentsCount, 0)
        }

        const liked = await this.postLikeMySqlRepository.findOne({
            where: {
                postId,
                accountId
            }
        })

        post.numberOfLikes = numberOfLikes
        post.numberOfComments = numberOfComments
        post.numberOfRewardableLikesLeft = numberOfRewardableLikesLeft
        post.numberOfRewardableCommentsLeft = numberOfRewardableCommentsLeft
        post.liked = liked ? true : false
        post.isPostOwner = (accountId === post.creatorId)
        post.isInstructor = (post.creatorId === post.course.creatorId)

        return {
            data: post,
        }
    }

    async findOnePostComment(
        input: FindOnePostCommentInput,
    ): Promise<PostCommentMySqlEntity> {
        const { data } = input
        const { params } = data
        const { postCommentId } = params

        return await this.postCommentMySqlRepository.findOne({
            where: {
                postCommentId
            },
            relations: {
                creator: true,
                postCommentMedias: true,
            },
        })
    }

    async findManyPosts(
        input: FindManyPostsInput,
    ): Promise<FindManyPostsOutputData> {
        const { data, accountId } = input
        const { params, options } = data
        const { courseId } = params
        const { take, skip } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const posts = await this.postMySqlRepository.find({
                where: {
                    courseId,
                    isDisabled: false
                },
                take,
                skip,
                relations: {
                    postMedias: true,
                    creator: true,
                    course: true,
                    postReacts: true,
                },
                order: {
                    createdAt: {
                        direction: "DESC"
                    },
                }
            })
            const numberOfLikesResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(post_like.postId)", "count")
                .addSelect("post.postId", "postId")
                .from(PostMySqlEntity, "post")
                .innerJoin(PostLikeMySqlEntity, "post_like", "post.postId = post_like.postId")
                .andWhere("courseId = :courseId", { courseId })
                .groupBy("post.postId")
                .getRawMany()

            const numberOfCommentsResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(post_comment.postId)", "count")
                .addSelect("post.postId", "postId")
                .from(PostMySqlEntity, "post")
                .innerJoin(
                    PostCommentMySqlEntity,
                    "post_comment",
                    "post.postId = post_comment.postId",
                )
                .where("courseId = :courseId", { courseId })
                .groupBy("post.postId")
                .getRawMany()

            const likedResults = await queryRunner.manager
                .createQueryBuilder()
                .select("post.postId", "postId")
                .from(PostMySqlEntity, "post")
                .innerJoin(PostLikeMySqlEntity, "post_like", "post.postId = post_like.postId")
                .where("post_like.accountId = :accountId", { accountId })
                .getRawMany()

            await queryRunner.commitTransaction()

            const results = await Promise.all(posts.map(async (post) => {
                const numberOfLikes = numberOfLikesResults.find(result => result.postId === post.postId)?.count ?? 0
                const numberOfComments = numberOfCommentsResults.find(result => result.postId === post.postId)?.count ?? 0
                const liked = likedResults.some(result => result.postId === post.postId)
                const isPostOwner = (post.creatorId === accountId)
                const isInstructor = (post.creatorId === post.course.creatorId)
                post.isReported = (await this.reportPostMySqlRepository.findOneBy({ postId: post.postId, accountId, processStatus: ReportProcessStatus.Processing })) ? true : false
                let numberOfRewardableLikesLeft: number
                let numberOfRewardableCommentsLeft: number

                if (post.isRewardable) {
                    const rewardedLikes = await queryRunner.manager
                        .createQueryBuilder(PostLikeMySqlEntity, "post_like")
                        .where("post_like.postId = :postId", { postId: post.postId })
                        .andWhere("post_like.accountId != :creatorId", { creatorId: post.creatorId })
                        .orderBy("post_like.createdAt", "ASC")
                        .getMany()

                    const rewardedLikesCount = rewardedLikes.length
                    numberOfRewardableLikesLeft = Math.max(20 - rewardedLikesCount, 0)

                    const rewardedComments = await queryRunner.manager
                        .createQueryBuilder(PostCommentMySqlEntity, "post_comment")
                        .where("post_comment.postId = :postId", { postId: post.postId })
                        .andWhere("post_comment.creatorId != :creatorId", { creatorId: post.creatorId })
                        .orderBy("post_comment.createdAt", "ASC")
                        .getMany()

                    const uniqueRewardedCommentors = new Set(rewardedComments.map(comment => comment.creatorId))
                    const rewardedCommentsCount = uniqueRewardedCommentors.size
                    numberOfRewardableCommentsLeft = Math.max(20 - rewardedCommentsCount, 0)
                }

                return {
                    ...post,
                    liked,
                    isPostOwner,
                    numberOfLikes,
                    numberOfComments,
                    numberOfRewardableLikesLeft,
                    numberOfRewardableCommentsLeft,
                    isInstructor
                }
            }))


            return ({
                results,
                metadata: {
                    count: posts.length
                }
            })
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyPostComments(
        input: FindManyPostCommentsInput,
    ): Promise<FindManyPostCommentsOutputData> {
        const { accountId, data } = input
        const { params, options } = data
        const { postId } = params
        const { take, skip } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const postComments = await this.postCommentMySqlRepository.find({
                where: {
                    postId,
                    isDisabled: false
                },
                relations: {
                    creator: true,
                    postCommentMedias: true,
                    post: {
                        course: true
                    }
                },
                take,
                skip,
                order: {
                    createdAt: {
                        direction: "DESC"
                    }
                }
            })
            const { creatorId } = await this.postMySqlRepository.findOneBy({ postId })

            const numberOfLikesResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(post_comment_like.postCommentId)", "count")
                .addSelect("post_comment.postCommentId", "postCommentId")
                .from(PostCommentMySqlEntity, "post_comment")
                .innerJoin(PostCommentLikeMySqlEntity, "post_comment_like", "post_comment.postCommentId = post_comment_like.postCommentId")
                .where("liked = :liked", { liked: true })
                .andWhere("postId = :postId", { postId })
                .groupBy("post_comment.postCommentId")
                .getRawMany()

            const likedResults = await queryRunner.manager
                .createQueryBuilder()
                .select("post_comment.postCommentId", "postCommentId")
                .addSelect("post_comment_like.liked", "liked")
                .from(PostCommentMySqlEntity, "post_comment")
                .innerJoin(PostCommentLikeMySqlEntity, "post_comment_like", "post_comment.postCommentId = post_comment_like.postCommentId")
                .where("post_comment_like.accountId = :accountId", { accountId })
                .andWhere("post_comment_like.liked = :liked", { liked: true })
                .getRawMany()

            const numberOfPostCommentsResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(PostCommentMySqlEntity, "post_comment")
                .where("post_comment.postId = :postId", { postId })
                .getRawOne()

            const numberOfRepliesResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(post_comment.postCommentId)", "count")
                .addSelect("post_comment.postCommentId", "postCommentId")
                .from(PostCommentMySqlEntity, "post_comment")
                .innerJoin(
                    PostCommentReplyMySqlEntity,
                    "post_comment_reply",
                    "post_comment.postCommentId = post_comment_reply.postCommentId",
                )
                .where("postId = :postId", { postId })
                .groupBy("post_comment.postCommentId")
                .getRawMany()

            const { isRewardable } = await this.postMySqlRepository.findOneBy({ postId })

            const uniqueRewardedComments = []

            if (isRewardable) {
                const rewardedComments = await queryRunner.manager
                    .createQueryBuilder(PostCommentMySqlEntity, "post_comment")
                    .where("post_comment.postId = :postId", { postId })
                    .andWhere("post_comment.creatorId != :creatorId", { creatorId })
                    .orderBy("post_comment.createdAt", "ASC")
                    .getMany()
                const seenCreators = new Set()
                for (const comment of rewardedComments) {
                    if (!seenCreators.has(comment.creatorId)) {
                        uniqueRewardedComments.push(comment)
                        seenCreators.add(comment.creatorId)
                        if (uniqueRewardedComments.length === 20) {
                            break
                        }
                    }
                }
            }

            const results = await Promise.all(postComments.map(async (postComment) => {
                const numberOfLikes = numberOfLikesResults.find(
                    result => result.postCommentId === postComment.postCommentId,
                )?.count ?? 0
                const numberOfReplies = numberOfRepliesResults.find(
                    result => result.postCommentId === postComment.postCommentId,
                )?.count ?? 0
                const liked = likedResults.find(
                    result => result.postCommentId === postComment.postCommentId,
                )?.liked ?? false
                const isCommentOwner = (postComment.creatorId === accountId)
                const isSolution = postComment.isSolution === true
                const isRewardable = (uniqueRewardedComments.length > 0) ? uniqueRewardedComments.some(
                    comment => comment.postCommentId === postComment.postCommentId
                ) : false
                const isReported = await this.reportPostCommentMySqlRepository.findOneBy({ accountId, postCommentId: postComment.postCommentId, processStatus: ReportProcessStatus.Processing })
                postComment.isReported = isReported ? true : false
                postComment.post.isInstructor = (postComment.creatorId === postComment.post.course.creatorId)

                return {
                    ...postComment,
                    numberOfLikes,
                    numberOfReplies,
                    liked,
                    isCommentOwner,
                    isSolution,
                    isRewardable
                }
            })
            )
            await queryRunner.commitTransaction()
            return {
                results,
                metadata: {
                    count: numberOfPostCommentsResult.count
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyPostCommentReplies(
        input: FindManyPostCommentRepliesInput,
    ): Promise<FindManyPostCommentRepliesOutputData> {
        const { data } = input
        const { params, options } = data
        const { postCommentId } = params
        const { take, skip } = { ...options }

        const postCommentReplies = await this.postCommentReplyMySqlRepository.find({
            where: { postCommentId },
            relations: {
                creator: true,
            },
            take,
            skip,
            order: {
                createdAt: {
                    direction: "DESC"
                }
            }
        })

        const numberOfPostCommentRepliesResult = await this.postCommentReplyMySqlRepository.count({
            where: {
                postCommentId,
            }
        })

        return {
            results: postCommentReplies,
            metadata: {
                count: numberOfPostCommentRepliesResult
            }
        }

    }

    async findManyPostReports(input: FindManyPostReportsInput): Promise<FindManyPostReportsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const pendingReports = await this.reportPostMySqlRepository.find({
            where: {
                processStatus: ReportProcessStatus.Processing
            },
            relations: {
                reporterAccount: true,
                reportedPost: {
                    postMedias: true,
                    creator: true,
                    course: true,
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        const exceptPendingReports = await this.reportPostMySqlRepository.find({
            where: {
                processStatus: Not(ReportProcessStatus.Processing)
            },
            relations: {
                reporterAccount: true,
                reportedPost: {
                    postMedias: true,
                    creator: true,
                    course: true,
                }
            },
            order: {
                createdAt: "DESC"
            }
        })

        const results = [...pendingReports, ...exceptPendingReports]

        if (skip && take) {
            results.slice(skip, skip + take)
        }

        const numberOfPostReports = await this.reportPostMySqlRepository.count({
            where: {
                processStatus: ReportProcessStatus.Processing
            },
        })

        const promises: Array<Promise<void>> = []

        for (const { reportedPost } of results) {
            const promise = async () => {
                reportedPost.numberOfReports = await this.reportPostMySqlRepository.count({
                    where: {
                        postId: reportedPost.postId
                    }
                })
                reportedPost.numberOfComments = await this.postCommentMySqlRepository.count({
                    where: {
                        postId: reportedPost.postId
                    }
                })
                reportedPost.numberOfLikes = await this.postLikeMySqlRepository.count({
                    where: {
                        postId: reportedPost.postId
                    }
                })
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        return {
            results,
            metadata: {
                count: numberOfPostReports
            }
        }

    }

    async findManyPostCommentReports(input: FindManyPostCommentReportsInput): Promise<FindManyPostCommentReportsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const pendingReports = await this.reportPostCommentMySqlRepository.find({
                where: {
                    processStatus: ReportProcessStatus.Processing
                },
                relations: {
                    reporterAccount: true,
                    reportedPostComment: {
                        postCommentMedias: true,
                        post: true,
                        creator: true
                    },
                },
                order: {
                    createdAt: "DESC"
                }

            })

            const exceptPendingReports = await this.reportPostCommentMySqlRepository.find({
                where: {
                    processStatus: Not(ReportProcessStatus.Processing)
                },
                relations: {
                    reporterAccount: true,
                    reportedPostComment: {
                        postCommentMedias: true,
                        post: true,
                        creator: true
                    },
                },
                order: {
                    createdAt: "DESC"
                }
            })

            const results = [...pendingReports, ...exceptPendingReports]

            if (skip !== null && take !== null) {
                results.slice(skip, skip + take)
            }

            const numberOfPostCommentReports = await this.reportPostCommentMySqlRepository.count()

            const promises: Array<Promise<void>> = []
            for (const { reportedPostComment } of results) {
                const promise = async () => {
                    reportedPostComment.numberOfReports = await this.reportPostCommentMySqlRepository.count({
                        where: {
                            postCommentId: reportedPostComment.postCommentId
                        }
                    })
                    reportedPostComment.numberOfLikes = await this.postCommentLikeMySqlRepository.count({
                        where: {
                            postCommentId: reportedPostComment.postCommentId
                        }
                    })

                    const rewardedComments = await queryRunner.manager
                        .createQueryBuilder(PostCommentMySqlEntity, "post_comment")
                        .where("post_comment.postId = :postId", { postId: reportedPostComment.postId })
                        .andWhere("post_comment.creatorId != :creatorId", { creatorId: reportedPostComment.post.creatorId })
                        .orderBy("post_comment.createdAt", "ASC")
                        .getMany()

                    const uniqueRewardedComments = []
                    const seenCreators = new Set()

                    for (const comment of rewardedComments) {
                        if (!seenCreators.has(comment.creatorId)) {
                            uniqueRewardedComments.push(comment)
                            seenCreators.add(comment.creatorId)
                            if (uniqueRewardedComments.length === 20) {
                                break
                            }
                        }
                    }

                    reportedPostComment.isRewardable = uniqueRewardedComments.some(
                        comment => comment.postCommentId === reportedPostComment.postCommentId
                    )
                }
                promises.push(promise())
            }
            await Promise.all(promises)

            return {
                results,
                metadata: {
                    count: numberOfPostCommentReports
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}
