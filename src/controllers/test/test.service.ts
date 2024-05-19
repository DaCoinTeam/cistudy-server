import { Injectable } from "@nestjs/common"
import { TryInput } from "./test.input"
import { TryOutput } from "./test.output"
import { InjectRepository } from "@nestjs/typeorm"
import { TestMySqlEntity } from "@database"
import { Repository } from "typeorm"

@Injectable()
export class TestService {
    constructor(
        @InjectRepository(TestMySqlEntity)
        private readonly testMySqlRepository: Repository<TestMySqlEntity>,
    ) {
      
    }

    async try(input: TryInput) : Promise<TryOutput> {
        const message = input.hello + input.world
        await this.testMySqlRepository.save({
            message
        })
        return { message }
    }
}