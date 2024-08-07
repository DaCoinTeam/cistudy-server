import Web3, { EventLog } from "web3"
import { getHttpProvider } from "../providers"
import { ChainId } from "../chains"

export const TRANSFER_SIGNATURE = Web3.utils.sha3("Transfer(address,address,uint256)")

export const decodeTransferLog = (log: EventLog) => {
    const web3 = new Web3(getHttpProvider(ChainId.KalytnTestnet))
    return web3.eth.abi.decodeLog([
        {
            "indexed": true,
            "name": "from",
            "type": "address"
        },
        {
            "indexed": true,
            "name": "to",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "value",
            "type": "uint256"
        }
    ], log.data, log.topics)
}