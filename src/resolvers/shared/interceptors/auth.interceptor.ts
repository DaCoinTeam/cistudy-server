import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, Payload, Output, getClientId } from "@common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { InjectRepository } from "@nestjs/typeorm"
import { UserMySqlEntity } from "@database"
import { Repository} from "typeorm"

@Injectable()
export class AuthInterceptor<T extends object>
implements NestInterceptor<T, Output<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService,
        @InjectRepository(UserMySqlEntity)
        private readonly userMySqlRepository: Repository<UserMySqlEntity>
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<Output<T>>> {
        const gqlContext = GqlExecutionContext.create(context).getContext()
        const request = gqlContext.req

        const { userId, type } = request.user as Payload
        let { userRole } = request.user as Payload

        const clientId = getClientId(request.headers)
        const refresh = type === AuthTokenType.Refresh

        if (refresh) {
            await this.authManagerService.validateSession(userId, clientId)
            const user = await this.userMySqlRepository.findOneBy({userId})
            userRole = user.userRole
        }

        return next.handle().pipe(
            mergeMap(async (data) => {
                return await this.authManagerService.generateOutput<T>(
                    { userId, userRole, type },
                    data,
                    refresh,
                    clientId,
                )
            }),
        )
    }
}
