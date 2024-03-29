import {
    PostCommentLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostCommentReplyMySqlEntity,
    PostLikeMySqlEntity,
    PostMySqlEntity,
} from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource } from "typeorm"
import {
    FindManyPostCommentRepliesInput,
    FindManyPostCommentsInput,
    FindManyPostsInput,
    FindOnePostCommentInput,
    FindOnePostInput,
} from "./posts.input"
import { FindManyPostCommentRepliesOutputData, FindManyPostCommentsOutputData, FindManyPostsOutputData } from "./posts.output"
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
        private readonly dataSource: DataSource,
    ) { }

    async findOnePost(input: FindOnePostInput): Promise<PostMySqlEntity> {
        const { data } = input
        const { params } = data
        const { postId } = params

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const post = await queryRunner.manager.findOne(PostMySqlEntity, {
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

            const numberOfLikes = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(PostLikeMySqlEntity, "postLike")
                .where("postLikeId = :postLikeId", { postLikeId: true })
                .getRawOne()

            const numberOfComments = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(PostCommentMySqlEntity, "postComment")
                .where("postLikeId = :postLikeId", { postLikeId: true })
                .getRawOne()

            await queryRunner.commitTransaction()

            post.numberOfLikes = numberOfLikes.count
            post.numberOfComments = numberOfComments.count

            return post
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
        const { data, userId } = input
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
                    }
                }
            })

            const numberOfLikesResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(post_like.postId)", "count")
                .addSelect("post.postId", "postId")
                .from(PostMySqlEntity, "post")
                .innerJoin(PostLikeMySqlEntity, "post_like", "post.postId = post_like.postId")
                .where("liked = :liked", { liked: true })
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
                .addSelect("post_like.liked", "liked")
                .from(PostMySqlEntity, "post")
                .innerJoin(PostLikeMySqlEntity, "post_like", "post.postId = post_like.postId")
                .where("post_like.userId = :userId", { userId })
                .andWhere("post_like.liked = :liked", { liked: true })
                .getRawMany()

            const numberOfPostsResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(PostMySqlEntity, "post")
                .getRawOne()

            await queryRunner.commitTransaction()

            const results = posts.map((post) => {
                const numberOfLikes = numberOfLikesResults.find(
                    result => result.postId === post.postId,
                )?.count ?? 0
                const numberOfComments = numberOfCommentsResults.find(
                    result => result.postId === post.postId,
                )?.count ?? 0
                const liked = likedResults.find(
                    result => result.postId === post.postId,
                )?.liked ?? false

                return {
                    ...post,
                    numberOfLikes,
                    numberOfComments,
                    liked
                }
            })

            return ({
                results,
                metadata: {
                    count: numberOfPostsResult.count
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
        const { userId, data } = input
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
                },
                take,
                skip,
                order: {
                    createdAt: {
                        direction: "DESC"
                    }
                }
            })

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
                .where("post_comment_like.userId = :userId", { userId })
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

            await queryRunner.commitTransaction()

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

                return {
                    ...postComment,
                    numberOfLikes,
                    numberOfReplies,
                    liked
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
}
