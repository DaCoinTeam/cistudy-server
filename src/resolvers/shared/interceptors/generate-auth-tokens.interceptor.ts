import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common"
import { AuthManagerService } from "@global"
import { Observable, mergeMap } from "rxjs"
import { IOutput, getClientId } from "@common"
import { GqlExecutionContext } from "@nestjs/graphql"

@Injectable()
export class GenerateAuthTokensInterceptor<T extends object>
implements NestInterceptor<T, IOutput<T>>
{
    constructor(
        private readonly authManagerService: AuthManagerService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<IOutput<T>>> {
        const gqlContext = GqlExecutionContext.create(context).getContext()
        const request = gqlContext.req
        const clientId = getClientId(request)
        
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
