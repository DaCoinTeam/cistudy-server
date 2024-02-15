import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export const createCourseSchema : SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                },
                description: {
                    type: "string",
                },
                price: {
                    type: "number"
                }
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

export const updateCourseSchema : SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                courseId: {
                    type: "string"
                },
                title: {
                    type: "string",
                },
                description: {
                    type: "string",
                },
                price: {
                    type: "number"
                },
                thumbnailIndex: {
                    type: "number",
                    example: "0"
                },
                previewVideoIndex: {
                    type: "number",
                    example: "1"
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

export const createLectureSchema : SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                title: {
                    type: "string",
                },
                sectionId: {
                    type: "string"
                }
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

export const createResourcesSchema : SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                lectureId: {
                    type: "string",
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