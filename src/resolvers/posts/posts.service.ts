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
import { Repository, DataSource } from "typeorm"
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
import { PostCommentReplyEntity } from "src/database/mysql/post-comment-reply.entity"


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
        private readonly dataSource: DataSource,
    ) { }

    async findOnePost(input: FindOnePostInput): Promise<FindOnePostOutput> {
        const { data, accountId } = input
        const { params } = data
        const { postId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
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
            console.log(post)
            const numberOfLikes = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(PostLikeMySqlEntity, "post_like")
                .where("post_like.postId = :postId", { postId })
                .getRawOne()
            const numberOfComments = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(PostCommentMySqlEntity, "post_comment")
                .where("post_comment.postId = :postId", { postId })
                .getRawOne()

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

            const liked = await this.postLikeMySqlRepository.findOne({
                where:{
                    postId,
                    accountId
                }
            })

            await queryRunner.commitTransaction()

            post.numberOfLikes = numberOfLikes.count
            post.numberOfComments = numberOfComments.count
            post.numberOfRewardableLikesLeft = numberOfRewardableLikesLeft
            post.numberOfRewardableCommentsLeft = numberOfRewardableCommentsLeft
            post.liked = liked ? true : false
            post.isPostOwner = (accountId === post.creatorId)

            return {
                data: post,
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
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
            console.log(posts)
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
                }
            }))


            return ({
                results,
                metadata: {
                    count: posts.length
                }
            })
        } catch (ex) {
            console.log(ex)
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
                where: { postId },
                relations: {
                    creator: true,
                    postCommentMedias: true,
                    post: true
                },
                take,
                skip,
                order: {
                    createdAt: {
                        direction: "DESC"
                    }
                }
            })
            const { creatorId } = await this.postMySqlRepository.findOneBy({postId})

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

            const rewardedComments = await queryRunner.manager
                .createQueryBuilder(PostCommentMySqlEntity, "post_comment")
                .where("post_comment.postId = :postId", { postId })
                .andWhere("post_comment.creatorId != :creatorId", { creatorId })
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
            const results = postComments.map((postComment) => {
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
                const isRewardable = uniqueRewardedComments.some(
                    comment => comment.postCommentId === postComment.postCommentId
                )

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

            return {
                results,
                metadata: {
                    count: numberOfPostCommentsResult.count
                }
            }
        } catch (ex) {
            console.log(ex)
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

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
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

            const numberOfPostCommentRepliesResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(PostCommentReplyMySqlEntity, "post_comment_reply")
                .where("post_comment_reply.postCommentId = :postCommentId", { postCommentId })
                .getRawOne()

            await queryRunner.commitTransaction()

            return {
                results: postCommentReplies,
                metadata: {
                    count: numberOfPostCommentRepliesResult.count
                }
            }
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyPostReports(input: FindManyPostReportsInput): Promise<FindManyPostReportsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const results = await this.reportPostMySqlRepository.find({
                relations:{
                    reporterAccount: true,
                    reportedPost: true,
                },
                skip,
                take
            })

            const numberOfPostReports = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(ReportPostMySqlEntity, "report-course")
                .getRawOne()

            return {
                results,
                metadata: {
                    count: numberOfPostReports.count
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
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
            const results = await this.reportPostCommentMySqlRepository.find({
                relations:{
                    reporterAccount: true,
                    reportedPostComment: true,
                },
                skip,
                take
            })

            const numberOfPostCommentReports = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(ReportPostCommentMySqlEntity, "report-course")
                .getRawOne()

            return {
                results,
                metadata: {
                    count: numberOfPostCommentReports.count
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }
}
