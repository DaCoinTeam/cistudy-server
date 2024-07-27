import { AnyFileProcessData, isMinimalFile } from "@common"
import { InjectQueue } from "@nestjs/bull"
import { Injectable } from "@nestjs/common"
import { Queue } from "bull"
import { QUEUE_NAME } from "./process-mpeg-dash.constants"
import { ProcessMpegDashService } from "./process-mpeg-dash.service"

@Injectable()
export class ProcessMpegDashProducer {
    constructor(
    private readonly processMpegDashService: ProcessMpegDashService,
    @InjectQueue(QUEUE_NAME) private readonly convertQueue: Queue,
    ) {}

    async add(data: AnyFileProcessData) {
        const { assetId, file, callbackQueries } = data
        await this.processMpegDashService.createTask(assetId, file)
        const filename = isMinimalFile(file) ? file.filename : file.originalname
        await this.convertQueue.add({assetId, filename, callbackQueries})
        //await this.processMpegDashService.processVideo({assetId, filename, callbacks})
    }
}
