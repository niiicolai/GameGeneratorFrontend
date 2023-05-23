import { sanitizeStringWithParagraph } from "../../utils/utils.js";
import { API_URL } from "../../utils/settings.js";
import { fetchPostJsonFormData } from "../../utils/utils.js";
import { refreshCredits, hasAnyCredits } from "../../utils/credit.js";
import { isAuthenticated } from "../../utils/auth.js";
import { initCategories } from "./create_categories.js";

let isEventListenersAdded = false;

export async function initCreateGame() {
    // Show the unauthenticated message if the user is not authenticated
    document.getElementById("generator-unauthenticated").style.display = isAuthenticated() ? "none" : "block";
    // Or show the generator if the user is authenticated
    document.getElementById("generator-wrapper").style.display = isAuthenticated() ? "block" : "none";    
    // Setup categories
    initCategories();

    const spinner = document.getElementById("spinner");
    const stringList = document.getElementById("created-game");
    const generateForm = document.getElementById("generate-form");
    const createForm = document.getElementById("create-form");
    
    stringList.innerHTML = "";
    spinner.style.display = "none";

    if (!isEventListenersAdded) {
        generateForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            createGame("generated", generateForm, event);
        });
        createForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            createGame("user", createForm, event);
        });
        isEventListenersAdded = true;
    }
}

async function createGame(generatedOrUser, form, event) {
  if (!hasAnyCredits()) {
    alert("You don't have any credits left. Please buy more credits.");
    return;
  }

  const token = localStorage.getItem("jwtToken")
  
  const spinner = document.getElementById("spinner");
  const stringList = document.getElementById("created-game");
  const generateButton = document.getElementById("generate");
  const createButton = document.getElementById("create");
  createButton.disabled = true;
  createButton.classList.remove("btn-success")
  generateButton.disabled = true;
  generateButton.classList.remove("btn-success")
  spinner.style.display = "block";
  stringList.style.display = "none";

  await fetchPostJsonFormData(API_URL + `gameidea/create/${generatedOrUser}`, form, event, token)
    .then(game => {
      const dataUrl = "data:image/png;base64," + game.image;
    
      const listGame = 
      `<h2>${game.title}</h2>
      <img src="${dataUrl}" style="width: 512px; height: 512px;"> 
      <p style="font-size: 0.8em;text-align: left;margin-left: 2em;margin-right: 2em;">
      <strong>Description:</strong> ${game.description} <br>
      <strong>Genre:</strong> ${game.genre} <br>
      <strong>You play as:</strong> ${game.player} <br>
      <p><a href="#/gamedetails/${game.id}"><button class="btn-success">Game info</button></a></p>
      </p><br>`; 

      const okP = sanitizeStringWithParagraph(listGame);
      stringList.innerHTML = okP;

      spinner.style.display = "none";
      stringList.style.display = "block";
      createButton.disabled = false;
      createButton.classList.add("btn-success")
      generateButton.disabled = false;
      generateButton.classList.add("btn-success")

      refreshCredits();
    })
    .catch(error => {
      console.error(error);
      stringList.innerHTML = error;
      spinner.style.display = "none";
      stringList.style.display = "block";
      createButton.disabled = false;
      createButton.classList.add("btn-success")
      generateButton.disabled = false;
      generateButton.classList.add("btn-success")
    });
}