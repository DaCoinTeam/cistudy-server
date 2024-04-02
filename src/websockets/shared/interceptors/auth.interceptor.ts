import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { AuthTokenType, Payload, getClientId, WsOutput } from "@common"

@Injectable()
export class AuthInterceptor<T extends object>
implements NestInterceptor<T, WsOutput<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<WsOutput<T>>> {
        const client = context.switchToWs().getClient()

        const { userId, type } = client.user as Payload

        const headers = client.handshake?.headers
        const clientId = getClientId(headers)

        const refresh = type === AuthTokenType.Refresh
        if (refresh) {
            await this.authManagerService.validateSession(userId, clientId)
        }
        return next.handle().pipe(
            mergeMap(async ({event, data}) => {
                data = await this.authManagerService.generateOutput<T>(
                    userId,
                    data,
                    refresh,
                    clientId,
                )
                return { event, data } 
            }),
        )
    }
}