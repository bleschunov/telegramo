import React from 'react'
import Home from "./pages/Home.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Auth from "./pages/Auth.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/auth",
        element: <Auth />,
    },
]);

const App: React.FC = () => {
    return <RouterProvider router={router} />
}

export default App
