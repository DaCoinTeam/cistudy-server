import { Resolver, Query, Args } from "@nestjs/graphql"
import { UsersService } from "./users.service"
import { UserMySqlEntity } from "@database"
import { FindOneUserInput } from "./users.input"
import { UserEntity } from "src/database/mysql/user.entity"

@Resolver(() => UserMySqlEntity)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

  @Query(() => UserEntity)
    async findOneUser(@Args("input") input: FindOneUserInput) {
        return this.usersService.findOneUser(input)
    }
}
