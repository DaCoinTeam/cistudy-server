import { Job } from "bull"
import { OnQueueError, Process, Processor } from "@nestjs/bull"
import { Metadata } from "@definitions"
import { ProcessMpegDashService } from "./process-mpeg-dash.service"
import { QUEUE_NAME } from "./process-mpeg-dash.constants"

@Processor(QUEUE_NAME)
export class ProcessMpegDashConsumer {
    constructor(
    private readonly processMpegDashService: ProcessMpegDashService,
    ) {}

  @Process()
    async process(job: Job<Metadata>) {
        await this.processMpegDashService.processVideo(job.data)
        return {}
    }

  @OnQueueError()
  onError(err: Error) {
      console.error(err)
  }
}
