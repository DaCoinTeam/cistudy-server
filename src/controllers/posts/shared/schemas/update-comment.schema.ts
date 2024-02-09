import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export const updateCommentSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                postCommentId: {
                    type: "string"
                },
                postCommentContents: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            content: {
                                type: "string",
                            },
                            contentType: {
                                type: "string",
                            },
                        },
                    },
                },
            },
        },
        files: {
            type: "array",
            items: {
                type: "string",
                format: "binary",
            },
        },
    },
}
