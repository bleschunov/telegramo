import {StringSession} from "telegram/sessions";
import {TelegramClient} from "telegram";


const SESSION = new StringSession(JSON.parse(localStorage.getItem('session') as string)) // Get session from local storage

const client = new TelegramClient(SESSION, parseInt(import.meta.env.VITE_API_ID), import.meta.env.VITE_API_HASH, { connectionRetries: 5 }) // Immediately create a client using your application data

export default client