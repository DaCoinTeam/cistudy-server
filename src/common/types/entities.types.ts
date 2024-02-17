import { registerEnumType } from "@nestjs/graphql"

export enum UserKind {
  Local = "Local",
  Google = "Google",
  Facebook = "Facebook",
}

registerEnumType(UserKind, {
    name: "UserKind",
})

export enum UserRole {
  User = "User",
  Moderator = "Moderator",
  Administrator = "Administrator",
}

registerEnumType(UserRole, {
    name: "UserRole",
})

export enum VerifyStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

registerEnumType(VerifyStatus, {
    name: "VerifyStatus",
})

export enum ContentType {
  Text = "Text",
  Video = "Video",
  Code = "Code",
  Image = "Image",
  Label = "Label",
  Application = "Application",
}

registerEnumType(ContentType, {
    name: "ContentType",
})

export enum ProcessStatus {
  Pending = "Pending",
  Processing = "Processing",
  Completed = "Completed",
}

registerEnumType(ProcessStatus, {
    name: "ProcessStatus",
})

export enum VideoType {
  MP4 = "MP4",
  DASH = "DASH",
}

registerEnumType(VideoType, {
    name: "VideoType",
})
