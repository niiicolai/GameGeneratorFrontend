//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./utils/navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js"  //Will create the global Navigo object used below

import {
  setActiveLink, adjustForMissingHash, renderTemplate, loadHtml
} from "./utils/utils.js"

import InitHeader from "./components/header/header.js"

import { initGames } from "./pages/games/index.js"
import { initCreateGame } from "./pages/games/create.js"
import { initGameDetails } from "./pages/gamedetails/index.js"
import { initGameCode } from "./pages/gamecode/index.js"
import { initHome } from "./pages/home/index.js";
import { initLogin } from "./pages/login/login.js"

window.addEventListener("load", async () => {

  const templateIndex = await loadHtml("./pages/home/index.html")
  const templateGames = await loadHtml("./pages/games/index.html")
  const templateCreateGame = await loadHtml("./pages/games/create.html")
  const templateGameDetails = await loadHtml("./pages/gamedetails/index.html")
  const templateGameCode = await loadHtml("./pages/gamecode/index.html")
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html")
  const templateLogin = await loadHtml("./pages/login/login.html")

  adjustForMissingHash()

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Makes the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)   
        InitHeader()    
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      "/": () => {
        renderTemplate(templateIndex, "content")
        initHome()
      },
      "/games": (match) => {
        renderTemplate(templateGames, "content")
        initGames(1, match)
      },
      "/games/create": () => {
        renderTemplate(templateCreateGame, "content")
        initCreateGame()
      },
      "/gamedetails/:id": ({data}) => {
        renderTemplate(templateGameDetails, "content")
        initGameDetails(data.id)
      },
      "/gamecode/:id/:language": ({data}) => {
        renderTemplate(templateGameCode, "content")
        initGameCode(data.id, data.language)
      },
      "/login": () => {
        renderTemplate(templateLogin, "content")
        initLogin()
      }
    })
    .notFound(() => {
      renderTemplate(templateNotFound, "content")
    })
    .resolve()
});



window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
    + ' Column: ' + column + ' StackTrace: ' + errorObj);
}