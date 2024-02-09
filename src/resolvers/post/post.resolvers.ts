import { Resolver, Query, Args } from "@nestjs/graphql"
import { FindManyPostsInput, FindOnePostInput } from "./shared"
import PostsService from "./post.service"
import { PostMySqlEntity } from "@database"

@Resolver(() => PostMySqlEntity)
export default class PostResolvers {
	constructor(
    private readonly postsService: PostsService,
	) {}
  @Query(() => PostMySqlEntity)
	async findOnePost(@Args("input") input: FindOnePostInput) {
		return this.postsService.findOnePost(input)
	}

  @Query(() => [PostMySqlEntity])
  async findManyPosts(@Args("input") input: FindManyPostsInput) {
  	return this.postsService.findManyPosts(input)
  }
}
