export const blockchainConfig = () =>
    ({
        evmAddress: process.env.EVM_ADDRESS,
        evmPrivateKey: process.env.EVM_PRIVATE_KEY,
        earnPercentage: Number.parseFloat(process.env.EARN_PERCENTAGE)
    })
