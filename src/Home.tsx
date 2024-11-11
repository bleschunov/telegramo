import {useEffect, useState} from "react";
import {Dialog} from "telegram/tl/custom/dialog";
import {TotalList} from "telegram/Helpers";
import {Stack} from "@mui/joy";
import {Api} from "telegram";
import Message = Api.Message;
import createTelegramClient from "./client.ts";
import {TELEGRAM_SESSION_PREFIX} from "./consts.ts";


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
    const [messages, setMessages] = useState<TotalList<Message>>(new TotalList())

    useEffect(() => {
        (async () => {
            for (const key of telegramSessionKeys()) {
                const newClient = await createTelegramClient(key)
                if (await newClient.connect()) {
                    const newDialogs = await newClient.getDialogs()
                    setDialogs(oldDialogs => [...oldDialogs, ...newDialogs])
                }
            }
        })();
    }, [])

    useEffect(() => {
        if (currentDialog) {
            (async () => {
                setMessages(await currentDialog._client.getMessages(currentDialog.id, {limit: 5}))
            })();
        } else {
            setMessages(new TotalList())
        }
    }, [currentDialog])

    const handleDialogClick = (dialog: Dialog) => {
        setCurrentDialog(dialog)
    }

    return (
        <Stack
            direction="row"
        >
            <ul>{dialogs.map((dialog, index) => <li key={index} onClick={() => handleDialogClick(dialog)}>{dialog.name}</li>)}</ul>
            <ul>{messages.map((message, index) => <li key={index}>{message.message}</li>)}</ul>
        </Stack>
    )
}

export default Home
