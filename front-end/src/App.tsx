import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './router'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './app/store'
import { useEffect } from 'react'
import { getAccessToken } from './utils/auth'
import { initialize } from './features/slices/auth-slice'
import userService from './services/user-service'

function App() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        (async () => {
            const accessToken = getAccessToken();
            if (!accessToken) {
                return dispatch(initialize({
                    isAuthenticated: false, user: undefined
                }));
            }
            try {
                const response = await userService.getProfile();
                console.log('Reload page: ')
                console.log(response)
                if (response.success) {
                    dispatch(initialize({ isAuthenticated: true, user: response.data }));
                } else {
                    dispatch(initialize({
                        isAuthenticated: false, user: undefined
                    }));
                }

            } catch {
                dispatch(initialize({ isAuthenticated: false, user: undefined }));
            }
        })();

    }, []);

    return <RouterProvider router={router} />

}

export default App
