import { Injectable } from "@nestjs/common"

import {
    AnyFile,
    FileAndSubdirectory,
    Metadata,
    isMinimalFile,
    makeDirectoryIfNotExisted,
} from "@common"
import { v4 as uuid4, validate as validateUuid4 } from "uuid"
import { join, dirname, basename } from "path"
import {
    ReadStream,
    Stats,
    createReadStream as fsCreateReadStream,
    promises as fsPromises,
} from "fs"
import { pathsConfig } from "@config"

const METADATA_FILE_NAME = "metadata.json"

@Injectable()
export class StorageService {
    constructor() {}

    private async readFile(paths: string[], options?: BufferEncoding) {
        return await fsPromises.readFile(
            join(pathsConfig().storageDirectory, ...paths),
            options,
        )
    }

    private async writeFile(paths: string[], data: string | Buffer) {
        const filePath = join(pathsConfig().storageDirectory, ...paths)
        await makeDirectoryIfNotExisted(dirname(filePath))
        await fsPromises.writeFile(filePath, data)
    }

    async getFilename(assetIdOrPath: string): Promise<string> {
        if (validateUuid4(assetIdOrPath))
            return await this.getFilenameFromAssetId(assetIdOrPath)
        return this.getFilenameFromAssetPath(assetIdOrPath)
    }

    private async getFilenameFromAssetId(assetId: string): Promise<string> {
        const data = await this.readFile([assetId, "metadata.json"], "utf8")
        const { filename } = JSON.parse(data) as Metadata
        return filename
    }

    private async getFilenameFromAssetPath(assetPath: string): Promise<string> {
        return basename(pathsConfig().storageDirectory, assetPath)
    }

    async getStat(assetIdOrPath: string): Promise<Stats> {
        if (validateUuid4(assetIdOrPath))
            return await this.getStatFromAssetId(assetIdOrPath)
        return this.getStatFromAssetPath(assetIdOrPath)
    }

    private async getStatFromAssetId(assetId: string): Promise<Stats> {
        const data = await this.readFile([assetId, "metadata.json"], "utf8")
        const { filename } = JSON.parse(data) as Metadata
        return await fsPromises.stat(
            join(pathsConfig().storageDirectory, assetId, filename),
        )
    }

    private async getStatFromAssetPath(assetPath: string): Promise<Stats> {
        return await fsPromises.stat(
            join(pathsConfig().storageDirectory, assetPath),
        )
    }

    async createReadStream(
        assetIdOrPath: string,
        options?: ReadStreamOptions,
    ): Promise<ReadStream> {
        if (validateUuid4(assetIdOrPath))
            return await this.createReadStreamFromAssetId(assetIdOrPath, options)
        return this.createReadStreamFromAssetPath(assetIdOrPath, options)
    }

    private async createReadStreamFromAssetId(
        assetId: string,
        options?: ReadStreamOptions,
    ): Promise<ReadStream> {
        const data = await this.readFile([assetId, "metadata.json"], "utf8")
        const { filename } = JSON.parse(data) as Metadata

        return fsCreateReadStream(
            join(pathsConfig().storageDirectory, assetId, filename),
            options,
        )
    }

    private createReadStreamFromAssetPath(
        assetPath: string,
        options?: ReadStreamOptions,
    ): ReadStream {
        return fsCreateReadStream(
            join(pathsConfig().storageDirectory, assetPath),
            options,
        )
    }

    private async uploadMetadata(metadata: Metadata) {
        const { assetId } = metadata
        await this.writeFile(
            [assetId, METADATA_FILE_NAME],
            JSON.stringify(metadata),
        )
    }

    async upload(data: WriteData): Promise<Metadata> {
        const { rootFile, fileAndSubdirectories } = data
        const assetId = uuid4()

        const _isMinimalFile = isMinimalFile(rootFile)
        const filename = _isMinimalFile ? rootFile.filename : rootFile.originalname
        const fileBody = _isMinimalFile ? rootFile.fileBody : rootFile.buffer
        await this.writeFile([assetId, filename], fileBody)

        if (fileAndSubdirectories) {
            for (const { file: fileExtra, subdirectory } of fileAndSubdirectories) {
                const isMinimalFileExtra = isMinimalFile(fileExtra)
                const filenameExtra = isMinimalFileExtra
                    ? fileExtra.filename
                    : fileExtra.originalname
                const fileBodyExtra = isMinimalFileExtra
                    ? fileExtra.fileBody
                    : fileExtra.buffer

                const directory = subdirectory ? join(assetId, subdirectory) : assetId
                await this.writeFile([directory, filenameExtra], fileBodyExtra)
            }
        }

        const metadata: Metadata = {
            assetId,
            filename,
        }

        await this.uploadMetadata(metadata)
        return metadata
    }

    private async clearDirectory(assetId: string) {
        const directory = join(pathsConfig().storageDirectory, assetId)
        const filenames = await fsPromises.readdir(directory)
        for (const filename of filenames) {
            await fsPromises.unlink(join(directory, filename))
        }
    }

    async update(assetId: string, data: WriteData, options?: UpdateOptions) {
        const { rootFile, fileAndSubdirectories } = data
        const { keepDirectory } = options
        if (!keepDirectory) await this.clearDirectory(assetId)

        if (rootFile) {
            const isMinimalRootFile = isMinimalFile(rootFile)

            const filename = isMinimalRootFile
                ? rootFile.filename
                : rootFile.originalname
            const fileBody = isMinimalRootFile ? rootFile.fileBody : rootFile.buffer

            const metadata: Metadata = {
                assetId,
                filename,
            }

            await this.writeFile([assetId, filename], fileBody)
            await this.uploadMetadata(metadata)
        }

        if (fileAndSubdirectories) {
            for (const { file, subdirectory } of fileAndSubdirectories) {
                const _isMinimalFile = isMinimalFile(file)
                const filename = _isMinimalFile ? file.filename : file.originalname
                const fileBody = _isMinimalFile ? file.fileBody : file.buffer
                const directory = subdirectory ? join(assetId, subdirectory) : assetId
                await this.writeFile([directory, filename], fileBody)
            }
        }
    }
}

type ReadStreamOptions = Partial<{
  start: number;
  end: number;
}>

type WriteData = Partial<{
  rootFile: AnyFile;
  fileAndSubdirectories: Array<FileAndSubdirectory>;
}>;

type UpdateOptions = Partial<{
  keepDirectory?: boolean;
}>;
