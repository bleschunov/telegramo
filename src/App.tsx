import React, {type BaseSyntheticEvent, useEffect, useState} from 'react'
import client from './client.ts'
import Home from "./Home.tsx";

interface IInitialState {
  phoneNumber: string
  password: string
  phoneCode: string
}

const initialState: IInitialState = { phoneNumber: '', password: '', phoneCode: '' } // Initialize component initial state

const App: React.FC = () => {
    const [isAuthorized, setAuthorized] = useState<boolean>(false)
    const [{ phoneNumber, password, phoneCode }, setAuthInfo] = useState<IInitialState>(initialState)

    useEffect(() => {
        (async () => {
            await client.connect()
            setAuthorized(await client.isUserAuthorized())
        })()
    }, [])

    async function sendCodeHandler (): Promise<void> {
        await client.connect() // Connecting to the server
        await client.sendCode(
            {
                apiId: parseInt(import.meta.env.VITE_API_ID),
                apiHash: import.meta.env.VITE_API_HASH
            },
            phoneNumber
        )
    }

    async function clientStartHandler (): Promise<void> {
        await client.start({ phoneNumber, password: userAuthParamCallback(password), phoneCode: userAuthParamCallback(phoneCode), onError: () => {} })
        localStorage.setItem('session', JSON.stringify(client.session.save())) // Save session to local storage
        setAuthorized(true)
    }

    function inputChangeHandler ({ target: { name, value } }: BaseSyntheticEvent): void {
        setAuthInfo((authInfo) => ({ ...authInfo, [name]: value }))
    }

    function userAuthParamCallback <T> (param: T): () => Promise<T> {
        return async function () {
            return await new Promise<T>(resolve => {
                resolve(param)
            })
        }
    }

    const AuthorizationForm = (
        <>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={inputChangeHandler}
            />

            <input type="button" value="start client" onClick={sendCodeHandler} />

            <label htmlFor="phoneCode">Phone Code</label>
            <input
                id="phoneCode"
                type="text"
                name="phoneCode"
                value={phoneCode}
                onChange={inputChangeHandler}
            />

            <input type="button" value="insert code" onClick={clientStartHandler} />
        </>
    )

    return isAuthorized ? <Home /> : AuthorizationForm
}

export default App
