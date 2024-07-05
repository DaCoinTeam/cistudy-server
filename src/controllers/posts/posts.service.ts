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
    DeletePostInput, CreatePostReportInput,
    UpdatePostReportInput,
    CreatePostCommentReportInput,
    UpdatePostCommentReportInput,
    ResolvePostReportInput,
    ResolvePostCommentReportInput,
    MarkPostCommentAsSolutionInput
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
    ReportPostMySqlEntity,
    ReportPostCommentMySqlEntity,
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial, DataSource } from "typeorm"
import {
    CreatePostCommentOutput,
    CreatePostCommentReplyOutput,
    CreatePostCommentReportOutput,
    CreatePostOutput,
    CreatePostReportOutput,
    DeletePostCommentOutput,
    DeletePostCommentReplyOutput,
    DeletePostOutput,
    MarkPostCommentAsSolutionOutput, ResolvePostCommentReportOutput,
    ResolvePostReportOutput,
    ToggleCommentLikePostOutputData,
    ToggleLikePostOutputData,
    UpdatePostCommentOutput,
    UpdatePostCommentReplyOutput,
    UpdatePostCommentReportOutput,
    UpdatePostOutput,
    UpdatePostReportOutput
} from "./posts.output"
import { blockchainConfig } from "@config"
import { ReportProcessStatus, computeFixedFloor } from "@common"

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

        let earnAmount: number

        const numberOfUserPost = await this.postMySqlRepository.find({
            where: {
                creatorId: accountId,
                courseId
            }
        })

        if (numberOfUserPost.length < 3) {
            post.isRewardable = true
            const { priceAtEnrolled } = await this.enrolledInfoMySqlRepository.findOneBy({ accountId, courseId })

            console.log(priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.createPostEarnCoefficient)

            earnAmount = computeFixedFloor(
                priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.createPostEarnCoefficient
            )
            console.log("Earn Amount: " + earnAmount ? earnAmount : null)
            await this.accountMySqlRepository.increment({ accountId }, "balance", earnAmount)
        }

        const { postId } = await this.postMySqlRepository.save(post)

        return {
            message: "Post has been created successfully.",
            others: {
                postId,
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

        const updatePost = await this.postMySqlRepository.findOne({
            where: {
                postId
            }
        })

        if (!updatePost) {
            throw new NotFoundException("Post not found or has been deleted.")
        }

        if(updatePost.creatorId !== accountId){
            throw new ConflictException("You are not the owner of this post")
        }
        
        if(updatePost.isCompleted){
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

            const { courseId, creatorId, isRewardable, course, isCompleted } = await this.postMySqlRepository.findOne({
                where: {
                    postId
                },
                relations: {
                    course: true
                }
            })

            if (isCompleted == true) {
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


            if (isRewardable) {
                if (creatorId !== accountId) {
                    const { priceAtEnrolled } = isEnrolled
                    if (numberOfRewardedLike.length < 20) {
                        earnAmount = computeFixedFloor(priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.likePostEarnCoefficient)
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

        const post = await this.postMySqlRepository.findOne({
            where: {
                postId
            },
            relations: {
                course: true
            }
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


        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
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
                    courseId
                }
            })

            if (!isEnrolled) {
                throw new ConflictException(`You must be enrolled to course: ${course.title} to interact with this post`)
            }

            const numberOfPostComments = await this.postCommentMySqlRepository.findBy({ postId })
            const creatorIdsSeen = new Set()

            const filteredComments = numberOfPostComments.filter(comment => {
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

            if (isRewardable) {
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
                            earnAmount = computeFixedFloor(priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.commentPostEarnCoefficient)
                            await this.accountMySqlRepository.increment({ accountId }, "balance", earnAmount)
                        }
                    } else {
                        alreadyRewarded = true
                    }

                }
            }

            const { postCommentId } = await this.postCommentMySqlRepository.save(postComment)
            return {
                message: "Comment Posted Successfully",
                others: {
                    postCommentId,
                    alreadyRewarded,
                    earnAmount,
                    isOwner,
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
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
            const postComment = await this.postCommentMySqlRepository.findOne({
                where: {
                    postCommentId
                },
                relations:{
                    post: true
                }
            })

            if(!postComment){
                throw new NotFoundException("Post comment not found or has been deleted.")
            }

            if(postComment.creatorId !== accountId){
                throw new ConflictException("You are not the owner of this comment.")
            }

            if(postComment.post.isCompleted){
                throw new ConflictException("This post is closed.")
            }

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
            const postComment = await this.postCommentMySqlRepository.findOne({
                where: {
                    postCommentId
                },
                relations:{
                    post: true
                }
            })

            if(!postComment){
                throw new NotFoundException("Post comment not found or has been deleted.")
            }

            if(postComment.post.isCompleted){
                throw new ConflictException("This post is closed.")
            }
            
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

        const commentReply = await this.postCommentReplyMySqlRepository.findOne({
            where:{
                postCommentReplyId
            },
            relations:{
                postComment:{
                    post: true
                }
            }
        })

        if(!commentReply){
            throw new NotFoundException("Comment's reply not found or has been deleted")
        }

        if(commentReply.postComment.post.isCompleted){
            throw new ConflictException("This post is closed.")
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

    async markPostCommentAsSolution(input: MarkPostCommentAsSolutionInput): Promise<MarkPostCommentAsSolutionOutput> {
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

            const {creatorId, isRewardable, courseId, postId} = await this.postMySqlRepository.findOneBy({ postId: postComment.postId })

            if (creatorId !== accountId) {
                throw new ConflictException("You aren't the creator of the post.")
            }

            if (postComment.creatorId == creatorId) {
                throw new ConflictException("You can't mark your comment as a solution.")
            }

            const hasRewardedComment = await this.postCommentMySqlRepository.find({
                where: {
                    postId: postComment.postId
                }
            })

            if (hasRewardedComment.some(accountComment => accountComment.isSolution == true)) {
                throw new ConflictException("There's already exist a solution comment")
            }

            await this.postCommentMySqlRepository.update(postCommentId, { isSolution: true })

            if (isRewardable) {
                const { priceAtEnrolled } = await this.enrolledInfoMySqlRepository.findOne({
                    where: {
                        accountId: postComment.creatorId,
                        courseId
                    }
                })
                
                const earnAmount = computeFixedFloor(priceAtEnrolled * blockchainConfig().earns.percentage * blockchainConfig().earns.rewardCommentPostEarnCoefficient)
                await this.accountMySqlRepository.increment({ accountId: postComment.creatorId }, "balance", earnAmount)
            }

            await this.postMySqlRepository.update(postId, { isCompleted: true })

            return {
                message: `Comment of user ${postComment.creatorId} has been marked as a solution and no more comments are allowed to this post`
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async createPostReport(input: CreatePostReportInput): Promise<CreatePostReportOutput> {
        const { data, accountId } = input
        const { reportedPostId, description } = data

        const reportedPost = await this.postMySqlRepository.findOneBy({ postId: reportedPostId })

        if (!reportedPost) {
            throw new NotFoundException("Reported post is not found or has been deleted")
        }

        const processing = await this.reportPostMySqlRepository.find({
            where: {
                reportedPostId
            }
        })

        if (processing && processing.some(processing => processing.processStatus === ReportProcessStatus.Processing)) {
            throw new ConflictException("You have reported this accout before and it is processing. Try update your report instead.")
        }

        const { reportPostId } = await this.reportPostMySqlRepository.save({
            reporterAccountId: accountId,
            reportedPostId,
            description
        })

        return {
            message: `A report to post ${reportedPost.title} has been submitted.`,
            others: {
                reportPostId
            }
        }
    }

    async updatePostReport(input: UpdatePostReportInput): Promise<UpdatePostReportOutput> {
        const { data, accountId } = input
        const { reportPostId, description } = data

        const found = await this.reportPostMySqlRepository.findOneBy({ reportPostId })

        if (!found) {
            throw new NotFoundException("Post's report not found.")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has been resolved and closed.")
        }

        if (found.reporterAccountId !== accountId) {
            throw new ConflictException("You aren't the owner of this report.")
        }

        await this.reportPostMySqlRepository.update(reportPostId, { description })

        return {
            message: "Your Report has been updated successfully",
            others: {
                reportPostId
            }
        }
    }

    async createPostCommentReport(input: CreatePostCommentReportInput): Promise<CreatePostCommentReportOutput> {
        const { data, accountId } = input
        const { reportedPostCommentId, description } = data

        const reportedPostComment = await this.postCommentMySqlRepository.findOneBy({ postCommentId: reportedPostCommentId })

        if (!reportedPostComment) {
            throw new NotFoundException("Reported post's comment is not found or has been deleted")
        }

        const processing = await this.reportPostCommentMySqlRepository.find({
            where: {
                reportedPostCommentId
            }
        })

        if (processing && processing.some(processing => processing.processStatus === ReportProcessStatus.Processing)) {
            throw new ConflictException("You have reported this accout before and it is processing. Try update your report instead.")
        }

        const { reportPostCommentId } = await this.reportPostCommentMySqlRepository.save({
            reporterAccountId: accountId,
            reportedPostCommentId,
            description
        })

        return {
            message: `A report to a post's comment with id ${reportedPostComment.postCommentId} has been submitted.`,
            others: {
                reportPostCommentId
            }
        }
    }

    async updatePostCommentReport(input: UpdatePostCommentReportInput): Promise<UpdatePostCommentReportOutput> {
        const { data, accountId } = input
        const { reportPostCommentId, description } = data

        const found = await this.reportPostCommentMySqlRepository.findOneBy({ reportPostCommentId })

        if (!found) {
            throw new NotFoundException("Post comment's report not found.")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has been resolved and closed.")
        }

        if (found.reporterAccountId !== accountId) {
            throw new ConflictException("You aren't the owner of this report.")
        }

        await this.reportPostCommentMySqlRepository.update(reportPostCommentId, { description })

        return {
            message: "Your Report has been updated successfully",
            others: {
                reportPostCommentId
            }
        }
    }

    async resolvePostReport(input: ResolvePostReportInput): Promise<ResolvePostReportOutput> {
        const { data } = input
        const { reportPostId, processNote, processStatus } = data

        const found = await this.reportPostMySqlRepository.findOneBy({ reportPostId })

        if (!found) {
            throw new NotFoundException("Report not found")
        }

        if(found.processStatus !== ReportProcessStatus.Processing){
            throw new ConflictException("This report has already been resolved")
        }

        await this.reportPostMySqlRepository.update(reportPostId, { processStatus, processNote })

        return {
            message: "Report successfully resolved and closed."
        }
    }

    async resolvePostCommentReport(input: ResolvePostCommentReportInput): Promise<ResolvePostCommentReportOutput> {
        const { data } = input
        const { reportPostCommentId, processNote, processStatus } = data

        const found = await this.reportPostCommentMySqlRepository.findOneBy({ reportPostCommentId })

        if (!found) {
            throw new NotFoundException("Report not found")
        }
        
        if(found.processStatus !== ReportProcessStatus.Processing){
            throw new ConflictException("This report has already been resolved")
        }

        await this.reportPostCommentMySqlRepository.update(reportPostCommentId, { processStatus, processNote })

        return {
            message: "Report successfully resolved and closed."
        }
    }
}
