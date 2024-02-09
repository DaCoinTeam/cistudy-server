import { NestFactory } from "@nestjs/core"
import AppModule from "./app.module"
import appConfig from "./config/env/app.config"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { CourseResolvers, PostResolvers } from "@resolvers"
import { promises as fsPromises } from "fs"
import {
    GraphQLSchemaBuilderModule,
    GraphQLSchemaFactory,
} from "@nestjs/graphql"
import { printSchema } from "graphql"
import { join } from "path"
import { getEnvValue } from "@utils"

const generateSchema = async () => {
    const app = await NestFactory.create(GraphQLSchemaBuilderModule)
    await app.init()

    const gqlSchemaFactory = app.get(GraphQLSchemaFactory)
    const schema = await gqlSchemaFactory.create([
        CourseResolvers,
        PostResolvers,
    ])
    await fsPromises.writeFile(
        join(
            process.cwd(),
            `${getEnvValue({ development: "src", production: "dist" })}/schema.gql`,
        ),
        printSchema(schema),
    )
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors()

    const config = new DocumentBuilder()
        .setTitle("CiStudy Server")
        .setDescription("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhN2JiNTU4Zi04YTBjLTQzMGEtYTc0MS05ODZhNTBhZTE0NzMiLCJ0eXBlIjoiUmVmcmVzaCIsImlhdCI6MTcwNzQ2MjUxNSwiZXhwIjoxNzEwMDU0NTE1fQ.SsZFDKCHjn7i06L_j5WSkTEdGUu0tQ0txYyyl3l5oCc")
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
