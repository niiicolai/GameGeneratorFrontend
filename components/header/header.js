import { isAuthenticated, removeToken, isExpired } from "../../utils/auth.js"
import { getCredits, removeCredits } from "../../utils/credit.js";

function createLink(href, text) {
    const link = document.createElement("a");
    link.href = href;
    link.innerHTML = text;
    link.classList.add("nav-link");

    return link;
}

function refreshCreditsView() {        
    const wrapper = document.getElementById("credits");    
    wrapper.innerHTML = "";    

    if (!isAuthenticated()) {
        return;
    }
            
    const credits = getCredits();    
    const creditsView = document.createElement("span");
    creditsView.innerHTML = `<i class="fa-solid fa-coins"></i> ${credits}`;
    wrapper.className = credits > 0 ? "success" : "danger";
    wrapper.appendChild(creditsView);
}

function logout() {
    if (isAuthenticated()) {
        removeToken();
        removeCredits();
    }

    window.router.navigate("/login");
}

export default function InitHeader() {
    if (isAuthenticated() && isExpired()) {
        alert("Your session has expired. Please login again.");
        logout();
    }

    
    refreshCreditsView();

    const link = isAuthenticated() ? createLink("#", "Logout") : createLink("#login", "Login");
    document.getElementById("auth-link").innerHTML = link.outerHTML;
        document.getElementById("auth-link").querySelector("a").addEventListener("click", function (e) {
            e.preventDefault();

            logout();
        });
}