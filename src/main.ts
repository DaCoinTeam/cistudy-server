import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { appConfig, keysConfig } from "@config"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import {
    CoursesResolver,
    PostsResolver,
    ProfileResolver,
    AccountsResolver,
    AuthResolver,
    CartResolver,
} from "@resolvers"
import { promises as fsPromises } from "fs"
import {
    GraphQLSchemaBuilderModule,
    GraphQLSchemaFactory,
} from "@nestjs/graphql"
import { printSchema } from "graphql"
import { join } from "path"
import { getEnvValue } from "@common"
import { RedisIoAdapter } from "@adapters"
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface"

const generateSchema = async () => {
    const app = await NestFactory.create(GraphQLSchemaBuilderModule)
    await app.init()

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory)
    const schema = await gqlSchemaFactory.create([
        AuthResolver,
        CoursesResolver,   
        PostsResolver,
        AccountsResolver,
        ProfileResolver,
        CartResolver,
    ])
    await fsPromises.writeFile(
        join(
            process.cwd(),
            `${getEnvValue({ development: "src", production: "dist" })}/schema.gql`,
        ),
        printSchema(schema),
    )
}

const bootstrap = async () => {
    const httpsOptions: HttpsOptions = getEnvValue({
        production: {
            cert: keysConfig().ssl.cert,
            key: keysConfig().ssl.key,
        },
    })

    const app = await NestFactory.create(AppModule, {
        httpsOptions,
    })

    app.enableCors()

    const redisIoAdapter = new RedisIoAdapter(app)
    await redisIoAdapter.connectToRedis()
    app.useWebSocketAdapter(redisIoAdapter)

    const config = new DocumentBuilder()
        .setTitle("CiStudy Server")
        .setDescription(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJkYzI2MTg0Zi1lNjMxLTQzNzEtYThiZC1mY2I3NzJmZjVmNTIiLCJ0eXBlIjoiUmVmcmVzaCIsImlhdCI6MTcyMjM2MjQ3NiwiZXhwIjoxNzI0OTU0NDc2fQ.RKwwZBBfMBgjUc7iBZ0Yy_0NdDJGbr6eUzKgRA--MAA"
        )
        .setVersion("1.0")
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup("/", app, document, {
        swaggerOptions: { defaultModelsExpandDepth: -1 },
    })

    await app.listen(appConfig().port || 3001)
} 
 
generateSchema().then(() => bootstrap())
