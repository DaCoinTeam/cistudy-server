import Web3, { EventLog } from "web3"
import { getHttpProvider } from "../providers"
import { ChainId } from "../chains"

export const ENROLLED_SIGNATURE = Web3.utils.sha3("Enrolled(uint256,address,address)")

export const decodeEnrolledLog = (log: EventLog) => {
    const web3 = new Web3(getHttpProvider(ChainId.KalytnTestnet))
    return web3.eth.abi.decodeLog([
        {
            "indexed": false,
            "name": "payAmount",
            "type": "uint256"
        },
        {
            "indexed": false,
            "name": "creatorAddr",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "feeToAddr",
            "type": "address"
        }
    ], log.data, log.topics)
}