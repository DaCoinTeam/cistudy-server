import {
    ChainId,
    ERC20Contract,
    GAS_LIMIT,
    GAS_PRICE,
    chainInfos,
    getHttpProvider,
} from "@blockchain"
import { blockchainConfig } from "@config"
import { Injectable, OnModuleInit } from "@nestjs/common"
import Web3, { Address } from "web3"
import { RegisteredSubscription } from "web3-eth"
import { Web3Account } from "web3-eth-accounts"

@Injectable()
export class BlockchainService implements OnModuleInit {
    erc20Contract: ERC20Contract
    account: Web3Account
    web3: Web3<RegisteredSubscription>

    async onModuleInit() {
        const provider = getHttpProvider(ChainId.KalytnTestnet)
        this.erc20Contract = new ERC20Contract(
            ChainId.KalytnTestnet,
            chainInfos[ChainId.KalytnTestnet].tokenAddress,
            provider,
        )
        this.web3 = new Web3(getHttpProvider(ChainId.KalytnTestnet))
        
        this.account = this.web3.eth.accounts.privateKeyToAccount(
            blockchainConfig().evmPrivateKey,
        )
    }

    async transfer(recipient: Address, amount: bigint) {
        const transaction = await this.account.signTransaction({
            from: this.account.address,
            to: this.erc20Contract.address,
            data: this.erc20Contract.transfer(recipient, amount).encodeABI(),
            gasPrice: GAS_PRICE,
            gasLimit: GAS_LIMIT,
        })
        const receipt = await this.web3.eth.sendSignedTransaction(
            transaction.rawTransaction,
        )
        return {
            transactionHash: receipt.transactionHash,
        }
    }
}
