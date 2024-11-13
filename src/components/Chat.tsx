import React, { useEffect, useState } from "react"
import { TotalList } from "telegram/Helpers"
import { Api } from "telegram"
import Message = Api.Message
import { Box, Button, Input, Stack } from "@mui/joy"
import { TelegramoDialog } from "../model.ts"

const MessageView: React.FC<{ message: Message }> = ({ message }) => {
    return (
        <Stack direction={message?.out ? "row-reverse" : "row"}>
            <Stack direction="row">{message.message}</Stack>
        </Stack>
    )
}

const MessageInput: React.FC<{
    dialog: TelegramoDialog
    setMessages: React.Dispatch<React.SetStateAction<TotalList<Message>>>
}> = ({ dialog, setMessages }) => {
    const [value, setValue] = useState<string>("")

    const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value)
    }

    const handleInputSubmit = async () => {
        const newMessage = await dialog.client.sendMessage(dialog.dialog, {
            message: value,
        })
        setMessages((oldMessages) => [...oldMessages, newMessage])
        setValue("")
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

const ChatView: React.FC<{ dialog: TelegramoDialog }> = ({ dialog }) => {
    const [messages, setMessages] = useState<TotalList<Message>>(
        new TotalList(),
    )

    useEffect(() => {
        ;(async () => {
            setMessages((await dialog.messages()).reverse())
        })()
    }, [dialog])

    return (
        <Stack>
            <Stack flex="1">
                {messages.map((msg, index) => (
                    <MessageView key={index} message={msg} />
                ))}
            </Stack>
            <MessageInput dialog={dialog} setMessages={setMessages} />
        </Stack>
    )
}

export default ChatView
