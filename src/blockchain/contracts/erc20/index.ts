import { GAS_LIMIT, GAS_PRICE } from "../../gas"
import Web3, { Address, Contract, EthExecutionAPI, SupportedProviders } from "web3"
import abi from "./abi"
import { ChainId } from "../../chains"
import { getHttpProvider } from "../../providers"

export class ERC20Contract {
    private web3: Web3
    contract: Contract<typeof abi>
    sender?: Address
    address: Address

    constructor(
        chainId: ChainId,
        address: Address,
        provider?: SupportedProviders<EthExecutionAPI>,
        sender?: string
    ) {
        if (!provider) provider = getHttpProvider(chainId)
        this.address = address
        this.web3 = new Web3(provider)
        this.contract = new this.web3.eth.Contract(abi, this.address, this.web3)

        this.sender = sender
    }

    async name() {
        try {
            return await this.contract.methods.name().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async symbol() {
        try {
            return await  this.contract.methods.symbol().call()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async decimals() {
        try {
            return Number(await this.contract.methods.decimals().call())
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async balanceOf(owner: Address) {
        try {
            return await this.contract.methods.balanceOf(owner).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async allowance(owner: Address, spender: Address) {
        try {
            return await this.contract.methods.allowance(owner, spender).call<bigint>()
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    async approve(spender: Address, value: bigint) {
        try {
            return this.contract.methods.approve(spender, value).send({
                from: this.sender,
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            })
        } catch (ex) {
            console.log(ex)
            return null
        }
    }

    transfer(recipient: Address, amount: bigint) {
        return {
            encodeABI: () => {
                return this.contract.methods.transfer(recipient, amount).encodeABI()
            } 
        }
    }
}