import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export const updatePostSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                postId: {
                    type: "string"
                },
                title: {
                    type: "string",
                },
                postContents: {
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
