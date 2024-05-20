import { TestController } from "./test.controller"
import { TestingModule, Test } from "@nestjs/testing"
import { TestService } from "./test.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TestMySqlEntity } from "./../../database"

describe("TestController", () => {
    let testController: TestController

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [TestController],
            imports: [
                TypeOrmModule.forFeature([
                    TestMySqlEntity
                ])
            ],
            providers: [
                TestService,
            ],
        }).compile()
      
        testController = app.get(TestController)
    })

    describe("try", () => {
        it("should try success", async () => {
            expect(testController.try("0e5cc63c-5224-44b3-850f-13ddcf02e415", {
                hello: "hello",
                world: "world"
            })).toBe({
                message: "dept4rai"
            })
        })
    })
})