import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, AuthOutput, getClientId } from "@common"

@Injectable()
export class GenerateAuthTokensInterceptor<T extends object>
implements NestInterceptor<T, AuthOutput<T>>
{
    constructor(private readonly authManagerService: AuthManagerService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<AuthOutput<T>>> {
        const headers = context.switchToHttp().getRequest().headers
        const clientId = getClientId(headers)

        return next.handle().pipe(
            mergeMap(async (data) => {
                const { tokens } = await this.authManagerService.generateOutput<T>(
                    {
                        accountId: data.accountId,
                        accountRoles: data.accountRoles,
                        type: AuthTokenType.Refresh,
                    },
                    data,
                    true,
                    clientId,
                )
                return {
                    tokens
                } as AuthOutput<T>
            }),
        )
    }
}
