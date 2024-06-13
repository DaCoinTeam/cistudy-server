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

export const createLessonSchema: SchemaObject = {
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

export const createResourcesSchema: SchemaObject = {
    type: "object",
    properties: {
        data: {
            type: "object",
            properties: {
                lessonId: {
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
                lessonId: {
                    type: "string",
                },
                timeLimit: {
                    type: "number"
                },
                quizQuestions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question: {
                                type: "string",
                            },
                            answers: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        content: {
                                            type: "string",
                                        },
                                        isCorrect: {
                                            type: "boolean",
                                        }
                                    }
                                }
                            },
                            questionMedias: {
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
                        }
                    }
                }
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
                    type: "number"
                },
                newQuestions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question: {
                                type: "string",
                            },
                            answers: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        content: {
                                            type: "string",
                                        },
                                        isCorrect: {
                                            type: "boolean",
                                        }
                                    }
                                }
                            },
                            questionMedias: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        mediaIndex: {
                                            type: "number",
                                        },
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
                            questionMedias: {
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
                            quizAnswerIdsToUpdate: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        quizQuestionAnswerId: {
                                            type: "string",
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
                                    properties: {
                                        quizQuestionAnswerId: {
                                            type: "string",
                                        }
                                    }
                                }
                            },
                            mediaIdsToDelete: {
                                type: "array",
                                items: {
                                    type: "string",
                                    properties: {
                                        mediaId: {
                                            type: "string",
                                        }
                                    }
                                }
                            },
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

        files: {
            type: "array",
            items: {
                type: "string",
                format: "binary",
            },
        },
    },
}