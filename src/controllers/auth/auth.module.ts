import { Module } from "@nestjs/common"
import AuthController from "./auth.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
	SessionMySqlEntity,
	UserMySqlEntity,
	PostMySqlEntity,
	CourseMySqlEntity,
	EnrolledInfoMySqlEntity,
	SectionMySqlEntity,
	LectureMySqlEntity,
	ResourceMySqlEntity,
	PostContentMySqlEntity,
	PostCommentMySqlEntity,
	PostCommentContentMySqlEntity,
	PostReactMySqlEntity,
	PostCommentLikeMySqlEntity,
} from "@database"
import AuthService from "./auth.service"

@Module({
	imports: [
		TypeOrmModule.forFeature([
			SessionMySqlEntity,
			UserMySqlEntity,
			PostMySqlEntity,
			CourseMySqlEntity,
			EnrolledInfoMySqlEntity,
			SectionMySqlEntity,
			LectureMySqlEntity,
			ResourceMySqlEntity,
			PostContentMySqlEntity,
			PostCommentMySqlEntity,
			PostCommentContentMySqlEntity,
			PostReactMySqlEntity,
			PostCommentLikeMySqlEntity,
		]),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export default class AuthModule {}
