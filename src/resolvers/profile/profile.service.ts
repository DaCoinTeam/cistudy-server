import { CourseMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { FindManySelfCreatedCoursesInput } from "./profile.input"
import { InjectRepository } from "@nestjs/typeorm"
@Injectable()
export class ProfileService {
    constructor(
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    ) {}

    async findManySelfCreatedCourses(input: FindManySelfCreatedCoursesInput): Promise<Array<CourseMySqlEntity>> {
        const { data, userId } = input
        const { options } = data
        
        const take = options?.take
        const skip = options?.skip

        return await this.courseMySqlRepository.find(
            {
                where: {
                    creatorId: userId,
                },
                take,
                skip
            }
        ) 
    }
}