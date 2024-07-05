import { registerEnumType } from "@nestjs/graphql"

export enum AccountKind {
  Local = "local",
  Google = "google",
  Facebook = "facebook",
}

registerEnumType(AccountKind, {
    name: "AccountKind",
})

export enum SystemRoles {
  User = "user",
  Instructor = "instructor",
  Moderator = "moderator",
  Administrator = "administrator",
}

registerEnumType(SystemRoles, {
    name: "SystemRoles",
})

export enum VerifyStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export enum OrderStatus {
  Pending = "pending",
  Completed = "completed",
  Canceled = "canceled",
}

registerEnumType(OrderStatus, {
    name: "OrderStatus"
})

registerEnumType(VerifyStatus, {
    name: "VerifyStatus",
})

export enum MediaType {
  Image = "image",
  Video = "video",
}

registerEnumType(MediaType, {
    name: "MediaType",
})


export enum ProcessStatus {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
}

registerEnumType(ProcessStatus, {
    name: "ProcessStatus",
})

export enum VideoType {
  MP4 = "mp4",
  DASH = "dash",
}

registerEnumType(VideoType, {
    name: "VideoType",
})

export enum QuizAttemptStatus {
  Started = "started",
  Ended = "ended"
}

registerEnumType(QuizAttemptStatus, {
    name: "QuizAttemptStatus",
})

export enum CourseApproveStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

registerEnumType(CourseApproveStatus, {
    name: "CourseApproveStatus",
})

export enum ReportProcessStatus {
  Processing = "processing",
  Approved = "approved",
  Rejected = "rejected"
}

registerEnumType(ReportProcessStatus,{
    name: "ReportProcessStatus"
})

export enum ReportType {
  Account = "account",
  Course = "course",
  Post = "post",
  PostComment = "postComment"
}