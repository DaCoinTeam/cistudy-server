import { Output } from "@common"

export class SignUpOutput{
    data: {
        message: string
    }
}

export class VerifyRegistrationOutput implements Output {
    message: string

}