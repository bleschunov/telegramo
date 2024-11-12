import {StringSession} from "telegram/sessions";
import {TelegramClient} from "telegram";


const createTelegramClient = async (username: string): Promise<TelegramClient> => {
    const SESSION = new StringSession(JSON.parse(localStorage.getItem(username) as string))
    return new TelegramClient(SESSION, parseInt(import.meta.env.VITE_API_ID), import.meta.env.VITE_API_HASH, { connectionRetries: 5 })
}


export default createTelegramClient