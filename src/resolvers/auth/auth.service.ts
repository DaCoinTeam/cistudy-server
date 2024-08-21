import { AccountKind, CourseVerifyStatus, SystemRoles } from "@common"
import { AccountMySqlEntity, AccountReviewMySqlEntity, CourseMySqlEntity, CourseRating, CourseReviewMySqlEntity, EnrolledInfoMySqlEntity, LessonMySqlEntity, PostMySqlEntity, QuizMySqlEntity, ResourceMySqlEntity, RoleMySqlEntity } from "@database"
import { FirebaseService, Sha256Service } from "@global"
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import {
    InitInput,
    SignInInput,
    VerifyGoogleAccessTokenInput,
} from "./auth.input"
import { InitLandingPageOutputOthers } from "./auth.output"

@Injectable()
export class AuthService {
    constructor(
        private readonly sha256Service: Sha256Service,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(RoleMySqlEntity)
        private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(CourseReviewMySqlEntity)
        private readonly courseReviewMySqlRepository: Repository<CourseReviewMySqlEntity>,
        @InjectRepository(AccountReviewMySqlEntity)
        private readonly accountReviewMySqlRepository: Repository<AccountReviewMySqlEntity>,
        @InjectRepository(PostMySqlEntity)
        private readonly postMySqlRepository: Repository<PostMySqlEntity>,
        @InjectRepository(QuizMySqlEntity)
        private readonly quizMySqlRepository: Repository<QuizMySqlEntity>,
        @InjectRepository(ResourceMySqlEntity)
        private readonly resourceMySqlRepository: Repository<ResourceMySqlEntity>,
        @InjectRepository(LessonMySqlEntity)
        private readonly lessonMySqlRepository: Repository<LessonMySqlEntity>,
        @InjectRepository(EnrolledInfoMySqlEntity)
        private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
        private readonly firebaseService: FirebaseService,
    ) { }

    async init(input: InitInput): Promise<AccountMySqlEntity> {
        const account = await this.accountMySqlRepository.findOne({
            where: {
                accountId: input.accountId,
            },
            relations: {
                cart: {
                    cartCourses: {
                        course: {
                            creator: true,
                            sections: true
                        }
                    }
                },
                roles: true
            }
        })

        const promises : Array<Promise<void>> = []
        for (const cartCourse of (account.cart?.cartCourses ?? [])) {
            const promise = async () => {
                const numberOfEnrollments =
          await this.enrolledInfoMySqlRepository.findBy({
              courseId: cartCourse.course.courseId,
          })
                const numberOfQuizzes = await this.quizMySqlRepository.count({
                    where: {
                        sectionContent: {
                            section: {
                                course: {
                                    courseId: cartCourse.course.courseId,
                                },
                            },
                        },
                    },
                })

                const numberOfResources = await this.resourceMySqlRepository.count({
                    where: {
                        sectionContent: {
                            section: {
                                course: {
                                    courseId: cartCourse.course.courseId,
                                },
                            },
                        },
                    },
                })

                const numberOfLessons = await this.lessonMySqlRepository.count({
                    where: {
                        sectionContent: {
                            section: {
                                course: {
                                    courseId: cartCourse.course.courseId,
                                },
                            },
                        },
                    },
                })
                cartCourse.course.numberOfEnrollments = numberOfEnrollments.length
                cartCourse.course.numberOfResources = numberOfResources
                cartCourse.course.numberOfQuizzes = numberOfQuizzes
                cartCourse.course.numberOfLessons = numberOfLessons

            }
            promises.push(promise())
        }

        await Promise.all(promises)
        return account
    }

    async initLandingPage(): Promise<InitLandingPageOutputOthers> {

        const totalNumberOfPosts = await this.postMySqlRepository.count()
    
        const totalNumberOfVerifiedAccounts = await this.accountMySqlRepository.findBy({verified: true})

        const totalInstructorAccounts = await this.accountMySqlRepository.find({
            where:{
                roles:{
                    name: SystemRoles.Instructor
                }
            }
        })

        const instructorReviews = await this.accountReviewMySqlRepository.find({
            where: {
                reviewedAccountId: In(totalInstructorAccounts.map(account => account.accountId)),
            },
        })

        totalInstructorAccounts.forEach(instructor => {
            const reviews = instructorReviews.filter(review => review.reviewedAccountId === instructor.accountId)
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
            const overallAccountRating = reviews.length ? totalRating / reviews.length : 0
            const ratingCounts = [1, 2, 3, 4, 5].map(star =>
                reviews.filter(review => review.rating === star).length
            )
                
            instructor.accountRatings = {
                overallAccountRating,
                totalNumberOfRatings: reviews.length,
                numberOf1StarRatings: ratingCounts[0],
                numberOf2StarRatings: ratingCounts[1],
                numberOf3StarRatings: ratingCounts[2],
                numberOf4StarRatings: ratingCounts[3],
                numberOf5StarRatings: ratingCounts[4],
            }
        })
    
        const highRatedInstructors = totalInstructorAccounts
            .filter(account => account.accountRatings.overallAccountRating >= 4)
            .sort((a, b) => b.accountRatings.overallAccountRating - a.accountRatings.overallAccountRating)
            .slice(0, 5)
    
        const totalNumberOfAvailableCourses = await this.courseMySqlRepository.find({
            where: {
                isDeleted: false,
                verifyStatus: CourseVerifyStatus.Approved
            },
            relations:{
                enrolledInfos: true,
                creator : true,
                courseTargets: true
            }
        })
        const promises: Array<Promise<void>> = []
        for(const course of totalNumberOfAvailableCourses) {
            const promise = async () => {
                const courseReviews = await this.courseReviewMySqlRepository.find({
                    where: {
                        courseId: course.courseId,
                    }
                })
                const countWithNumStars = (numStars: number) => {
                    let count = 0
                    for (const { rating } of courseReviews) {
                        if (rating === numStars) {
                            count++
                        }
                    }
    
                    return count
                }
    
                const numberOf1StarRatings = countWithNumStars(1)
                const numberOf2StarRatings = countWithNumStars(2)
                const numberOf3StarRatings = countWithNumStars(3)
                const numberOf4StarRatings = countWithNumStars(4)
                const numberOf5StarRatings = countWithNumStars(5)
                const totalNumberOfRatings = courseReviews.length
    
                const totalNumStars = () => {
                    let total = 0
                    for (let index = 1; index <= 5; index++) {
                        total += countWithNumStars(index) * index
                    }
                    return total
                }
    
                const overallCourseRating = totalNumberOfRatings > 0 ?  totalNumStars() / totalNumberOfRatings : 0
    
                const courseRatings: CourseRating = {
                    numberOf1StarRatings,
                    numberOf2StarRatings,
                    numberOf3StarRatings,
                    numberOf4StarRatings,
                    numberOf5StarRatings,
                    overallCourseRating,
                    totalNumberOfRatings
                }
    
                course.courseRatings = courseRatings
                course.numberOfEnrollments = course.enrolledInfos.length
    
                const numberOfQuizzes = await this.quizMySqlRepository.count({
                    where: {
                        sectionContent: {
                            section: {
                                course: {
                                    courseId: course.courseId,
                                },
                            },
                        },
                    },
                })
    
                const numberOfResources = await this.resourceMySqlRepository.count({
                    where: {
                        sectionContent: {
                            section: {
                                course: {
                                    courseId: course.courseId,
                                },
                            },
                        },
                    },
                })
    
                const numberOfLessons = await this.lessonMySqlRepository.count({
                    where: {
                        sectionContent: {
                            section: {
                                course: {
                                    courseId: course.courseId,
                                },
                            },
                        },
                    },
                })
                course.numberOfResources = numberOfResources
                course.numberOfQuizzes = numberOfQuizzes
                course.numberOfLessons = numberOfLessons
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        const highRatedCourses = totalNumberOfAvailableCourses
            .filter(course => course.courseRatings.overallCourseRating >= 4)
            .sort((a, b) => b.courseRatings.overallCourseRating - a.courseRatings.overallCourseRating)
            .slice(0, 10)

        const mostEnrolledCourses = totalNumberOfAvailableCourses
            .filter((course) => course.numberOfEnrollments > 0)
            .sort((a, b) => b.enrolledInfos.length - a.enrolledInfos.length)
            .slice(0, 10)

        const recentlyAddedCourses = totalNumberOfAvailableCourses.sort((prev, next) => new Date(next.createdAt).getTime() - new Date(prev.createdAt).getTime())

    
        return {
            totalNumberOfVerifiedAccounts: totalNumberOfVerifiedAccounts.length,
            totalNumberOfAvailableCourses: totalNumberOfAvailableCourses.length,
            totalNumberOfPosts: totalNumberOfPosts,
            mostEnrolledCourses,
            highRatedCourses,
            highRatedInstructors,
            recentlyAddedCourses: recentlyAddedCourses.slice(0, 5)
        }
    }
    

    async signIn(input: SignInInput): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params } = data
        const { email, password } = params

        const found = await this.accountMySqlRepository.findOneBy({
            email,
        })
        if (!found) throw new NotFoundException("Account not found.")
        if (!this.sha256Service.verifyHash(password, found.password))
            throw new UnauthorizedException("Invalid credentials.")
        if (found.verified === false) {
            throw new UnauthorizedException("Your account is not verified, please check the email again")
        }
        return found
    }

    async verifyGoogleAccessToken(
        input: VerifyGoogleAccessTokenInput
    ): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params } = data
        const { token } = params

        const decoded = await this.firebaseService.verifyGoogleAccessToken(token)
        if (!decoded)
            throw new UnauthorizedException("Invalid Google access token.")
        let found = await this.accountMySqlRepository.findOneBy({
            externalId: decoded.uid,
        })

        if (!found) {
            found = await this.accountMySqlRepository.save({
                externalId: decoded.uid,
                email: decoded.email,
                username: decoded.email.split("@")[0],
                phoneNumber: decoded.phone_number,
                avatarUrl: decoded.picture,
                kind: AccountKind.Google,
                verified: true,
            })
            await this.roleMySqlRepository.save({
                accountId: found.accountId,
                name: SystemRoles.User
            })
        }
        return found
    }
}
