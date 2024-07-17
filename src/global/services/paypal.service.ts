import { keysConfig } from "@config"
import { Injectable } from "@nestjs/common"
import axios from "axios"
import numeral from "numeral"

export const PAYPAL_SANDBOX_TOKEN_URL =
  "https://api-m.sandbox.paypal.com/v1/oauth2/token"
export const PAYPAL_LIVE_TOKEN_URL = ""

export const PAYPAL_SANDBOX_CHECKOUT_ORDER_URL =
  "https://api-m.sandbox.paypal.com/v2/checkout/orders"
export const PAYPAL_LIVE_CHECKOUT_ORDER_URL = ""

export const getPayPalSandboxCaptureOrderId = (orderId: string) =>
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`
export const getPayPalLiveCaptureOrderId = (orderId: string) => `${orderId}`

export const getPayPalTokenUrl = (isSandbox?: boolean) =>
    isSandbox ? PAYPAL_SANDBOX_TOKEN_URL : PAYPAL_LIVE_TOKEN_URL

export const getPayPalCheckoutOrderUrl = (isSandbox?: boolean) =>
    isSandbox ? PAYPAL_SANDBOX_CHECKOUT_ORDER_URL : PAYPAL_LIVE_CHECKOUT_ORDER_URL

export const getPayPalCaptureOrderUrl = (
    orderId: string,
    isSandbox?: boolean,
) =>
    isSandbox
        ? getPayPalSandboxCaptureOrderId(orderId)
        : getPayPalLiveCaptureOrderId(orderId)

export interface CreateOrderParams {
  amount: number
  isSandbox?: boolean
}

export interface CaptureOrderParams {
  orderId: string
  isSandbox?: boolean
}

@Injectable()
export class PaypalService {
    constructor() {}

    async getAccessToken(isSandbox?: boolean) {
        const { data } = await axios({
            method: "post",
            url: getPayPalTokenUrl(isSandbox),
            data: { grant_type: "client_credentials" },
            headers: {
                Accept: "application/json",
                "Accept-Language": "en_US",
                "Content-Type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*",
            },
            auth: {
                username: keysConfig().paypal.clientId,
                password: keysConfig().paypal.secretKey,
            },
        })
        const accessToken = data["access_token"]
        return accessToken
    }

    async createOrder({
        amount,
        isSandbox,
    }: CreateOrderParams) {
        const accessToken = await this.getAccessToken(isSandbox)
        const { data } = await axios({
            method: "post",
            url: getPayPalCheckoutOrderUrl(isSandbox),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: `${numeral(amount).format("0.00")}`,
                        },
                    },
                ],
                intent: "CAPTURE",
            },
        })
        return data
    }

    async captureOrder({ orderId, isSandbox}: CaptureOrderParams) {
        const accessToken = await this.getAccessToken(isSandbox)
        const { data } = await axios({
            method: "post",
            url: getPayPalCaptureOrderUrl(orderId, isSandbox),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return data
    }
}
