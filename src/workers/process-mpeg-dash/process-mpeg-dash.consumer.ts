import { FilenameProcessData } from "@common"
import { OnQueueError, OnQueueFailed, Process, Processor } from "@nestjs/bull"
import { Job } from "bull"
import { QUEUE_NAME } from "./process-mpeg-dash.constants"
import { ProcessMpegDashService } from "./process-mpeg-dash.service"

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
