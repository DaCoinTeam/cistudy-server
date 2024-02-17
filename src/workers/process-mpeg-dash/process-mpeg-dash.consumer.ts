import { Job } from "bull"
import { OnQueueError, OnQueueFailed, Process, Processor } from "@nestjs/bull"
import { FilenameProcessData } from "@common"
import { ProcessMpegDashService } from "./process-mpeg-dash.service"
import { QUEUE_NAME } from "./process-mpeg-dash.constants"

@Processor(QUEUE_NAME)
export class ProcessMpegDashConsumer {
    constructor(
    private readonly processMpegDashService: ProcessMpegDashService,
    ) {}

  @Process()
    async process(job: Job<FilenameProcessData>) {
        await this.processMpegDashService.processVideo(job.data)
        return {}
    }

  @OnQueueError()
  onError(err: Error) {
      console.error(err)
  }

  @OnQueueFailed()
  onFailed(_: Job<FilenameProcessData>, err: Error) {
      console.error(err)
  }
}
