import { ConfigurationMySqlEntity, CourseConfigurationMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class ConfigurationService {
    constructor(
        @InjectRepository(ConfigurationMySqlEntity)
        private readonly configurationMySqlConfiguration: Repository<ConfigurationMySqlEntity>,
        @InjectRepository(CourseConfigurationMySqlEntity)
        private readonly courseConfigurationMySqlConfiguration: Repository<CourseConfigurationMySqlEntity>,
    ) { }

    async getConfiguration (courseId: string) : Promise<{ 
            instructor: number,
            earn: number,
            completed: number,
            foundation: number
        }> {
        const courseConfigurations = await this.courseConfigurationMySqlConfiguration.find({
            where: {
                courseId
            },
            order: {
                createdAt: "DESC"
            }
        })
        const { completed, earn } = courseConfigurations[0]

        const configurations = await this.configurationMySqlConfiguration.find({
            order: {
                createdAt: "DESC"
            }
        })
        const { foundation } = configurations[0]

        return {
            completed,
            earn,
            foundation,
            instructor: 100 - completed - earn - foundation
        }
    } 

}