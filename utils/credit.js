import { API_URL } from "./settings.js"
import { getToken } from "./auth.js";

/**
 * Set the credits in local storage.
 * 
 * @param {number} credits
 * @returns void 
 */
function setCredits(credits) {
    credits = Number(credits);

    // Throw an error if credits is not a number
    if (isNaN(credits)) {
        throw new Error("Credits must be a number!");
    }

    localStorage.setItem("credits", credits);
}

/**
 * Remove the credits from local storage.
 * 
 * @returns void
 */
export function removeCredits() {
    localStorage.removeItem("credits");
}

/**
 * Get the credits from local storage.
 * 
 * @returns {number}
 */
export function getCredits() {
    const credits = Number(localStorage.getItem("credits"));
    return isNaN(credits) ? 0 : credits;
}

/**
 * Return true if the user has any credits.
 * 
 * @returns {boolean}
 */
export function hasAnyCredits() {
    const credits = getCredits();
    return credits > 0;
}

/**
 * Check if the user has enough credits
 * by sending a request to the server.
 * 
 * @returns {Promise<>}
 */
export function refreshCredits() {
    const token = getToken();
    if (token == null) {
        return Promise.reject("No token found!");
    }

    return fetch(`${API_URL}users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        setCredits(data.credits);
        return data.credits;
    })
    .catch((err) => {
        alert(err);
    });
}