import React, {useEffect, useState} from 'react';
import {Dialog} from "telegram/tl/custom/dialog";
import {TotalList} from "telegram/Helpers";
import {Api, TelegramClient} from "telegram";
import Message = Api.Message;
import {Box, Button, Input, Stack} from "@mui/joy";


const MessageView: React.FC<{ message: Message }> = ({message}) => {
  return (
    <Stack direction={message?.out ? "row-reverse" : "row"}><Stack direction="row">{message.message}</Stack></Stack>
  )
}

const MessageInput: React.FC<{
  dialog: Dialog,
  setMessages: React.Dispatch<React.SetStateAction<TotalList<Message>>>
}> = ({dialog, setMessages}) => {
  const [value, setValue] = useState<string>("")

  const handleInputChange = (event) => {
    setValue(event.target.value)
  }

  const handleInputSubmit = async ()=> {
    const newMessage = await dialog._client.sendMessage(dialog.inputEntity, { message: value })
    setMessages(oldMessages => [...oldMessages, newMessage])
    setValue("")
  }

  return (
    <Stack direction="row" flex="1">
      <Box flex="1"><Input value={value} onChange={handleInputChange} placeholder="Введите ваше сообщение"/></Box>
      <Box><Button onClick={handleInputSubmit}>Отправить</Button></Box>
    </Stack>
  )
}


const ChatView: React.FC<{ dialog: Dialog }> = ({dialog}) => {
  const [messages, setMessages] = useState<TotalList<Message>>(new TotalList())

  useEffect(() => {
    (async () => {
      setMessages((await dialog._client.getMessages(dialog.id)).reverse())
    })()
  }, [])

  return (
    <Stack flex="1">
      <Stack flex="1">{messages.map((msg, index) => <MessageView key={index} message={msg}/>)}</Stack>
      <MessageInput dialog={dialog} setMessages={setMessages} />
    </Stack>
  )

}

export default ChatView