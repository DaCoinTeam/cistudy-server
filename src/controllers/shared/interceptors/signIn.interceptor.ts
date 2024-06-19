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
export class SignInInterceptor<T extends object>
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
                const output = await this.authManagerService.generateOutput<T>(
                    {
                        accountId: data.accountId,
                        accountRole: data.accountRole,
                        type: AuthTokenType.Refresh,
                    },
                    data,
                    true,
                    clientId,
                )
                return {
                    tokens: output.tokens
                } as AuthOutput<T>
            }),
        )
    }
}
