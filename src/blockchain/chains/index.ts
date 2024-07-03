import { Address } from "web3"
import {
    KLAYTN_TESTNET_HTTP_RPC_URL,
    KLAYTN_TESTNET_WEBSOCKET_RPC_URL,
    KLAYTN_TESTNET_TOKEN_ADDRESS,
    KLAYTN_TESTNET_ENROLL_MANAGER_ADDRESS,
    KLAYTN_TESTNET_EXPLORER,
    KLAYTN_TESTNET_CHAIN_NAME,
} from "./klaytn-testnet.chain"

export enum ChainId {
  KalytnTestnet = 1001,
}

export type ChainInfo = {
  httpRpcUrl: string;
  websocketRpcUrl: string;
  tokenAddress: Address;
  enrollManagerAddress: Address;
  explorerUrl: string;
  chainName: string;
};

export const defaultChainId = ChainId.KalytnTestnet

export const chainInfos: Record<number, ChainInfo> = {
    [ChainId.KalytnTestnet]: {
        httpRpcUrl: KLAYTN_TESTNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_TESTNET_WEBSOCKET_RPC_URL,
        tokenAddress: KLAYTN_TESTNET_TOKEN_ADDRESS,
        enrollManagerAddress: KLAYTN_TESTNET_ENROLL_MANAGER_ADDRESS,
        explorerUrl: KLAYTN_TESTNET_EXPLORER,
        chainName: KLAYTN_TESTNET_CHAIN_NAME,
    },
}