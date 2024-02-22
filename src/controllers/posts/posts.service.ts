import { StorageService } from "@global"
import { Injectable } from "@nestjs/common"
import {
    CreateCommentInput,
    CreatePostInput,
    ReactPostInput,
    UpdateCommentInput,
    UpdatePostInput,
} from "./posts.input"
import { ContentType } from "@common"
import {
    PostMySqlEntity,
    PostReactMySqlEntity,
    PostCommentMySqlEntity,
    PostContentMySqlEntity,
    PostCommentContentMySqlEntity,
    PostCommentContentMediaMySqlEntity
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DeepPartial } from "typeorm"
import { PostContentMediaEntity } from "src/database/mysql/post-content-media.entity"

@Injectable()
export class PostsService {
    constructor(
    @InjectRepository(PostMySqlEntity)
    private readonly postMySqlRepository: Repository<PostMySqlEntity>,
    @InjectRepository(PostReactMySqlEntity)
    private readonly postReactMySqlRepository: Repository<PostReactMySqlEntity>,
    @InjectRepository(PostCommentMySqlEntity)
    private readonly postCommentMySqlRepository: Repository<PostCommentMySqlEntity>,
    @InjectRepository(PostContentMySqlEntity)
    private readonly postContentsMySqlRepository: Repository<PostContentMySqlEntity>,
    @InjectRepository(PostCommentContentMySqlEntity)
    private readonly postCommentContentMySqlRepository: Repository<PostCommentContentMySqlEntity>,

    private readonly storageService: StorageService,
    ) {}

    async createPost(input: CreatePostInput): Promise<string> {
        const { data, files, userId } = input
        console.log(data)
        const { postContents, title, courseId } = data
        const post: DeepPartial<PostMySqlEntity> = {
            title,
            courseId,
            creatorId: userId,
            postContents: [],
        }

        const promises: Array<Promise<void>> = []

        let contentPosition = 0
        for (const postContent of postContents) {
            const { text, postContentMedias, contentType } = postContent

            const position = contentPosition
            const promise = async () => {
                if (
                    contentType === ContentType.Text ||
          contentType === ContentType.Code ||
          contentType === ContentType.Link
                ) {
                    post.postContents.push({
                        contentType,
                        position,
                        text,
                    } as PostContentMySqlEntity)
                } else {
                    let mediaPosition = 0
                    const mediaPromises: Array<Promise<void>> = []
                    const medias: Array<DeepPartial<PostContentMediaEntity>> = []

                    for (const postContentMedia of postContentMedias) {
                        const { mediaIndex } = postContentMedia
                        const position = mediaPosition
                        const mediaPromise = async () => {
                            const file = files.at(mediaIndex)
                            const { assetId } = await this.storageService.upload({
                                rootFile: file,
                            })
                            const media: DeepPartial<PostContentMediaEntity> = {
                                position,
                                mediaId: assetId,
                            }
                            medias.push(media)
                        }
                        mediaPosition++
                        mediaPromises.push(mediaPromise())
                    }
                    await Promise.all(mediaPromises)

                    post.postContents.push({
                        contentType,
                        position,
                        postContentMedias: medias,
                    } as PostContentMySqlEntity)
                }
            }
            contentPosition++
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

    async reactPost(input: ReactPostInput) {
        const { userId, data } = input
        const { postId } = data
        const found = await this.postReactMySqlRepository.findOneBy({
            userId,
            postId,
        })

        let postReactId: string
        let liked: boolean

        if (found === null) {
            // do claim rewards action
        } else {
            postReactId = found.postReactId
            liked = !found.liked
        }

        const postReact = await this.postReactMySqlRepository.save({
            postReactId,
            userId,
            postId,
            liked,
        })

        return `Successfully react the post with id ${postReact.postReactId}.`
    }

    async createComment(input: CreateCommentInput) {
        const { data, files, userId } = input
        const { postCommentContents, postId } = data
        const postComment: DeepPartial<PostCommentMySqlEntity> = {
            postId,
            creatorId: userId,
            postCommentContents: [],
        }

        const promises: Array<Promise<void>> = []

        let contentPosition = 0
        for (const postCommentContent of postCommentContents) {
            const { text, postCommentContentMedias, contentType } = postCommentContent

            const position = contentPosition
            const promise = async () => {
                if (
                    contentType === ContentType.Text ||
          contentType === ContentType.Code ||
          contentType === ContentType.Link
                ) {
                    postComment.postCommentContents.push({
                        contentType,
                        position,
                        text,
                    } as PostCommentContentMySqlEntity)
                } else {
                    let mediaPosition = 0
                    const mediaPromises: Array<Promise<void>> = []
                    const medias: Array<DeepPartial<PostContentMediaEntity>> = []

                    for (const postCommentContentMedia of postCommentContentMedias) {
                        const { mediaIndex } = postCommentContentMedia
                        const position = mediaPosition
                        const mediaPromise = async () => {
                            const file = files.at(mediaIndex)
                            const { assetId } = await this.storageService.upload({
                                rootFile: file,
                            })
                            const media: DeepPartial<PostCommentContentMediaMySqlEntity> = {
                                position,
                                mediaId: assetId,
                            }
                            medias.push(media)
                        }
                        mediaPosition++
                        mediaPromises.push(mediaPromise())
                    }
                    await Promise.all(mediaPromises)

                    postComment.postCommentContents.push({
                        contentType,
                        position,
                        postCommentContentMedias: medias,
                    } as PostCommentContentMySqlEntity)
                }
            }
            contentPosition++
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
