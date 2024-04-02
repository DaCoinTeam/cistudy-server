import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import {
    CategoryMySqlEntity,
    CourseMySqlEntity,
    CourseSubcategoryMySqlEntity,
    CourseTargetMySqlEntity,
    CourseTopicMySqlEntity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
    SectionMySqlEntity,
    SubcategoyMySqlEntity,
    TopicMySqlEntity,
    TransactionMongo,
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, DataSource } from "typeorm"
import { StorageService } from "@global"
import {
    CreateCourseInput,
    CreateSectionInput,
    CreateLectureInput,
    UpdateCourseInput,
    CreateCourseTargetInput,
    UpdateCourseTargetInput,
    DeleteCourseTargetInput,
    CreateResourcesInput,
    UpdateLectureInput,
    DeleteLectureInput,
    DeleteSectionInput,
    UpdateSectionInput,
    DeleteResourceInput,
    EnrollCourseInput,
    CreateCategoryInput,
    CreateSubcategoryInput,
    CreateTopicInput,
} from "./courses.input"
import { ProcessMpegDashProducer } from "@workers"
import { DeepPartial } from "typeorm"
import { ProcessStatus, VideoType, computeRaw, existKeyNotUndefined } from "@common"
import { CreateCategoryOutput, CreateCourseOutput, CreateSubcategoryOutput, CreateTopicOutput, EnrollCourseOutput, UpdateCourseOutput } from "./courses.output"
import { EnrolledInfoEntity } from "src/database/mysql/enrolled-info.entity"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(SectionMySqlEntity)
        private readonly sectionMySqlRepository: Repository<SectionMySqlEntity>,
        @InjectRepository(LectureMySqlEntity)
        private readonly lectureMySqlRepository: Repository<LectureMySqlEntity>,
        @InjectRepository(CourseTargetMySqlEntity)
        private readonly courseTargetMySqlRepository: Repository<CourseTargetMySqlEntity>,
        @InjectRepository(ResourceMySqlEntity)
        private readonly resourceMySqlRepository: Repository<ResourceMySqlEntity>,
        @InjectRepository(EnrolledInfoEntity)
        private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoEntity>,
        @InjectRepository(CourseSubcategoryMySqlEntity)
        private readonly courseSubcategoryMySqlRepository: Repository<CourseSubcategoryMySqlEntity>,
        @InjectRepository(CourseTopicMySqlEntity)
        private readonly courseTopicMySqlRepository: Repository<CourseTopicMySqlEntity>,
        @InjectRepository(CategoryMySqlEntity)
        private readonly categoryMySqlRepository: Repository<CategoryMySqlEntity>,
        @InjectRepository(SubcategoyMySqlEntity)
        private readonly subcategoryMySqlRepository: Repository<SubcategoyMySqlEntity>,
        @InjectRepository(TopicMySqlEntity)
        private readonly topicMySqlRepository: Repository<TopicMySqlEntity>,
        @InjectModel(TransactionMongo.name) private readonly transactionMongoModel: Model<TransactionMongo>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly storageService: StorageService,
        private readonly mpegDashProcessorProducer: ProcessMpegDashProducer,
        private readonly dataSource: DataSource
    ) { }

    async enrollCourse(input: EnrollCourseInput): Promise<EnrollCourseOutput> {
        const { data, userId } = input
        const { courseId, code } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const found = await this.enrolledInfoMySqlRepository.findOne({
                where: {
                    userId, courseId
                }
            }
            )

            if (found?.enrolled) throw new ConflictException("You have enrolled to this course.")

            const { transactionHash } = (await this.cacheManager.get(code)) as CodeValue
            if (!transactionHash) throw new NotFoundException("The code either expired or never existed.")

            const transaction = await this.transactionMongoModel.findOne({
                transactionHash
            })
            if (!transaction) {
                throw new NotFoundException("Transaction not found.")
            }

            const { _id, isValidated, value } = transaction

            if (isValidated) throw new ConflictException("This transaction is validated.")

            const { enableDiscount, discountPrice, price: coursePrice } = await this.courseMySqlRepository.findOne({
                where: {
                    courseId
                }
            }
            )

            const price = enableDiscount ? discountPrice : coursePrice
            if (BigInt(value) < computeRaw(price)) throw new ConflictException("Value is not enough.")

            await this.transactionMongoModel.findOneAndUpdate({ _id }, {
                isValidated: true
            },
            )

            const { enrolledInfoId } = await this.enrolledInfoMySqlRepository.save({
                enrolledInfoId: found?.enrolledInfoId,
                courseId,
                userId,
                enrolled: true
            })

            await queryRunner.commitTransaction()

            return { enrolledInfoId }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async createCourse(input: CreateCourseInput): Promise<CreateCourseOutput> {
        const { userId } = input
        const created = await this.courseMySqlRepository.save({
            creatorId: userId,
        })

        if (created)
            return {
                courseId: created.courseId
            }
    }

    async updateCourse(input: UpdateCourseInput): Promise<UpdateCourseOutput> {
        const { data, files } = input
        const {
            thumbnailIndex,
            previewVideoIndex,
            courseId,
            description,
            price,
            discountPrice,
            enableDiscount,
            title,
            categoryId,
            subcategoryIds,
            topicIds
        } = data

        const course: DeepPartial<CourseMySqlEntity> = {
            courseId,
            description,
            title,
            price,
            discountPrice,
            enableDiscount,
            categoryId,
            courseSubcategories: subcategoryIds?.map(subcategoryId => ({
                subcategoryId,
                courseId
            })),
            courseTopics: topicIds?.map(topicId => ({
                topicId
            })),
        }

        const promises: Array<Promise<void>> = []

        const { previewVideoId, thumbnailId } =
            await this.courseMySqlRepository.findOneBy({ courseId })

        if (Number.isInteger(previewVideoIndex)) {
            const promise = async () => {
                const file = files.at(previewVideoIndex)
                if (previewVideoId) {
                    await this.storageService.update(thumbnailId, {
                        rootFile: file,
                    })
                } else {
                    const { assetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    course.previewVideoId = assetId
                }
            }
            promises.push(promise())
        }

        if (Number.isInteger(thumbnailIndex)) {
            const promise = async () => {
                const file = files.at(thumbnailIndex)
                if (thumbnailId) {
                    await this.storageService.update(thumbnailId, {
                        rootFile: file,
                    })
                } else {
                    const { assetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    course.thumbnailId = assetId
                }
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            if (subcategoryIds?.length)
                await this.courseSubcategoryMySqlRepository.delete({ courseId })

            if (topicIds?.length)
                await this.courseTopicMySqlRepository.delete({ courseId })

            if (existKeyNotUndefined(course))
                await this.courseMySqlRepository.save(course)

            await queryRunner.commitTransaction()

            return {}
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }


    }

    async createSection(input: CreateSectionInput): Promise<string> {
        const { data } = input
        const { courseId, title } = data
        const course = await this.courseMySqlRepository.findOneBy({
            courseId,
        })
        if (!course) throw new NotFoundException("Course not found.")
        const created = await this.sectionMySqlRepository.save({
            courseId,
            title,
        })
        if (created)
            return `A section with id ${created.sectionId} has been created successfully.`
    }

    async createLecture(input: CreateLectureInput): Promise<string> {
        const { title, sectionId } = input.data

        const created = await this.lectureMySqlRepository.save({
            title,
            sectionId,
        })

        if (created)
            return `A lecture with id ${created.lectureId} has been creeated successfully.`
    }

    async updateLecture(input: UpdateLectureInput): Promise<string> {
        const { data, files } = input
        const { lectureId, title, description, lectureVideoIndex, thumbnailIndex } = data

        const { thumbnailId, lectureVideoId } =
            await this.lectureMySqlRepository.findOneBy({ lectureId })

        const promises: Array<Promise<void>> = []

        const lecture: DeepPartial<LectureMySqlEntity> = { title, description }

        if (Number.isInteger(lectureVideoIndex)) {
            const promise = async () => {
                const file = files.at(lectureVideoIndex)

                await this.lectureMySqlRepository.update(
                    { lectureId },
                    {
                        processStatus: ProcessStatus.Pending,
                    },
                )

                const queryAtStart = this.lectureMySqlRepository
                    .createQueryBuilder()
                    .update()
                    .set({
                        processStatus: ProcessStatus.Processing,
                    })
                    .where({
                        lectureId,
                    })
                    .getQueryAndParameters()

                const queryAtEnd = this.lectureMySqlRepository
                    .createQueryBuilder()
                    .update()
                    .set({
                        processStatus: ProcessStatus.Completed,
                        videoType: VideoType.DASH
                    })
                    .andWhere({
                        lectureId,
                    })
                    .getQueryAndParameters()

                let assetId: string
                if (lectureVideoId) {
                    await this.storageService.update(lectureVideoId, {
                        rootFile: file,
                    })
                    assetId = lectureVideoId
                } else {
                    const { assetId: createdAssetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    lecture.lectureVideoId = createdAssetId
                    assetId = createdAssetId
                }

                await this.mpegDashProcessorProducer.add({
                    assetId,
                    file,
                    callbackQueries: {
                        queryAtStart,
                        queryAtEnd,
                    },
                })
            }
            promises.push(promise())
        }

        if (Number.isInteger(thumbnailIndex)) {
            const promise = async () => {
                const file = files.at(thumbnailIndex)
                if (thumbnailId) {
                    await this.storageService.update(thumbnailId, {
                        rootFile: file,
                    })
                } else {
                    const { assetId } = await this.storageService.upload({
                        rootFile: file,
                    })
                    lecture.thumbnailId = assetId
                }
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        if (existKeyNotUndefined(lecture))
            await this.lectureMySqlRepository.update(lectureId, lecture)
        return `A lecture with id ${lectureId} has been updated successfully.`
    }

    async deleteLecture(input: DeleteLectureInput): Promise<string> {
        const { data } = input
        const { lectureId } = data
        await this.lectureMySqlRepository.delete({ lectureId })
        return `A lecture with id ${lectureId} has been deleted successfully.`
    }

    async createCourseTarget(input: CreateCourseTargetInput): Promise<string> {
        const { data } = input
        const { content, courseId } = data
        const maxResult = await this.courseTargetMySqlRepository.createQueryBuilder()
            .select("MAX(position)", "count").getRawOne()
        const max = maxResult.count as number

        const created = await this.courseTargetMySqlRepository.save({
            courseId,
            content,
            position: max + 1,
        })
        if (created)
            return `A course target with id ${created.courseTargetId} has been created successfully.`
    }

    async updateCourseTarget(input: UpdateCourseTargetInput): Promise<string> {
        const { data } = input
        const { content, courseTargetId } = data
        await this.courseTargetMySqlRepository.update(courseTargetId, {
            content,
        })
        return `A course target with id ${courseTargetId} has been updated successfully.`
    }

    async deleteCourseTarget(input: DeleteCourseTargetInput): Promise<string> {
        const { data } = input
        const { courseTargetId } = data
        await this.courseTargetMySqlRepository.delete({ courseTargetId })
        return `A course target with id ${courseTargetId} has been deleted successfully.`
    }

    async createResources(input: CreateResourcesInput): Promise<string> {
        const { files, data } = input
        const { lectureId } = data

        const promises: Array<Promise<void>> = []
        const resources: Array<DeepPartial<ResourceMySqlEntity>> = []

        for (const file of files) {
            const promise = async () => {
                const { assetId } = await this.storageService.upload({
                    rootFile: file,
                })
                resources.push({
                    name: file.originalname,
                    fileId: assetId,
                    lectureId,
                })
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        await this.resourceMySqlRepository.save(resources)
        return `Resources with ids ${resources.map((resource) => resource.resourceId)} has been created successfully.`
    }

    async updateSection(input: UpdateSectionInput): Promise<string> {
        const { data } = input
        const { sectionId, title } = data
        await this.sectionMySqlRepository.update(sectionId, {
            title,
        })
        return `A section with id  ${sectionId} has been updated successfully.`
    }

    async deleteSection(input: DeleteSectionInput): Promise<string> {
        const { data } = input
        const { sectionId } = data
        await this.sectionMySqlRepository.delete({ sectionId })
        return `A section with id ${sectionId} has been deleted successfully.`
    }

    async deleteResource(input: DeleteResourceInput): Promise<string> {
        const { data } = input
        const { resourceId } = data
        await this.resourceMySqlRepository.delete({ resourceId })
        return `A resource with id ${resourceId} has been deleted successfully.`
    }

    //apis only
    async createCategory(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
        const { data } = input
        const { name } = data

        const { categoryId } = await this.categoryMySqlRepository.save({
            name
        })

        return {
            categoryId
        }
    }

    async createSubcategory(input: CreateSubcategoryInput): Promise<CreateSubcategoryOutput> {
        const { data } = input
        const { name, categoryId } = data

        const { subcategoryId } = await this.subcategoryMySqlRepository.save({
            name,
            categoryId
        })

        return {
            subcategoryId
        }
    }

    async createTopic(input: CreateTopicInput): Promise<CreateTopicOutput> {
        const { data, files } = input
        const { name, subcategoryIds } = data

        console.log(input)

        const file = files.at(0)
        if (!file) return

        const { assetId } = await this.storageService.upload({
            rootFile: file,
        })

        const { topicId } = await this.topicMySqlRepository.save({
            svgId: assetId,
            name,
            subcategoryTopics: subcategoryIds.map(subcategoryId => ({
                subcategoryId
            }))
        })

        return {
            topicId
        }
    }
}


interface CodeValue {
    transactionHash: string;
}