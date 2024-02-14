import { join } from "path"

export const pathsConfig = () => ({
    processMpegDashTasksDirectory: join(process.cwd(), "tasks", "process-mpeg-dash"),
    storageDirectory: join(process.cwd(), "storage")
})