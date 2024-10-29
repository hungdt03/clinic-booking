import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthResponse, UserResource } from "../../resources";

export type AuthState = {
    user?: UserResource;
    accessToken?: string;
    refreshToken?: string;
    isAuthenticated: boolean;
    isChangePassword: boolean;
    isInitialized: boolean;
}

export type InititalState = {
    isAuthenticated: boolean;
    user?: UserResource
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: undefined,
        refreshToken: undefined,
        isAuthenticated: false,
        user: undefined,
        isInitialized: false
    } as AuthState,
    reducers: {
        signIn: (state, action: PayloadAction<AuthResponse>) => {
            localStorage.setItem('accessToken', action.payload.accessToken!)
            localStorage.setItem('refreshToken', action.payload.refreshToken)
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.isAuthenticated = true
            state.isChangePassword = action.payload.user?.isPasswordChanged ?? false
        },
        signOut: (state) => {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')
            localStorage.removeItem('refreshToken')
            state.user = undefined
            state.accessToken = undefined
            state.refreshToken = undefined
            state.isAuthenticated = false
        },
        setUserDetails: (state, action: PayloadAction<UserResource>) => {
            state.user = action.payload
            state.isChangePassword = action.payload.isPasswordChanged ?? false
        },
        initialize: (state, action: PayloadAction<InititalState>) => {
            state.user = action.payload.user
            state.isChangePassword = action.payload.user?.isPasswordChanged ?? false
            state.isAuthenticated = action.payload.isAuthenticated;
            state.isInitialized = true;
        },
    }
});

export const selectAuth = (state: RootState) => state.auth;
export const { signIn, signOut, setUserDetails, initialize } = authSlice.actions;
export default authSlice.reducer;
