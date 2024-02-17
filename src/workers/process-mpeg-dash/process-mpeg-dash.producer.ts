import { Injectable } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import { Queue } from "bull"
import { ProcessMpegDashService } from "./process-mpeg-dash.service"
import { QUEUE_NAME } from "./process-mpeg-dash.constants"
import { AnyFile, isMinimalFile } from "@common"

@Injectable()
export class ProcessMpegDashProducer {
    constructor(
    private readonly processMpegDashService: ProcessMpegDashService,
    @InjectQueue(QUEUE_NAME) private readonly convertQueue: Queue,
    ) {}

    async add(assetId: string, file: AnyFile) {
        await this.processMpegDashService.createTask(assetId, file)
        const filename = isMinimalFile(file) ? file.filename : file.originalname
        //await this.convertQueue.add(metadata)
        await this.processMpegDashService.processVideo({ assetId, filename })
    }
}
