import {
    AuthEmptyDataInput,
    AuthInput,
    Input,
    OptionsOnly,
    OrderStatus,
    ParamsOnly,
} from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"

@InputType()
export class FindManySelfCreatedCoursesInputOptions {
  @Field(() => Int, { nullable: true })
      take?: number
  @Field(() => Int, { nullable: true })
      skip?: number
}

@InputType()
export class FindManySelfCreatedCoursesInputData
implements OptionsOnly<FindManySelfCreatedCoursesInputOptions>
{
  @Field(() => FindManySelfCreatedCoursesInputOptions, { nullable: true })
      options?: FindManySelfCreatedCoursesInputOptions
}

export class FindManySelfCreatedCoursesInput
implements AuthInput<FindManySelfCreatedCoursesInputData>
{
    accountId: string
    data: FindManySelfCreatedCoursesInputData
}

export class FindManySelfCreatedCoursesMetadataInput
implements AuthEmptyDataInput
{
    accountId: string
}

@InputType()
export class FindManyEnrolledCoursesInputOptions {
  @Field(() => Int, { nullable: true })
      take?: number
  @Field(() => Int, { nullable: true })
      skip?: number
}

@InputType()
export class FindManyEnrolledCoursesInputData
implements OptionsOnly<FindManyEnrolledCoursesInputOptions>
{
  @Field(() => FindManyEnrolledCoursesInputOptions, { nullable: true })
      options?: FindManyEnrolledCoursesInputOptions
}

export class FindManyEnrolledCoursesInput
implements AuthInput<FindManyEnrolledCoursesInputData>
{
    accountId: string
    data: FindManyEnrolledCoursesInputData
}

export class GenerateReportInput implements AuthEmptyDataInput {
    accountId: string
}

@InputType()
export class FindManySubmittedReportsInputOptions {
  @Field(() => Int, { nullable: true })
      take?: number
  @Field(() => Int, { nullable: true })
      skip?: number
}

@InputType()
export class FindManyTransactionsInputOptions {
  @Field(() => Int, { nullable: true })
      take?: number
  @Field(() => Int, { nullable: true })
      skip?: number
}

@InputType()
export class FindManyTransactionsInputData
implements OptionsOnly<FindManyTransactionsInputOptions>
{
  @Field(() => FindManyTransactionsInputOptions, { nullable: true })
      options?: FindManyTransactionsInputOptions
}

export class FindManyTransactionsInput
implements AuthInput<FindManyTransactionsInputData>
{
    accountId: string
    data: FindManyTransactionsInputData
}

@InputType()
export class FindManyReceivedNotificationsInputOptions {
  @Field(() => Int, { nullable: true })
      take?: number
  @Field(() => Int, { nullable: true })
      skip?: number
}

@InputType()
export class FindManyReceivedNotificationsInputData
implements OptionsOnly<FindManyReceivedNotificationsInputOptions>
{
  @Field(() => FindManyReceivedNotificationsInputOptions, { nullable: true })
      options?: FindManyReceivedNotificationsInputOptions
}

export class FindManyReceivedNotificationsInput
implements AuthInput<FindManyReceivedNotificationsInputData>
{
    accountId: string
    data: FindManyReceivedNotificationsInputData
}

@InputType()
export class FindOneCertificateInputData {
  @Field(() => ID)
      certificateId: string
}

export class FindOneCertificateInput
implements Input<FindOneCertificateInputData>
{
    data: FindOneCertificateInputData
}

@InputType()
export class FindManyAccountOrdersInputOptions {
  @Field(() => Int, { nullable: true })
      take?: number
  @Field(() => Int, { nullable: true })
      skip?: number
  @Field(() => String, { nullable: true })
      orderStatus?: OrderStatus
}

@InputType()
export class FindManyAccountOrdersInputData
implements OptionsOnly<FindManyAccountOrdersInputOptions>
{
  @Field(() => FindManyAccountOrdersInputOptions, { nullable: true })
      options?: FindManyAccountOrdersInputOptions
}

export class FindManyAccountOrdersInput
implements AuthInput<FindManyAccountOrdersInputData>
{
    accountId: string
    data: FindManyAccountOrdersInputData
}

@InputType()
export class GetCourseStatisticParams {
  @Field(() => ID)
      courseId: string
}

@InputType()
export class GetCourseStatisticInputData
implements ParamsOnly<GetCourseStatisticParams>
{
    @Field(() => GetCourseStatisticParams, { nullable: true })
        params: GetCourseStatisticParams
}

export class GetCourseStatisticInput
implements AuthInput<GetCourseStatisticInputData>
{
    accountId: string
    data: GetCourseStatisticInputData
} 