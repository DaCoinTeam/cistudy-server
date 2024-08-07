import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface"

export const updateCourseSchema: SchemaObject = {
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
                categoryIds:{
                    type: "array",
                    items:{
                        type: "string"
                    }
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

export const updateLessonSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                lessonId: {
                    type: "string",
                },
                title: {
                    type: "string",
                },
                description: {
                    type: "string"
                },
                thumbnailIndex: {
                    type: "number"
                },
                lessonVideoIndex: {
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

export const createCategorySchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                },
                imageIndex: {
                    type: "number"
                },
                categoryIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
                categoryParentIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
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
/*
export class UpdateQuizQuestionMediaInputData {
    @ApiProperty()
        mediaIndex : number
    @ApiProperty()
        mediaType: MediaType
}

export class UpdateQuizQuestionInputData {
    @ApiProperty()
        quizQuestionId: string
    @ApiProperty()
        question: string
    @ApiProperty()
        point: number
    @ApiProperty()
        position: number
    @ApiProperty()
        questionMedia : UpdateQuizQuestionMediaInputData
    @ApiProperty()
        deleteMediaId? : string
}
*/
export const updateQuizQuestionSchema : SchemaObject ={
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                quizQuestionId: {
                    type: "string",
                },
                question: {
                    type: "string",
                },
                point: {
                    type: "number",
                },
                position: {
                    type: "number",
                },
                deleteMediaId: {
                    type: "string",
                },
                questionMedia: {
                    type: "object",
                    properties: {
                        mediaIndex: {
                            type: "number",
                        },
                        mediaType: {
                            type: "string",
                        },
                    }
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
export const updateCategorySchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                categoryId: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
                imageIndex: {
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

export const UpdateResourceSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                resourceId: {
                    type: "string",
                },
                description: {
                    type: "string",
                },
                resourceAttachments: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            fileIndex: {
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
                format: "binary"
            },
        },
    }
}

export const createTopicSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                },
                subcategoryIds: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            }
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

export const createQuizSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                sectionId: {
                    type: "string",
                },
                title: {
                    type: "string",
                },
                timeLimit: {
                    type: "number",
                    minimum: 5
                },
                quizQuestions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question: {
                                type: "string",
                            },
                            position:{
                                type: "number",
                            },
                            point:{
                                type: "number",
                                minimum: 10
                            },
                            answers: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        position:{
                                            type: "number",
                                        },
                                        content: {
                                            type: "string",
                                        },
                                        isCorrect: {
                                            type: "boolean",
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            },
        }
    },
}

export const updateQuizSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                quizId: {
                    type: "string"
                },
                timeLimit: {
                    type: "number",
                    minimum: 5
                },
                newQuestions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question: {
                                type: "string",
                            },
                            position:{
                                type: "number",
                            },
                            point: {
                                type: "number",
                                minimum: 10,
                            },
                            answers: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        position:{
                                            type: "number",
                                        },
                                        content: {
                                            type: "string",
                                        },
                                        isCorrect: {
                                            type: "boolean",
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                quizQuestionIdsToUpdate: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            quizQuestionId: {
                                type: "string"
                            },
                            question: {
                                type: "string",
                            },
                            position:{
                                type: "number",
                            },
                            point:{
                                type: "number",
                                minimum: 10
                            },
                            quizAnswerIdsToUpdate: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        quizQuestionAnswerId: {
                                            type: "string",
                                        },
                                        position:{
                                            type: "number",
                                        },
                                        content: {
                                            type: "string",
                                        },
                                        isCorrect: {
                                            type: "boolean",
                                        }
                                    }
                                }
                            },
                            newQuizQuestionAnswer: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        position:{
                                            type: "number",
                                        },
                                        content: {
                                            type: "string",
                                        },
                                        isCorrect: {
                                            type: "boolean",
                                        }
                                    }
                                }
                            },
                            quizAnswerIdsToDelete: {
                                type: "array",
                                items: {
                                    type: "string",
                                }
                            }
                        }
                    }
                },
                quizQuestionIdsToDelete: {
                    type: "array",
                    items: {
                        type: "string",
                    }
                }
            },
        },
    },
}
