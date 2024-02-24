import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export const createCommentSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                postId: {
                    type: "string",
                },
                html: {
                    type: "string"
                },
                postCommentMedias: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            mediaIndex: {
                                type: "number",
                            },
                        }
                    }
                            
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

export const createPostSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                },
                courseId: {
                    type: "string",
                },
                html: {
                    type: "string"
                },
                postMedias: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            mediaIndex: {
                                type: "number",
                            },
                        }
                    }
                            
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