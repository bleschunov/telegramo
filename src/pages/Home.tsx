import React, { useEffect, useState } from "react"
import { Dialog } from "telegram/tl/custom/dialog"
import { Avatar, Stack, Typography } from "@mui/joy"
import createTelegramClient from "../fn/client.ts"
import { TELEGRAM_SESSION_PREFIX } from "../consts.ts"
import ChatView from "../components/Chat.tsx"
import { Buffer } from "buffer/"
import { TelegramoDialog } from "../model.ts"

const getTelegramoSessionKeys = (): string[] => {
    return Object.keys(localStorage).filter((k) =>
        k.startsWith(TELEGRAM_SESSION_PREFIX),
    )
}

const getTelegramoDialogs = async (
    sessionKey: string,
): Promise<TelegramoDialog[]> => {
    const getProfilePhotoURL = async (dialog: Dialog): Promise<string> => {
        if (!dialog.entity) {
            return "#"
        }
        const photo = await client.downloadProfilePhoto(dialog.entity)
        return photo instanceof Buffer
            ? URL.createObjectURL(
                  new Blob([photo.buffer], { type: "image/jpeg" }),
              )
            : "#"
    }

    const shortMessage = (text: string | undefined, maxLen: number): string => {
        if (!text) {
            return "Сообщений нет..."
        }

        if (text.length > maxLen) {
            return text.slice(0, maxLen - 3) + "..."
        }

        return text
    }

    const client = await createTelegramClient(sessionKey)
    if (!(await client.connect())) {
        return []
    }
    const dialogs = await client.getDialogs()
    const photoURLList = await Promise.all(
        dialogs.map((d) => getProfilePhotoURL(d)),
    )
    return dialogs.map(
        (d, i) =>
            new TelegramoDialog(
                d._client,
                d.entity!,
                photoURLList[i],
                d.name!,
                shortMessage(d.message?.message, 45),
            ),
    )
}

const DialogPreview: React.FC<{
    dialog: TelegramoDialog
    handleDialogClick: (dialog: TelegramoDialog) => void
}> = ({ dialog, handleDialogClick }) => {
    return (
        <Stack direction="row" onClick={() => handleDialogClick(dialog)}>
            <Avatar src={dialog.avatarURL} />
            <Stack>
                <Typography level="title-lg">{dialog.name}</Typography>
                <Typography level="body-lg">{dialog.message}</Typography>
            </Stack>
        </Stack>
    )
}

const DialogPreviewList: React.FC<{
    dialogs: TelegramoDialog[]
    handleDialogClick: (dialog: TelegramoDialog) => void
}> = ({ dialogs, handleDialogClick }) => {
    const dialogPreviewList = dialogs.map((d, i) => (
        <DialogPreview
            key={i}
            dialog={d}
            handleDialogClick={handleDialogClick}
        />
    ))

    return <Stack spacing={1}>{dialogPreviewList}</Stack>
}

const Home = () => {
    const [dialogs, setDialogs] = useState<TelegramoDialog[]>([])
    const [currentDialog, setCurrentDialog] = useState<TelegramoDialog | null>(
        null,
    )

    useEffect(() => {
        ;(async () => {
            setDialogs(
                (
                    await Promise.all(
                        getTelegramoSessionKeys().map((k) =>
                            getTelegramoDialogs(k),
                        ),
                    )
                ).flat(),
            )
        })()
    }, [])

    const handleDialogClick = (dialog: TelegramoDialog) => {
        setCurrentDialog(dialog)
    }

    return (
        <Stack flex="1" direction="row">
            <Stack flex="0 0 25%">
                <DialogPreviewList
                    dialogs={dialogs}
                    handleDialogClick={handleDialogClick}
                />
            </Stack>
            {currentDialog && (
                <Stack flex="0 0 75%">
                    <ChatView dialog={currentDialog} />
                </Stack>
            )}
        </Stack>
    )
}

export default Home
