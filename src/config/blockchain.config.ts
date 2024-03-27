export const blockchainConfig = () =>
    ({
        evmAddress: process.env.EVM_ADDRESS,
        evmPrivateKey: process.env.EVM_PRIVATE_KEY,
    })
