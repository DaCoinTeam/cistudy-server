import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export const updateProfileSchema : SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                username: {
                    type: "string"
                },
                avatarIndex: {
                    type: "number"
                },
                coverPhotoIndex: {
                    type: "number"
                },
            },
        },
        files: {
            type: "array",
            items: {
                type: "string",
                format: "binary"
            },
        },
    }
}