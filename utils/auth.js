
function parseToken(token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64))
}

export function setToken(token) {
    localStorage.setItem("jwtToken", token)
}

export function getToken() {
    return localStorage.getItem("jwtToken")
}

export function removeToken() {
    localStorage.removeItem("jwtToken")
}

export function isExpired() {
    const token = getToken()
    if (token != null) {
        const parsedToken = parseToken(token)
        const expires = parsedToken.exp
        const now = Date.now() / 1000
        return expires < now
    }
    return true
}

export function isAuthenticated() {
    const token = getToken()
    return token != null
}