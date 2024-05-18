import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { appConfig }  from "@config"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { CoursesResolver, PostsResolver, ProfileResolver, UsersResolver, AuthResolver, TransactionsResolver } from "@resolvers"
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
        UsersResolver,
        ProfileResolver,
        TransactionsResolver
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
            key: `-----BEGIN PRIVATE KEY-----
            MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcmNZbQEm9xEG1
            BHn+fB8QcoW5j6R2cEteZUpKPCUhEbjVwU6MhL4BnySSGdOiaiCjN4TgCcfVumz/
            Ny9hNeJl/hAlmJ0JIBqaMT7kpYKkSmwE5p6TsQaPPspyDxcreGpTzeWmZ1sv6aLb
            PJg9fRaDc/MNtpbOGNP8U+vCrVBvTJaMiufPuBGwb6PVRqQ+Vm6ScbcWh4cONw/A
            phzaafU9cex2clJ806CInd4KR8qar7Gdxs0MaEQNcnIdiLbSTuwp2cck2XlqV9uH
            1MuDG3i6U+RDUtvKjBP/wFAj6LjHgNhxXhumAkNcdp6Kz+7AWGmGk5qNvZLv4htn
            HKRj29K7AgMBAAECggEBAK99RsnBEujMQBlpPkOdKnlDIe7EvukZ3Ftz6O21ezQb
            jRc/eOWAlEdl+wnfUeVa2Cv/9szj+v2kGSHPHPoQi9LnkqDWD9c6mu8fThFHOe7I
            5bXgYTbNFZLPOO4T4zLJ0Ixqt87xWjF7g/s08Ue5Qze//hNitgWu6rVJbbypc9uV
            b+15aqY3ZKqVHZk+tTp53ZcTHGF5ZvqsaLvvU2dDtTp/iZMv35+ElsMjihTttbql
            uvBH4bwEWwGWCHc3HerwYXaTpFVJf1YJhKgicXtnPPxw0WDK/CoOLieKPij7pjnp
            Hi6O8Ic/AzKL7065tBG5PUrq6PPYT3Dn7kwJv1DhukECgYEA8J+LLNpfbnMeTZCA
            SLfQ9zkZyuPHXMO0V5nb8VZ7XBg0gKBMg7e6i5nbQNA5iKKG7FMNGZOiamrQ1QRy
            h2c1M5zHnyyg3oyfQISYC16XSUrez2pa0GJpLVm4zIxWDTvp/BWkQzLb4uDu2AG3
            YV5leaelmbKhHOviNp++SpZo/r0CgYEA6rGtPN2ICWbokkKX2vM4AIRGbNz4S/mS
            xNZ/TU4Am0aHDgScbNfaocx+v6y4c/kz8EaqXwkussGenkAslwirHuy8i+/7icfg
            Tmelbcd0PCUHasnS8CjhiO7lMWYHk6yCv3zazreArIZMQR8Hpbh1/HW7WZmLJCVu
            ed+Q492MitcCgYBCz7ngIV5AF7zBQq8sAcYG7xbnS+muKzTm4fS9BQtJnfruABRe
            umQUoQrM60QeWSpncgQAJwsAy1ni29JFIHYYN58B5m1gfeE2E9r3xTLyidRl+Rzw
            IXMcwX3bZdf64rjsYsHyWqvNSjFnTsqxQXmhltgXXg74LdLo4d//a9YJbQKBgAxb
            vM6Wr8Im/BovjYWHByznyjmTTTPa+YKJ9PwiHmAOz6/KSF5m42lftlDrjG728Wg2
            oGQOvLnG/k5A/NgbKb+gIbGQuoMf1kzqokhsl09Pd9uEsynYTUADrGf0gnOhQuVI
            ctEt0oXDMKLBOorccsIPhQUL08rcebvLLPsCwJLTAoGAbbeuYCPZEhS1+6y7MENq
            0apNBAorftaTw8WVFIHW6Tr2wd6E/nNv4nSFLqy6W45d7gbJf8wGw2049LjkA1qY
            tYul85ntT07MrP3PPXiCXINiJgxV/hNX3TjNLYTS8wF0usqP3akvoM9OZ2R+GZao
            q6ac3KGFkz4Zo3MueaGHZKE=
            -----END PRIVATE KEY-----
            `,
            cert: `-----BEGIN CERTIFICATE-----
            MIIE9DCCA9ygAwIBAgISAyYIGc50xG7cGkCUl9wdoIsdMA0GCSqGSIb3DQEBCwUA
            MDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQD
            EwJSMzAeFw0yNDA1MTcwNTU4MzBaFw0yNDA4MTUwNTU4MjlaMB8xHTAbBgNVBAMT
            FHdzc3NjaXR5LmxvbmdwaHUuZGV2MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
            CgKCAQEA3JjWW0BJvcRBtQR5/nwfEHKFuY+kdnBLXmVKSjwlIRG41cFOjIS+AZ8k
            khnTomogozeE4AnH1bps/zcvYTXiZf4QJZidCSAamjE+5KWCpEpsBOaek7EGjz7K
            cg8XK3hqU83lpmdbL+mi2zyYPX0Wg3PzDbaWzhjT/FPrwq1Qb0yWjIrnz7gRsG+j
            1UakPlZuknG3FoeHDjcPwKYc2mn1PXHsdnJSfNOgiJ3eCkfKmq+xncbNDGhEDXJy
            HYi20k7sKdnHJNl5alfbh9TLgxt4ulPkQ1LbyowT/8BQI+i4x4DYcV4bpgJDXHae
            is/uwFhphpOajb2S7+IbZxykY9vSuwIDAQABo4ICFTCCAhEwDgYDVR0PAQH/BAQD
            AgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMBAf8EAjAA
            MB0GA1UdDgQWBBQPc+Bk1lK2M8B+5Lf+hL7QDnn+QTAfBgNVHSMEGDAWgBQULrMX
            t1hWy65QCUDmH6+dixTCxjBVBggrBgEFBQcBAQRJMEcwIQYIKwYBBQUHMAGGFWh0
            dHA6Ly9yMy5vLmxlbmNyLm9yZzAiBggrBgEFBQcwAoYWaHR0cDovL3IzLmkubGVu
            Y3Iub3JnLzAfBgNVHREEGDAWghR3c3NzY2l0eS5sb25ncGh1LmRldjATBgNVHSAE
            DDAKMAgGBmeBDAECATCCAQMGCisGAQQB1nkCBAIEgfQEgfEA7wB1AEiw42vapkc0
            D+VqAvqdMOscUgHLVt0sgdm7v6s52IRzAAABj4VYVkYAAAQDAEYwRAIgNuXcO2Eo
            Re73pfg2QaB+1SPZPLazkj5+Zushf4nnCYoCIAZqwsMGvKdW36Oa1zVGF+eH0MH+
            JjAc4APATElLsGubAHYA3+FW66oFr7WcD4ZxjajAMk6uVtlup/WlagHRwTu+UlwA
            AAGPhVhXCAAABAMARzBFAiEAmDFiY4CzyIRCDHfZYMblJk2DHBq9i/uTn/satHwT
            SdoCIFCc3IgDonXkqC5FS3/ggHwapWuWJcQj549MsB3suzF8MA0GCSqGSIb3DQEB
            CwUAA4IBAQCDyT3Q4lVDTOTRelmV+Pm9ZF4YgFEF+f5//g1q16vsFfx9h9DnUCJY
            sckPH3MZ5z6ADL77ztz7kiDwh79mFYApr3USPJw+s25AlwURIb6MqGl9RH0aKqMk
            Bs2Y+/XKQGzxhvxJSo37GqyGXX342H9f5gaMJg05t/RN3CWGAPkyM+ahTOMQgs0+
            92fiNM0XZriCgn3ILa31a6aFhd/16yCDagMwbd7meRIS3btuf6sfl+Jod4ptkyG5
            3mtZJQV0l/05G+Wq4Dk/TBSAAQLm8I0MeAUtaGLK0bhLaPVpUwXa7ny1N5s+0lO9
            QT01shi+0Le2kmn3wo2DRNhJpW8NsuSm
            -----END CERTIFICATE-----
            `
        }
    })

    const app = await NestFactory.create(AppModule, {
        httpsOptions
    })

    app.enableCors()

    const redisIoAdapter = new RedisIoAdapter(app)
    await redisIoAdapter.connectToRedis()
    app.useWebSocketAdapter(redisIoAdapter)

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
