import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, Payload, AuthOutput, getClientId } from "@common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { InjectRepository } from "@nestjs/typeorm"
import { AccountMySqlEntity } from "@database"
import { Repository} from "typeorm"

@Injectable()
export class AuthInterceptor<T extends object>
implements NestInterceptor<T, AuthOutput<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>
    ) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<AuthOutput<T>>> {
        const gqlContext = GqlExecutionContext.create(context).getContext()
        const request = gqlContext.req
        
        const { accountId, type } = request.user as Payload
        let { accountRoles } = request.user as Payload

        const clientId = getClientId(request.headers)
        const refresh = type === AuthTokenType.Refresh

        if (refresh) {
            await this.authManagerService.validateSession(accountId, clientId)
            const account = await this.accountMySqlRepository.findOne({
                where: {
                  accountId
                },
                relations: {
                //   accountRoles: {
                //     role: true
                //   }
                }
              })
            //   accountRoles = account.accountRoles.map(accRoles => accRoles.role.name)
        }

        return next.handle().pipe(
            mergeMap(async (data) => {
                return await this.authManagerService.generateOutput<T>(
                    { accountId, accountRoles, type },
                    data,
                    refresh,
                    clientId,
                )
            }),
        )
    }
}
