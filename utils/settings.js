// Check if the API is running locally or on Azure and set the API_URL accordingly
export const HOST_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ?
    "http://localhost:8080/" :
    "https://game-generator.bergandersen.net/"

export const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ?
    HOST_URL + "api/" :
    HOST_URL + "api/"

export const FETCH_NO_API_ERROR = " (Is the API online or does the endpoint exist?)" 