import Web3, { EventLog } from "web3"
import { getHttpProvider } from "../providers"
import { ChainId } from "../chains"

export const ENROLLED_SIGNATURE = Web3.utils.sha3("Enrolled(address,address,address,uint256)")

export const decodeEnrolledLog = (log: EventLog) => {
    const web3 = new Web3(getHttpProvider(ChainId.KalytnTestnet))
    return web3.eth.abi.decodeLog([
        {
            "indexed": true,
            "internalType": "address",
            "name": "senderAddr",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "creatorAddr",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "address",
            "name": "feeToAddr",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "payAmount",
            "type": "uint256"
        }
    ], log.data, log.topics)
}