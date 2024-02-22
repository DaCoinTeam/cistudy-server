import { CourseMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FindOneCourseInput, FindManyCoursesInput } from "./courses.input"

@Injectable()
export class CoursesService {
    constructor(
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    ) {}

    async findOneCourse(input: FindOneCourseInput): Promise<CourseMySqlEntity> {
        const { data } = input
        return await this.courseMySqlRepository.findOne({
            where: { courseId: data.courseId },
            relations: {
                sections: {
                    lectures: {
                        resources: true
                    }
                },
                courseTargets: true
            },
            order: {
                courseTargets: {
                    position: "ASC"
                }
            }
        })
    }

    async findManyCourses(input: FindManyCoursesInput): Promise<Array<CourseMySqlEntity>> {
        const { data } = input
        const founds = await this.courseMySqlRepository.findAndCount({
            relations: {
                creator: true
            }
        })
        return founds[0]
    }
}
