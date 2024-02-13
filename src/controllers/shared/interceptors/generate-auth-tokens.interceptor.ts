import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { Output } from "@common"

@Injectable()
export class GenerateAuthTokensInterceptor<T extends object>
implements NestInterceptor<T, Output<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<Output<T>>> {
        const request = context.switchToHttp().getRequest()
        const query = request.query
        const clientId = query.clientId as string | undefined

        return next.handle().pipe(
            mergeMap(async (data) => {
                return await this.authManagerService.generateOutput<T>(
                    data.userId,
                    data,
                    true,
                    clientId,
                )
            }),
        )
    }
}
