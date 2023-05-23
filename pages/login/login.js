import { API_URL } from "../../utils/settings.js";
import { setToken, isExpired } from "../../utils/auth.js";
import { refreshCredits } from "../../utils/credit.js";

let initialized = false;

function login(username, password) {
    return fetch(API_URL + "auth", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function initLogin() {
    if (!initialized) {
        if (isExpired()) {
            document.getElementById("login-form").addEventListener("submit", function (e) {
                e.preventDefault();
    
                const formData = new FormData(e.target);
                const username = formData.get("username");
                const password = formData.get("password");
    
                login(username, password)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.jwt) {
                            setToken(data.jwt);                            
                            e.target.querySelector("input[type='text']").value = "";
                            e.target.querySelector("input[type='password']").value = "";
                            refreshCredits()
                                .then(() => {
                                    window.router.navigate("/");
                                });
                        }
                        else {
                            alert("Invalid username or password!");
                        }
                        
                    })
                    .catch((err) => {
                        alert(err);
                    });
            });
        } else {
            document.getElementById("login-form").innerHTML = "You are already logged in!";
        }
        initialized = true;
    }
}