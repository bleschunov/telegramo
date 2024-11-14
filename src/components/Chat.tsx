import React, { useEffect, useState } from "react"
import { TotalList } from "telegram/Helpers"
import { Api } from "telegram"
import Message = Api.Message
import { Box, Button, Card, Chip, Input, Stack } from "@mui/joy"
import { Dialog } from "telegram/tl/custom/dialog"

const useMessages = (
    dialog: Dialog,
): [
    Message[],
    React.Dispatch<React.SetStateAction<Message[]>>,
    React.Dispatch<React.SetStateAction<number>>,
] => {
    const [limit, setLimit] = useState<number>(5)
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        ;(async () => {
            setMessages(
                (
                    await dialog._client.getMessages(dialog.entity, { limit })
                ).reverse(),
            )
        })()
    }, [dialog, limit])

    return [messages, setMessages, setLimit]
}

const MessageView: React.FC<{ message: Message }> = ({ message }) => {
    return (
        <Stack direction={message?.out ? "row-reverse" : "row"}>
            <Card variant="solid" color="primary" size="sm">
                {message.message}
            </Card>
        </Stack>
    )
}

const MessageInput: React.FC<{
    dialog: Dialog
    setMessages: React.Dispatch<React.SetStateAction<TotalList<Message>>>
}> = ({ dialog, setMessages }) => {
    const [value, setValue] = useState<string>("")

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value)
    }

    const handleInputSubmit = async () => {
        if (dialog.entity) {
            const newMessage = await dialog._client.sendMessage(dialog.entity, {
                message: value,
            })
            setMessages((oldMessages) => [...oldMessages, newMessage])
            setValue("")
        }
    }

    return (
        <Stack direction="row" flex="1">
            <Box flex="1">
                <Input
                    value={value}
                    onChange={handleInputChange}
                    placeholder="Введите ваше сообщение"
                />
            </Box>
            <Box>
                <Button onClick={handleInputSubmit}>Отправить</Button>
            </Box>
        </Stack>
    )
}

const ChatView: React.FC<{ dialog: Dialog }> = ({ dialog }) => {
    const [messages, setMessages, setLimit] = useMessages(dialog)

    return (
        <Stack spacing={2} useFlexGap>
            {messages.length > 0 && (
                <Chip
                    sx={{ alignSelf: "center" }}
                    color="primary"
                    onClick={() => setLimit((oldLimit) => oldLimit + 5)}
                    variant="solid"
                >
                    Показать ещё
                </Chip>
            )}
            <Stack flex="1" spacing={1} useFlexGap>
                {messages.map((msg, index) => (
                    <MessageView key={index} message={msg} />
                ))}
            </Stack>
            <MessageInput dialog={dialog} setMessages={setMessages} />
        </Stack>
    )
}

export default ChatView
