import Web3, { Address, Contract, EthExecutionAPI, SupportedProviders } from "web3"
import { abi } from "./abi"
import { ChainId } from "../../chains"
import { getHttpProvider } from "../../providers"
import { computeRaw } from "@common"
import { GAS_LIMIT, GAS_PRICE } from "../../gas"

export class EnrollManagerContract {
    contract: Contract<typeof abi>
    private sender?: Address

    constructor(
        chainId: ChainId,
        address: Address,
        provider?: SupportedProviders<EthExecutionAPI>,
        sender?: string
    ) {
        if (!provider) provider = getHttpProvider(chainId)
        const web3 = new Web3(provider)
        this.contract = new web3.eth.Contract(abi, address, web3)

        this.sender = sender
    }

    enroll() {
        return {
            send: async ({ payAmount, creatorAddr, gasAmount }: EnrollParams) => {
                return this.contract.methods.enroll({
                    payAmount,
                    creatorAddr
                }).send({
                    from: this.sender,
                    gas: GAS_LIMIT,
                    gasPrice: GAS_PRICE,
                    value: gasAmount ? gasAmount.toString() : computeRaw(0.03).toString()
                })
            }
        }
    }
}

export interface EnrollParams {
    payAmount: bigint,
    creatorAddr: string,
    gasAmount?: bigint
}