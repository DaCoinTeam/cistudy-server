import {
    AccountMySqlEntity,
    ConfigurationMySqlEntity,
    CourseConfigurationMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    LessonMySqlEntity,
    PostCommentLikeMySqlEntity,
    PostCommentMySqlEntity,
    PostLikeMySqlEntity,
    PostMySqlEntity,
    ResourceMySqlEntity,
    RoleMySqlEntity,
    SectionMySqlEntity,
    SessionMySqlEntity
} from "@database"
import { Global, Module } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import {
    AuthManagerService,
    Bento4Service,
    BlockchainService,
    ConfigurationService,
    FfmpegService,
    FirebaseService,
    MailerService,
    PaypalService,
    Sha256Service,
    ShellService,
    StorageService
} from "./services"
import { JwtStrategy } from "./strategies"
import { OpenApiService } from "./services/openapi.service"

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionMySqlEntity,
            AccountMySqlEntity,
            PostCommentMySqlEntity,
            PostMySqlEntity,
            CourseMySqlEntity,
            EnrolledInfoMySqlEntity,
            SectionMySqlEntity,
            LessonMySqlEntity,
            ResourceMySqlEntity,
            PostLikeMySqlEntity,
            PostCommentMySqlEntity,
            PostCommentLikeMySqlEntity,
            RoleMySqlEntity,
            ConfigurationMySqlEntity,
            CourseConfigurationMySqlEntity
        ])
    ],
    exports: [
        JwtService,
        AuthManagerService,
        Bento4Service,
        FfmpegService,
        FirebaseService,
        MailerService,
        Sha256Service,
        ShellService,
        StorageService,
        JwtStrategy,
        BlockchainService,
        PaypalService,
        OpenApiService,
        ConfigurationService
    ],
    providers: [
        JwtService,
        AuthManagerService,
        Bento4Service,
        FfmpegService,
        FirebaseService,
        MailerService,
        Sha256Service,
        ShellService,
        StorageService,
        JwtStrategy,
        BlockchainService,
        PaypalService,
        OpenApiService,
        ConfigurationService
    ], 
})
export class GlobalModule { }
