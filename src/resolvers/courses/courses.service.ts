import {
    CourseMySqlEntity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
} from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import {
    FindOneCourseInput,
    FindManyCoursesInput,
    FindManyLecturesInput,
    FindManyResourcesInput,
    FindOneLectureInput,
} from "./courses.input"

@Injectable()
export class CoursesService {
    constructor(
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    @InjectRepository(LectureMySqlEntity)
    private readonly lectureMySqlRepository: Repository<LectureMySqlEntity>,
    @InjectRepository(ResourceMySqlEntity)
    private readonly resourceMySqlRepository: Repository<ResourceMySqlEntity>,
    ) {}

    async findOneCourse(input: FindOneCourseInput): Promise<CourseMySqlEntity> {
        const { data } = input
        return await this.courseMySqlRepository.findOne({
            where: { courseId: data.courseId },
            relations: {
                sections: {
                    lectures: {
                        resources: true,
                    },
                },
                courseTargets: true,
            },
            order: {
                courseTargets: {
                    position: "ASC",
                },
            },
        })
    }

    async findManyCourses(
        input: FindManyCoursesInput,
    ): Promise<Array<CourseMySqlEntity>> {
        const { data } = input
        const founds = await this.courseMySqlRepository.findAndCount({
            relations: {
                creator: true,
            },
        })
        return founds[0]
    }

    async findOneLecture(
        input: FindOneLectureInput,
    ): Promise<LectureMySqlEntity> {
        const { data } = input
        return await this.lectureMySqlRepository.findOne({
            where: data,
            relations: {
                resources: true,
            },
        })
    }

    async findManyLectures(
        input: FindManyLecturesInput,
    ): Promise<Array<LectureMySqlEntity>> {
        const { data } = input
        return await this.lectureMySqlRepository.find({
            where: data,
            relations: {
                resources: true,
            },
        })
    }

    async findManyResources(
        input: FindManyResourcesInput,
    ): Promise<Array<ResourceMySqlEntity>> {
        const { data } = input
        return await this.resourceMySqlRepository.find({
            where: data,
        })
    }
}
