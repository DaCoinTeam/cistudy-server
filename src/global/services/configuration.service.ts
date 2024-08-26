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
        let completed = 10
        let earn = 30
        let foundation = 10

        if (courseConfigurations.length > 0) {
            const { completed : _completed, earn: _earn } = courseConfigurations[0]
            completed = _completed
            earn = _earn
        }
        
        const configurations = await this.configurationMySqlConfiguration.find({
            order: {
                createdAt: "DESC"
            }
        })

        if (configurations.length === 0) {
            foundation = configurations[0].foundation
        }

        return {
            completed,
            earn,
            foundation,
            instructor: 100 - completed - earn - foundation
        }
    } 

}