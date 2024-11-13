import { Api, TelegramClient } from "telegram"
import Message = Api.Message
import { Entity } from "telegram/define"

class TelegramoDialog {
    client: TelegramClient
    dialog: Entity

    avatarURL: string
    name: string
    message: string

    constructor(
        client: TelegramClient,
        dialog: Entity,
        avatarURL: string,
        name: string,
        message: string,
    ) {
        this.client = client
        this.dialog = dialog
        this.avatarURL = avatarURL
        this.name = name
        this.message = message
    }

    async messages(): Promise<Message[]> {
        return await this.client.getMessages(this.dialog, { limit: 5 })
    }
}

export { TelegramoDialog }
