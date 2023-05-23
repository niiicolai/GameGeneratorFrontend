import { API_URL } from "../../utils/settings.js"
import { fetchGetJson } from "../../utils/utils.js"
const URL = API_URL + "gameidea/public/"
import { paginator } from "../../lib/pagination/paginate-bootstrap.js"
const SIZE = 10
/* const TOTAL = Math.ceil(1000 / SIZE) */

let initialized = false;
let filterData = false;

let TOTAL = 0;

const navigoRoute = "games";

let games = [];
let genre = "";
let backendQuery = "";
let queryString = "";

let sortField = "title";
let sortOrder = "desc";

function handleSort(headerText, pageNo, match) {
  sortOrder = sortOrder == "asc" ? "desc" : "asc";
  sortField = headerText;
  initGames(pageNo, match);
}


export async function initGames(pg, match) {
  

  const p = match?.params?._page || pg  //To support Navigo
  let pageNo = Number(p)

  if (!initialized) {
  document.querySelector('.table-header').addEventListener('click', function (event) {
    event.preventDefault();
    const target = event.target;
    if (target.tagName === 'A') {
      // Handle click on link in table header
      const headerId = target.id;
      let sortField = headerId.replace('header-', '');
      handleSort(sortField, pageNo, match);
    }})
    initialized = true
  }



    let backendPage = pageNo -1;

    document.getElementById("button-filter").onclick = async function (evt) {
      evt.preventDefault();
      genre = document.getElementById("genre-filter").value;
      filterData = true;
      initGames(pg, match);
    }

  if(!filterData){
    queryString = `?size=${SIZE}&page=${pageNo}&sort=${sortField},${sortOrder}`

    backendQuery = `?size=${SIZE}&page=${backendPage}&sort=${sortField},${sortOrder}`

    games = await fetchGetJson(URL + "get-all" + backendQuery);
    TOTAL = Math.ceil(await getCount() / SIZE);
  }
  else{
    queryString = `?size=${SIZE}&page=${pageNo}&sort=${sortField},${sortOrder}&genre=${genre}`
    backendQuery = `?size=${SIZE}&page=${backendPage}&sort=${sortField},${sortOrder}&genre=${genre}`;
    games = await fetchGetJson(URL + `genre/${genre}` + backendQuery);
    TOTAL = Math.ceil(await getCountByGenre(genre) / SIZE);
  }


  fillTable(games);


  document.getElementById("button-reset").onclick = async function (evt) {
    evt.preventDefault();
    filterData = false;
    initGames(pg, match)
  }


          // (C1-2) REDRAW PAGINATION
  paginator({
    target: document.getElementById("game-paginator"),
    total: TOTAL,
    current: pageNo,
    click: initGames
  });
  //Update URL to allow for CUT AND PASTE when used with the Navigo Router
  //callHandler: false ensures the handler will not be called again (twice)
  window.router?.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
  }


  async function getCount(){
    var count = 0;
    try {
      count = await fetch(`${API_URL}gameidea/public/count`)
        .then(res => res.json())
    } catch (e) {
      console.error(e)
    }
    return count;
  }

  async function getCountByGenre(genre){
    var count = 0;
    try {
      count = await fetch(`${API_URL}gameidea/public/count/genre/${genre}`)
        .then(res => res.json())
    } catch (e) {
      console.error(e)
    }
    return count;


  }
  
  function fillTable(games){
    const tbody = document.getElementById("table-rows");
    const rows = games.map(game => `
    <tr>
      <td>${game.title}</td>
      <td>${game.description.slice(0, 50)}${game.description.length > 50 ? '...' : ''}</td>
      <td>${game.genre}</td>
      <td>${game.player}</td>
      <td>${Math.floor(game.totalRatingInPercent)}%</td>
      <td>${game.numberOfRatings}</td>
      <td><a href="#/gamedetails/${game.id}" class="btn btn-sm btn-success">Game info</a></td>
    </tr>
  `);
  tbody.innerHTML = rows.join("");
  }

  