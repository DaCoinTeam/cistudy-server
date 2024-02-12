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
        return await this.courseMySqlRepository.findOneBy(input)
    }

    async findManyCourses(input: FindManyCoursesInput): Promise<CourseMySqlEntity[]> {

        const founds = await this.courseMySqlRepository.findAndCount({
            relations: {
                creator: true
            }
        })
        console.dir(founds, { depth: null})
        return founds[0]
    }
}
