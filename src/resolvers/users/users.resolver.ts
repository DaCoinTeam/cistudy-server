import { Resolver, Query, Args } from "@nestjs/graphql"
import { UsersService } from "./users.service"
import { FindOneUserData } from "./users.input"
import { UserEntity } from "src/database/mysql/user.entity"

@Resolver()
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

  @Query(() => UserEntity)
    async findOneUser(@Args("data") data: FindOneUserData) {
        return this.usersService.findOneUser({ data })
    }
}
