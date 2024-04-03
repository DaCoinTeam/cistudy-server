import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, Output, getClientId } from "@common"

@Injectable()
export class GenerateAuthTokensInterceptor<T extends object>
implements NestInterceptor<T, Output<T>>
{
    constructor(private readonly authManagerService: AuthManagerService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<Output<T>>> {
        const headers = context.switchToHttp().getRequest().headers
        const clientId = getClientId(headers)

        return next.handle().pipe(
            mergeMap(async (data) => {
                return await this.authManagerService.generateOutput<T>(
                    {
                        userId: data.userId,
                        userRole: data.userRole,
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
