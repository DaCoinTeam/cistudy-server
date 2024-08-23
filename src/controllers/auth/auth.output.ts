import { Output } from "@common"

export class SignUpOutput {
    data: {
        message: string
    }
}

export class VerifyRegistrationOutput {
    data: {
        message: string
    }
}

export class ForgotPasswordOutput implements Output {
    message: string
}

