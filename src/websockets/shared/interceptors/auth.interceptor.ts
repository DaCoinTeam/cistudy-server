import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, Payload, getClientId, WsOutput } from "@common"
import { UserMySqlEntity } from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class AuthInterceptor<T extends object>
implements NestInterceptor<T, WsOutput<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService,
        @InjectRepository(UserMySqlEntity)
        private readonly userMySqlRepository: Repository<UserMySqlEntity>,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<WsOutput<T>>> {
        const client = context.switchToWs().getClient()

        const { userId, type } = client.user as Payload
        let { userRole } = client.user

        const headers = client.handshake?.headers
        const clientId = getClientId(headers)

        const refresh = type === AuthTokenType.Refresh
        if (refresh) {
            await this.authManagerService.validateSession(userId, clientId)
            const user = await this.userMySqlRepository.findOneBy({userId})
            userRole = user.userRole
        }
        return next.handle().pipe(
            mergeMap(async ({event, data}) => {
                data = await this.authManagerService.generateOutput<T>(
                    { userId, userRole, type },
                    data,
                    refresh,
                    clientId,
                )
                return { event, data } 
            }),
        )
    }
}
