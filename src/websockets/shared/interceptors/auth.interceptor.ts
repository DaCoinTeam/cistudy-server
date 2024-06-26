import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, Payload, getClientId, WsOutput } from "@common"
import { AccountMySqlEntity } from "@database"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class AuthInterceptor<T extends object>
implements NestInterceptor<T, WsOutput<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<WsOutput<T>>> {
        const client = context.switchToWs().getClient()

        const { accountId, type } = client.user as Payload
        let { accountRoles } = client.user

        const headers = client.handshake?.headers
        const clientId = getClientId(headers)

        const refresh = type === AuthTokenType.Refresh
        if (refresh) {
            await this.authManagerService.validateSession(accountId, clientId)
            const account = await this.accountMySqlRepository.findOneBy({accountId})
           // accountRole = account.accountRole
        }
        return next.handle().pipe(
            mergeMap(async ({event, data}) => {
                data = await this.authManagerService.generateOutput<T>(
                    { accountId, accountRoles, type },
                    data,
                    refresh,
                    clientId,
                )
                return { event, data } 
            }),
        )
    }
}
