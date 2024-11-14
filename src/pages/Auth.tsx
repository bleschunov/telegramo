import React, { type BaseSyntheticEvent, useState } from "react"
import { TELEGRAM_SESSION_PREFIX } from "../consts.ts"
import { useNewTelegramClient } from "../fn/client.ts"

interface IInitialState {
    phoneNumber: string
    password: string
    phoneCode: string
}

const Auth: React.FC = () => {
    const [{ phoneNumber, password, phoneCode }, setAuthInfo] =
        useState<IInitialState>({
            phoneNumber: "",
            password: "",
            phoneCode: "",
        })

    const client = useNewTelegramClient()

    async function sendCodeHandler(): Promise<void> {
        await client.connect()
        await client.sendCode(
            {
                apiId: parseInt(import.meta.env.VITE_API_ID),
                apiHash: import.meta.env.VITE_API_HASH,
            },
            phoneNumber,
        )
    }

    async function clientStartHandler(): Promise<void> {
        if (client) {
            await client.start({
                phoneNumber,
                password: userAuthParamCallback(password),
                phoneCode: userAuthParamCallback(phoneCode),
                onError: () => {},
            })
            localStorage.setItem(
                `${TELEGRAM_SESSION_PREFIX}_${phoneNumber}`,
                JSON.stringify(client.session.save()),
            )
            // setAuthorized(true)
        }
    }

    function inputChangeHandler({
        target: { name, value },
    }: BaseSyntheticEvent): void {
        setAuthInfo((authInfo) => ({ ...authInfo, [name]: value }))
    }

    function userAuthParamCallback<T>(param: T): () => Promise<T> {
        return async function () {
            return await new Promise<T>((resolve) => {
                resolve(param)
            })
        }
    }

    return (
        <>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={inputChangeHandler}
            />

            <input
                type="button"
                value="start client"
                onClick={sendCodeHandler}
            />

            <label htmlFor="phoneCode">Phone Code</label>
            <input
                id="phoneCode"
                type="text"
                name="phoneCode"
                value={phoneCode}
                onChange={inputChangeHandler}
            />

            <input
                type="button"
                value="insert code"
                onClick={clientStartHandler}
            />
        </>
    )
}

export default Auth
