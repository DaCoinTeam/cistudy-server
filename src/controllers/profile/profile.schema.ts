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
                birthdate: {
                    type: "string",
                    format: "date"
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

export const addJobSchema : SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                companyName: {
                    type: "string"
                },
                role: {
                    type: "string"
                },
                companyThumbnailIndex: {
                    type: "number"
                },
                startDate: {
                    type: "string",
                    format: "date"
                },
                endDate: {
                    type: "string",
                    format: "date",
                    nullable: true
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

export const updateJobSchema : SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                accountJobId : {
                    type: "string"
                },
                companyName: {
                    type: "string",
                },
                role: {
                    type: "string"
                },
                companyThumbnailIndex: {
                    type: "number"
                },
                startDate: {
                    type: "string",
                    format: "date"
                },
                endDate: {
                    type: "string",
                    format: "date",
                    nullable: true
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

export const addQualificationSchema : SchemaObject = {
    type: "object",
    properties: {
        files: {
            type: "array",
            items: {
                type: "string",
                format: "binary"
            },
        },
    }
}