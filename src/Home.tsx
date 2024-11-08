import {useEffect, useState} from "react";
import {Dialog} from "telegram/tl/custom/dialog";
import {TotalList} from "telegram/Helpers";
import client from "./client.ts"

const Home = () => {
    const [dialogs, setDialogs] = useState<TotalList<Dialog> | null>(null)

    useEffect(() => {
        (async () => {
            setDialogs(await client.getDialogs())
        })();
    }, [])

    return <ul>{dialogs?.map((dialog, index) => <li key={index}>{dialog.id?.toString()}</li>)}</ul>
}

export default Home
