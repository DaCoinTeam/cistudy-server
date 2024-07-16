import { EthExecutionAPI, HttpProvider, WebSocketProvider } from "web3"
import { ChainId, chainInfos } from "../chains"

export const getHttpProvider = (
    chainId: ChainId,
    controller?: AbortController
): HttpProvider<EthExecutionAPI> => {
    const providerOptions = controller
        ? {
            providerOptions: {
                signal: controller.signal
            }
        } : undefined

    return new HttpProvider(chainInfos[chainId].httpRpcUrl, providerOptions)
}

export const getWebSocketProvider = (chainId: ChainId): WebSocketProvider<EthExecutionAPI> => {
    return new WebSocketProvider((chainInfos[chainId].websocketRpcUrl), {
        // clientConfig: {
        //     keepalive: true,
        //     keepaliveInterval: 60000,
        // },
        // reconnect: {
        //     auto: true,
        //     delay: 5000,
        //     maxAttempts: 5,
        //     onTimeout: false,
        // },
    })
}