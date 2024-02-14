import { Injectable, NotFoundException } from "@nestjs/common"
import {
    CourseMySqlEntity,
    CourseTargetMySqlEntity,
    LectureMySqlEntity,
    SectionMySqlEntity,
} from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { StorageService } from "@global"
import {
    CreateCourseInput,
    CreateSectionInput,
    CreateLectureInput,
    UpdateCourseInput,
    CreateCourseTargetInput,
    UpdateCourseTargetInput,
    DeleteCourseTargetInput,
} from "./courses.input"
import { ProcessMpegDashProducer } from "@workers"
import { DeepPartial } from "typeorm"

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
    private readonly storageService: StorageService,
    private readonly mpegDashProcessorProducer: ProcessMpegDashProducer,
    ) {}

    async createCourse(input: CreateCourseInput): Promise<string> {
        const { description, price, title } = input.data
        const promises: Array<Promise<void>> = []

        let thumbnailId: string
        const thumbnail = input.files.at(0)
        const uploadThumbnailPromise = async () => {
            const { assetId } = await this.storageService.upload(thumbnail)
            thumbnailId = assetId
        }
        promises.push(uploadThumbnailPromise())

        let previewVideoId: string
        const previewVideo = input.files.at(1)
        const uploadPreviewVideoPromise = async () => {
            const { assetId } = await this.storageService.upload(previewVideo)
            previewVideoId = assetId
        }
        promises.push(uploadPreviewVideoPromise())

        await Promise.all(promises)

        const created = await this.courseMySqlRepository.save({
            creatorId: input.userId,
            description,
            price,
            title,
            thumbnailId,
            previewVideoId,
        })

        if (created)
            return `A course with id ${created.courseId} has been creeated successfully.`
    }

    async updateCourse(input: UpdateCourseInput): Promise<string> {
        const { data, files } = input
        const {
            thumbnailIndex,
            previewVideoIndex,
            courseId,
            description,
            price,
            title,
        } = data

        const course: DeepPartial<CourseMySqlEntity> = {
            description,
            price,
            title,
        }

        if (Number.isInteger(thumbnailIndex)) {
            const file = files.at(thumbnailIndex)
            const { assetId } = await this.storageService.upload(file)
            course.thumbnailId = assetId
        }
        if (Number.isInteger(previewVideoIndex)) {
            const file = files.at(previewVideoIndex)
            const { assetId } = await this.storageService.upload(file)
            course.previewVideoId = assetId
        }
        await this.courseMySqlRepository.update(courseId, course)
        return `A course wth id ${courseId} has been updated successfully`
    }

    async createSection(input: CreateSectionInput): Promise<string> {
        const { courseId, title } = input.data
        const course = await this.courseMySqlRepository.findOneBy({
            courseId,
        })
        if (!course) throw new NotFoundException("Course not found.")
        const created = await this.sectionMySqlRepository.save({
            courseId,
            title,
        })
        if (created)
            return `A section with id ${created.sectionId} has been creeated successfully.`
    }

    async createLecture(input: CreateLectureInput): Promise<string> {
        const { title, sectionId } = input.data
        const promises: Array<Promise<void>> = []

        let videoId: string
        const video = input.files.at(0)

        const uploadVideoPromise = async () => {
            const { assetId } = await this.mpegDashProcessorProducer.add(video)
            videoId = assetId
        }
        promises.push(uploadVideoPromise())

        await Promise.all(promises)

        const created = await this.lectureMySqlRepository.save({
            videoId,
            title,
            sectionId,
        })

        if (created)
            return `A lecture with id ${created.lectureId} has been creeated successfully.`
    }

    async createCourseTarget(input: CreateCourseTargetInput): Promise<string> {
        const { content, courseId, index } = input.data
        const created = await this.courseTargetMySqlRepository.save({
            courseId,
            index,
            content,
        })
        if (created)
            return `A course target with id ${created.courseTargetId} has been created successfully.`
    }

    async updateCourseTarget(input: UpdateCourseTargetInput): Promise<string> {
        const { content, courseTargetId } = input.data
        await this.courseTargetMySqlRepository.update(courseTargetId, {
            content,
        })
        return `A course target with id ${courseTargetId} has been updated successfully.`
    }

    async deleteCourseTarget(input: DeleteCourseTargetInput): Promise<string> {
        const { courseTargetId } = input.data
        await this.courseTargetMySqlRepository.delete({ courseTargetId })
        return `A course target with id ${courseTargetId} has been deleted successfully.`
    }
}
