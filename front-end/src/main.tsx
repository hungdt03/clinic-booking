import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import store from './app/store.ts'
import NotificationProvider from './app/context/notification-firebase-cloud-messaging/notification-provider.tsx'

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#1975DC',
                // fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
            },
            components: {
                Menu: {
                    colorText: 'white'
                }
            }
        }}>
            <Provider store={store}>
                <NotificationProvider>
                    <App />
                </NotificationProvider>
            </Provider>
        </ConfigProvider>
    // </StrictMode >,
)
