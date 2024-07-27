import {
    AnyFile,
    FilenameProcessData,
    FilesData,
    isMinimalFile,
} from "@common"
import { pathsConfig, videoConfig } from "@config"
import { Bento4Service, FfmpegService, StorageService } from "@global"
import { Injectable, Logger } from "@nestjs/common"
import { InjectEntityManager } from "@nestjs/typeorm"
import { promises as fsPromise } from "fs"
import { basename, dirname, extname, join } from "path"
import { EntityManager } from "typeorm"
import { validate as validateUuidv4 } from "uuid"

const MANIFEST_FILE_NAME = "manifest.mpd"

@Injectable()
export class ProcessMpegDashService {
    private readonly logger = new Logger(ProcessMpegDashService.name)
    constructor(
    private readonly storageService: StorageService,
    private readonly ffmegService: FfmpegService,
    private readonly bento4Service: Bento4Service,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    ) {}

    private validateVideoExtension(fileName: string): boolean {
        const allowedExtensions = [
            ".mp4",
            ".avi",
            ".mov",
            ".mkv",
            ".wmv",
            ".flv",
            ".webm",
        ]
        return allowedExtensions.includes(extname(fileName))
    }

    async createTask(assetId: string, file: AnyFile) {
        const _isMinimalFile = isMinimalFile(file)
        const filename = _isMinimalFile ? file.filename : file.originalname
        const fileBody = _isMinimalFile ? file.fileBody : file.buffer
        if (!this.validateVideoExtension(filename))
            throw new Error("Invalid video file extension")

        const directory = join(
            pathsConfig().processMpegDashTasksDirectory,
            assetId,
        )
        await fsPromise.mkdir(directory)
        await fsPromise.writeFile(join(directory, filename), fileBody)
    }

    private async uploadMpegDashManifestRecusive(
        path: string,
        data: FilesData,
        sendPath?: string,
        insideNonRootDir: boolean = true,
    ) {
        const name = basename(path)
        const stat = await fsPromise.stat(path)
        if (stat.isDirectory()) {
            const isRoot = validateUuidv4(name)
            if (!insideNonRootDir || isRoot || name === "video" || name === "audio") {
                const childNames = await fsPromise.readdir(path)
                for (const childName of childNames) {
                    const childPath = join(path, childName)
                    const childSendPath = sendPath
                        ? join(sendPath, childName)
                        : childName
                    await this.uploadMpegDashManifestRecusive(
                        childPath,
                        data,
                        childSendPath,
                        isRoot,
                    )
                }
            }
        } else {
            const isManifest = name === MANIFEST_FILE_NAME
            if (!isManifest && insideNonRootDir) return
            const fileBody = await fsPromise.readFile(path)
            if (isManifest) {
                data.rootFile = {
                    filename: name,
                    fileBody,
                }
            } else {
                data.fileAndSubdirectories.push({
                    file: {
                        filename: name,
                        fileBody,
                    },
                    subdirectory: dirname(sendPath),
                })
            }
        }
    }

    private async uploadMpegDashManifest(assetId: string) {
        const data: FilesData = {
            fileAndSubdirectories: [],
        }
        const path = join(pathsConfig().processMpegDashTasksDirectory, assetId)
        await this.uploadMpegDashManifestRecusive(path, data)

        await this.storageService.update(assetId, data)
    }

    private async cleanUp(assetId: string) {
        const path = join(pathsConfig().processMpegDashTasksDirectory, assetId)
        await fsPromise.rm(path, { recursive: true })
    }

    async processVideo(data: FilenameProcessData) {
        const { assetId, filename, callbackQueries } = data
        const { queryAtStart, queryAtEnd } = callbackQueries
        
        this.logger.verbose(`DOING TASK: ${assetId}`)
        this.entityManager.query(queryAtStart[0], queryAtStart[1])

        this.logger.verbose("1/7. Handling query at the start...")

        this.logger.verbose("2/7. Encoding video at multiple bitrates...")
        await this.ffmegService.encodeAtMultipleBitrates(assetId, filename)

        this.logger.verbose("3/7. Fragmenting videos...")
        const promises: Array<Promise<void>> = []
        for (const videoName of videoConfig().videoNames) {
            const promise = async () => {
                const fragmentationRequired = await this.bento4Service.checkFragments(
                    assetId,
                    videoName,
                )
                if (fragmentationRequired) {
                    await this.bento4Service.fragmentVideo(assetId, videoName)
                }
            }
            promises.push(promise())
        }
        await Promise.all(promises)

        this.logger.verbose("4/7. Generating MPEG-DASH manifest...")
        await this.bento4Service.generateMpegDashManifestFromFragments(
            assetId,
            videoConfig().videoNames,
        )

        this.logger.verbose("5/7. Uploading...")
        await this.uploadMpegDashManifest(assetId)

        this.logger.verbose("6/7. Cleaning up...")
        await this.cleanUp(assetId)

        this.logger.verbose("7/7. Handling query at the end...")
        this.entityManager.query(queryAtEnd[0], queryAtEnd[1])

    }
}
