export const computePercentage = (numerator: number, denominator: number, fractionDigits: number = 2): number => {
    const fixed = (numerator * 100 / denominator).toFixed(fractionDigits)
    return Number.parseFloat(fixed)
}

export const computeDenomination = (amount: bigint, decimals = 18, fractionDigits: number = 5) => {
    const decimalMultiplier = 10 ** fractionDigits
    const divisor = 10 ** decimals
    const result = Number(amount * BigInt(decimalMultiplier) / BigInt(divisor))
    return Number(result / decimalMultiplier)
}

export const computeRaw = (amount: number, decimals = 18): bigint => {
    const mutiplier = 10 ** decimals
    return BigInt(amount * mutiplier)
}

export const computeFixedFloor = (value: number, fractionDigits: number = 5): number => {
    const divisor = Math.pow(10, fractionDigits)
    return Math.floor(value * divisor) / divisor
}