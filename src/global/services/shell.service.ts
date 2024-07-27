import { getEnvValue } from "@common"
import { Injectable } from "@nestjs/common"
import { exec } from "child_process"

@Injectable()
export class ShellService {
    async execute(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(
                command,
                {
                    shell: getEnvValue({
                        development: "powershell.exe",
                    }),
                },
                (error, stdout, stderr) => {
                    if (error) {
                        reject(error)
                    }
                    if (stderr) {
                        reject(stderr)
                    }
                    resolve(stdout)
                },
            )
        })
    }
}