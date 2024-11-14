import { StringSession } from "telegram/sessions"
import { TelegramClient } from "telegram"
import { useEffect, useState } from "react"
import { TELEGRAM_SESSION_PREFIX } from "../consts.ts"

const useTelegramSessionKeys = (): string[] => {
    return Object.keys(localStorage).filter((k) =>
        k.startsWith(TELEGRAM_SESSION_PREFIX),
    )
}

const useNewTelegramClient = (): TelegramClient => {
    const SESSION = new StringSession()

    return new TelegramClient(
        SESSION,
        parseInt(import.meta.env.VITE_API_ID),
        import.meta.env.VITE_API_HASH,
        { connectionRetries: 1 },
    )
}

const useTelegramClients = (): TelegramClient[] => {
    const [connectedClients, setConnectedClients] = useState<TelegramClient[]>(
        [],
    )
    const sessionKeys = useTelegramSessionKeys()

    useEffect(() => {
        ;(async () => {
            const clients = []
            for (const key of sessionKeys) {
                const SESSION = new StringSession(
                    JSON.parse(localStorage.getItem(key) as string),
                )

                clients.push(
                    new TelegramClient(
                        SESSION,
                        parseInt(import.meta.env.VITE_API_ID),
                        import.meta.env.VITE_API_HASH,
                        { connectionRetries: 1 },
                    ),
                )
            }

            await Promise.all(clients.map((c) => c.connect()))
            setConnectedClients(clients)
        })()
    }, [sessionKeys])

    return connectedClients
}

export { useTelegramClients, useNewTelegramClient }
