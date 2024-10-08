import { Module, ValidationPipe } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { appConfig, blockchainConfig, databaseConfig, jwtConfig, keysConfig, servicesConfig } from "./config"
import { ConfigModule } from "@nestjs/config"
import { GlobalModule } from "@global"
import { ControllersModule } from "@controllers"
import { ResolversModule } from "./resolvers"
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { BullModule } from "@nestjs/bull"
import { WorkersModule } from "./workers/workers.module"
import { APP_PIPE } from "@nestjs/core"
import { ScheduleModule } from "@nestjs/schedule"
import { SchedulersModule } from "@schedulers"
import { MongooseModule } from "@nestjs/mongoose"
// import { WebsocketsModule } from "@websockets"
import * as redisStore from "cache-manager-redis-store"
import { CacheModule } from "@nestjs/cache-manager"
import { WebsocketsModule } from "@websockets"


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            load: [databaseConfig, jwtConfig, servicesConfig, appConfig, blockchainConfig, keysConfig],
        }),

        BullModule.forRoot({
            redis: {
                host: databaseConfig().redis.host,
                port: databaseConfig().redis.port,
            },
        }),

        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: databaseConfig().redis.host,
            port: databaseConfig().redis.port,
            ttl: 24 * 60 * 60,
        }),

        ScheduleModule.forRoot(),

        MongooseModule.forRoot(`mongodb://${databaseConfig().mongo.host}:${databaseConfig().mongo.port}`, {
            user: databaseConfig().mongo.user,
            pass: databaseConfig().mongo.pass,
            dbName: databaseConfig().mongo.dbName,
        }),

        TypeOrmModule.forRoot({
            type: "mysql",
            host: databaseConfig().mysql.host,
            port: databaseConfig().mysql.port,
            username: databaseConfig().mysql.username,
            password: databaseConfig().mysql.password,
            database: databaseConfig().mysql.schema,
            autoLoadEntities: true,
            synchronize: true,
            poolSize: 1000000,    
            timezone: "Z",
            driver: require("mysql2"),
            connectorPackage: "mysql2", 
        }),

        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            typePaths: ["./**/*.gql"],
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            introspection: true,
        }),

        WebsocketsModule,
        SchedulersModule,
        ResolversModule,
        GlobalModule,
        ControllersModule,
        WorkersModule,
    ],

    controllers: [],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule { }
