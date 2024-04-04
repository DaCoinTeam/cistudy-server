export const blockchainConfig = () =>
    ({
        evmAddress: process.env.EVM_ADDRESS,
        evmPrivateKey: process.env.EVM_PRIVATE_KEY, 
        earns: {
            percentage: Number.parseFloat(process.env.EARN_PERCENTAGE),
            likePostEarnCoefficient: Number.parseFloat(process.env.LIKE_POST_EARN_COEFFICIENT),
            commentPostEarnCoefficient: Number.parseFloat(process.env.COMMENT_POST_EARN_COEFFICIENT),
            likePostCommentEarnCoefficient: Number.parseFloat(process.env.LIKE_POST_COMMENT_EARN_COEFFICIENT)
        }
    })
