import {
    PostCommentLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostLikeMySqlEntity,
    PostMySqlEntity,
} from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource } from "typeorm"
import {
    FindManyPostCommentsInput,
    FindManyPostCommentsMetadataInput,
    FindManyPostsInput,
    FindOnePostCommentInput,
    FindOnePostInput,
} from "./posts.input"
import { FindManyPostCommentsMetadataOutputData, FindManyPostsMetadataOutputData } from "./posts.output"

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostMySqlEntity)
        private readonly postMySqlRepository: Repository<PostMySqlEntity>,
        @InjectRepository(PostCommentMySqlEntity)
        private readonly postCommentMySqlRepository: Repository<PostCommentMySqlEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async findOnePost(input: FindOnePostInput): Promise<PostMySqlEntity> {
        const { data } = input

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const post = await queryRunner.manager.findOne(PostMySqlEntity, {
                where: data,
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
                .select("COUNT(*)", "result")
                .from(PostLikeMySqlEntity, "postLike")
                .where("postLikeId = :postLikeId", { postLikeId: true })
                .getRawOne()

            const numberOfComments = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "result")
                .from(PostCommentMySqlEntity, "postComment")
                .where("postLikeId = :postLikeId", { postLikeId: true })
                .getRawOne()

            await queryRunner.commitTransaction()

            post.numberOfLikes = numberOfLikes.result
            post.numberOfComments = numberOfComments.result

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
        return await this.postCommentMySqlRepository.findOne({
            where: data,
            relations: {
                creator: true,
                postCommentMedias: true,
            },
        })
    }

    async findManyPosts(
        input: FindManyPostsInput,
    ): Promise<Array<PostMySqlEntity>> {
        const { data, userId } = input
        const { courseId, options } = data
        const { take, skip } = options || {}

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
            })

            const numberOfLikesResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(post_like.postId)", "count")
                .addSelect("post.postId", "postId")
                .from(PostMySqlEntity, "post")
                .innerJoin(PostLikeMySqlEntity, "post_like", "post.postId = post_like.postId")
                .where("liked = :liked", { liked: true })
                .where("courseId = :courseId", { courseId })
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

            await queryRunner.commitTransaction()

            return posts.map((post) => {
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
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyPostsMetadata(): Promise<FindManyPostsMetadataOutputData> {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const numberOfPosts = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "result")
                .from(PostMySqlEntity, "post")
                .getRawOne()

            await queryRunner.commitTransaction()

            return {
                numberOfPosts: numberOfPosts.result,
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyPostComments(
        input: FindManyPostCommentsInput,
    ): Promise<Array<PostCommentMySqlEntity>> {
        const { userId, data } = input
        const { options, postId } = data
        const { take, skip } = options || {}

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
                skip
            })

            const numberOfLikesResults = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(post_comment_like.postCommentId)", "count")
                .addSelect("post_comment.postCommentId", "postCommentId")
                .from(PostCommentMySqlEntity, "post_comment")
                .innerJoin(PostCommentLikeMySqlEntity, "post_comment_like", "post_comment.postCommentId = post_comment_like.postCommentId")
                .where("liked = :liked", { liked: true })
                .where("postId = :postId", { postId })
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

            await queryRunner.commitTransaction()

            return postComments.map((postComment) => {
                const numberOfLikes = numberOfLikesResults.find(
                    result => result.postCommentId === postComment.postCommentId,
                )?.count ?? 0
                const liked = likedResults.find(
                    result => result.postCommentId === postComment.postCommentId,
                )?.liked ?? false

                return {
                    ...postComment,
                    numberOfLikes,
                    liked
                }
            })
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyPostCommentsMetadata(input: FindManyPostCommentsMetadataInput): Promise<FindManyPostCommentsMetadataOutputData> {
        const { data } = input
        const { postId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const numberOfPostComments = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "result")
                .from(PostCommentMySqlEntity, "post_comment")
                .where("post_comment.postId = :postId", { postId })
                .getRawOne()

            await queryRunner.commitTransaction()

            return {
                numberOfPostComments: numberOfPostComments.result,
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}
