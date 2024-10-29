import { AuthState } from "../features/slices/auth-slice"
import { AuthResponse, UserResource } from "../resources"

export function getAuthInfo() {
    const authString = localStorage.getItem('user')
    const auth = (authString ? JSON.parse(authString) : {}) as UserResource
    return auth
}

export function getAccessToken() {
    const authString = localStorage.getItem('accessToken')
    return authString ?? ""
}

export function getRefreshToken() {
    const authString = localStorage.getItem('refreshToken')
    return authString ?? ""
}

export function getClinic() {
    const authString = localStorage.getItem('clinic')
    return authString ?? ""
}

export function getIntitialAuthState() : AuthState {
    const user = getAuthInfo()
    return {
        accessToken: getAccessToken(),
        user,
        isAuthenticated: Object.keys(user).length > 0
    } as AuthState
}