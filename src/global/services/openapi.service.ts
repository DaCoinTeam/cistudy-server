import { keysConfig } from "@config"
import { Injectable, OnModuleInit } from "@nestjs/common"
import OpenAI from "openai"

@Injectable()
export class OpenApiService implements OnModuleInit {
    client: OpenAI

    async onModuleInit() {
        this.client = new OpenAI({
            apiKey: keysConfig().openapi,
        })
    }

    async isSatisfyCommunityStandard(message: string): Promise<{
    result: boolean
    reason?: string
  }> {
        const content = `
            ${message}
         “Please evaluate whether the sentence meets the following criteria and respond with format "{yes or no}.{reason}":
Does it include violent content?
Does it include spam or scam content?
Does it have hate speech or personal attacks?
Does it feature inappropriate or offensive material?
Does it contain harmful or dangerous content?
Does it involve sexual content?
”
        `
        const chatCompletion = await this.client.chat.completions.create({
            messages: [{ role: "user", content }],
            model: "gpt-3.5-turbo",
        })

        return {
            result:
        chatCompletion.choices.at(0).message.content.split(".").at(0).toLocaleLowerCase().trim() === "yes",
            reason: chatCompletion.choices
                .at(0)
                .message.content.split(".")
                .at(1)
                .trim(),
        }
    }
}
