import { servicesConfig } from "@config"
import { Injectable, OnModuleInit } from "@nestjs/common"
import * as admin from "firebase-admin"
import firebase, { ServiceAccount } from "firebase-admin"
import { Auth } from "firebase-admin/lib/auth/auth"
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"
import { Messaging } from "firebase-admin/lib/messaging/messaging"
import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api"

@Injectable()
export class FirebaseService implements OnModuleInit {
    auth: Auth
    messaging: Messaging

    constructor() {
        const adminConfig: ServiceAccount = {
            projectId: servicesConfig().firebase.projectId,
            privateKey: servicesConfig().firebase.privateKey.replace(/\\n/g, "\n"),
            clientEmail: servicesConfig().firebase.clientEmail,
        }

        let app: admin.app.App

        if (!admin.apps.length) {
            app = admin.initializeApp({
                credential: admin.credential.cert(adminConfig),
            })
        } else {
            app = admin.app()
        }

        this.auth = firebase.auth(app)
        this.messaging = firebase.messaging()
    }
    onModuleInit() {
        
    }

    async sendMessageToAccount(accountId, payload: MessagingPayload) {
        return this.messaging.sendToTopic(accountId, payload)
    } 

    async verifyGoogleAccessToken(token: string): Promise<DecodedIdToken> {
        return await this.auth.verifyIdToken(token)
    }
}
