import React, { useEffect, useState } from "react"
import { Dialog } from "telegram/tl/custom/dialog"
import { Avatar, Stack, Typography } from "@mui/joy"
import ChatView from "../components/Chat.tsx"
import { Buffer } from "buffer/"
import { useTelegramClients } from "../fn/client.ts"

const shortMessage = (text: string | undefined, maxLen: number): string => {
    if (!text) {
        return "Сообщений нет..."
    }

    if (text.length > maxLen) {
        return text.slice(0, maxLen - 3) + "..."
    }

    return text
}

const useProfilePhotoURL = (dialog: Dialog): string => {
    const [url, setURL] = useState<string>("#")

    useEffect(() => {
        ;(async () => {
            if (!dialog.entity) {
                return "#"
            }
            const photo = await dialog._client.downloadProfilePhoto(
                dialog.entity,
            )
            if (photo instanceof Buffer) {
                setURL(
                    URL.createObjectURL(
                        new Blob([photo.buffer], { type: "image/jpeg" }),
                    ),
                )
            }
        })()
    }, [dialog._client, dialog.entity])

    return url
}

const useDialogs = (): Dialog[] => {
    const [dialogs, setDialogs] = useState<Dialog[]>([])

    const clients = useTelegramClients()

    useEffect(() => {
        ;(async () => {
            setDialogs(
                (await Promise.all(clients.map((c) => c.getDialogs())))
                    .flat()
                    .filter((d) => d.isUser),
            )
        })()
    }, [clients])

    return dialogs
}

const DialogPreview: React.FC<{
    dialog: Dialog
    handleDialogClick: (dialog: Dialog) => void
}> = ({ dialog, handleDialogClick }) => {
    const avatarURL = useProfilePhotoURL(dialog)

    return (
        <Stack direction="row" onClick={() => handleDialogClick(dialog)}>
            <Avatar src={avatarURL} />
            <Stack>
                <Typography level="title-lg">{dialog.name}</Typography>
                <Typography level="body-lg">
                    {shortMessage(dialog.message?.message, 45)}
                </Typography>
            </Stack>
        </Stack>
    )
}

const DialogPreviewList: React.FC<{
    dialogs: Dialog[]
    handleDialogClick: (dialog: Dialog) => void
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
    const [currentDialog, setCurrentDialog] = useState<Dialog | null>(null)

    const dialogs = useDialogs()

    const handleDialogClick = (dialog: Dialog) => {
        setCurrentDialog(dialog)
    }

    return (
        <Stack flex="1" p={2} spacing={5} useFlexGap direction="row">
            <Stack flex="0 0 25%">
                <DialogPreviewList
                    dialogs={dialogs}
                    handleDialogClick={handleDialogClick}
                />
            </Stack>
            {currentDialog && (
                <Stack flex="1">
                    <ChatView dialog={currentDialog} />
                </Stack>
            )}
        </Stack>
    )
}

export default Home
