import { CoursesController } from '../courses/courses.controller';
import { CoursesService } from '../courses/courses.service';
import {
    CategoryMySqlEntity,
    CourseMySqlEntity,
    CourseReviewMySqlEntity,
    CourseSubcategoryMySqlEntity,
    CourseTargetMySqlEntity,
    CourseTopicMySqlEntity,
    LectureMySqlEntity,
    ResourceMySqlEntity,
    SectionMySqlEntity,
    SubcategoyMySqlEntity,
    TopicMySqlEntity,
    TransactionMongoEntity,
} from "@database"
import { StorageService } from "@global"
import { ProcessMpegDashProducer } from "@workers"
import { Repository, DataSource } from "typeorm"
import { EnrolledInfoEntity } from "../../database/mysql/enrolled-info.entity"
import { CreateCourseOutput } from '../courses/courses.output';

describe('CourseController', () => {
    let CourseController: CoursesController;
    let CourseService: CoursesService;
    
    let courseMySqlRepository: Repository<CourseMySqlEntity>;
    let sectionMySqlRepository: Repository<SectionMySqlEntity>;
    let lectureMySqlRepository: Repository<LectureMySqlEntity>;
    let courseTargetMySqlRepository: Repository<CourseTargetMySqlEntity>;
    let resourceMySqlRepository: Repository<ResourceMySqlEntity>;
    let enrolledInfoMySqlRepository: Repository<EnrolledInfoEntity>;
    let courseSubcategoryMySqlRepository: Repository<CourseSubcategoryMySqlEntity>;
    let courseTopicMySqlRepository: Repository<CourseTopicMySqlEntity>;
    let categoryMySqlRepository: Repository<CategoryMySqlEntity>;
    let subcategoryMySqlRepository: Repository<SubcategoyMySqlEntity>;
    let topicMySqlRepository: Repository<TopicMySqlEntity>;
    let courseReviewMySqlRepository: Repository<CourseReviewMySqlEntity>;
    let storageService: StorageService;
    let mpegDashProcessorProducer: ProcessMpegDashProducer;
    let dataSource: DataSource
    beforeEach(() => {
        CourseService = new CoursesService(
            courseMySqlRepository,
            sectionMySqlRepository,
            lectureMySqlRepository,
            courseTargetMySqlRepository,
            resourceMySqlRepository,
            enrolledInfoMySqlRepository,
            courseSubcategoryMySqlRepository,
            courseTopicMySqlRepository,
            categoryMySqlRepository,
            subcategoryMySqlRepository,
            topicMySqlRepository,
            courseReviewMySqlRepository,
            storageService,
            mpegDashProcessorProducer,
            dataSource
        );
        CourseController = new CoursesController(CourseService);
    });

    describe('create-course', () => {
        it('should return a valid uuid of a course id', async () => {
            const createCourseOutput: CreateCourseOutput = {message:"test",others: {courseId: '123e4567-e89b-12d3-a456-426614174000'} };
            jest.spyOn(CourseService, 'createCourse').mockResolvedValue(createCourseOutput);

            const result = (await CourseController.createCourse("67b244ee-c6d4-40f7-a16a-1e2d79f8f75d")).others.courseId;
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

            expect(result).toMatch(uuidRegex);
        });
    });
});