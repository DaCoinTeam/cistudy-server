import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, AuthOutput, getClientId } from "@common"
import { GqlExecutionContext } from "@nestjs/graphql"

@Injectable()
export class GenerateAuthTokensInterceptor<T extends object>
implements NestInterceptor<T, AuthOutput<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<AuthOutput<T>>> {
        const gqlContext = GqlExecutionContext.create(context).getContext()
        const headers = gqlContext.req.headers
        const clientId = getClientId(headers)
        
        return next.handle().pipe(
            mergeMap(async (data) => {
                return await this.authManagerService.generateOutput<T>(
                    {
                        accountId: data.accountId,
                        accountRoles: data.roles,
                        type: AuthTokenType.Refresh,
                    },
                    data,
                    true,
                    clientId,
                )
            }),
        )
    }
}
