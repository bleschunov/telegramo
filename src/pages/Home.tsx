import React, { useEffect, useState } from "react"
import { Dialog } from "telegram/tl/custom/dialog"
import { TotalList } from "telegram/Helpers"
import { Stack } from "@mui/joy"
import createTelegramClient from "../fn/client.ts"
import { TELEGRAM_SESSION_PREFIX } from "../consts.ts"
import ChatView from "../components/Chat.tsx"

function* telegramSessionKeys(): Generator<string> {
    for (const key of Object.keys(localStorage)) {
        if (key.startsWith(TELEGRAM_SESSION_PREFIX)) {
            yield key
        }
    }
}

const Home = () => {
    const [dialogs, setDialogs] = useState<TotalList<Dialog>>(new TotalList())
    const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null)

    useEffect(() => {
        ;(async () => {
            for (const key of telegramSessionKeys()) {
                const newClient = await createTelegramClient(key)
                if (await newClient.connect()) {
                    const newDialogs = await newClient.getDialogs()
                    setDialogs((oldDialogs) => [...oldDialogs, ...newDialogs])
                }
            }
        })()
    }, [])

    const handleDialogClick = (dialog: Dialog) => {
        setCurrentDialog(dialog)
    }

    return (
        <Stack flex="0 0 100%" direction="row">
            <ul>
                {dialogs.map((dialog, index) => (
                    <li key={index} onClick={() => handleDialogClick(dialog)}>
                        {dialog.name}
                    </li>
                ))}
            </ul>
            {currentDialog && <ChatView dialog={currentDialog} />}
        </Stack>
    )
}

export default Home
