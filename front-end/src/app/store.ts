import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/slices/auth-slice'

const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export default store