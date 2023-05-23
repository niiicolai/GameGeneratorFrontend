import { API_URL } from "../../utils/settings.js";
import { fetchGetJson,
         sanitizeStringWithParagraph } from "../../utils/utils.js";

export async function initGameCode(id, language){
    console.log(id, language)
    const gameCodeDiv = document.getElementById("code-data")
    const game = await fetchGetJson(API_URL + `gameidea/public/get/${id}`);
    const gameCodes = await fetchGetJson(API_URL + `gamecode/public/get/${id}`);

    let gameCodeHtml = ''
    // Build game code HTML
    if (gameCodes && gameCodes.length > 0) {
        for (let i = 0; i < gameCodes.length; i++) {
            if (game.id == id && gameCodes[i].codeLanguage.language == language) {
                gameCodeHtml += `<h2 style="justify-content: center; text-align: center;"><strong>${game.title} ${gameCodes[i].codeLanguage.language.charAt(0).toUpperCase() + gameCodes[i].codeLanguage.language.slice(1)} game code:</strong></h2>`;
                for (let o = 0; o < gameCodes[i].codeClasses.length; o++) {
                    gameCodeHtml += `
                    <hr>
                    <p style="font-size: 0.8em;text-align: center;">
                      <button class="btn btn-dark" data-toggle="collapse" data-target="#code-${o}" aria-expanded="false" aria-controls="code-${o}">
                        <strong>${gameCodes[i].codeClasses[o].name}${gameCodes[i].codeLanguage.fileExtension}</strong>
                      </button>
                    </p>
                    <div class="collapse" id="code-${o}">
                      <pre><code style="font-size: 0.6em">${gameCodes[i].codeClasses[o].code}</code></pre>
                    </div>`;
                }
            }
        }
    }
    const okGeneratedCode = sanitizeStringWithParagraph(gameCodeHtml);
    gameCodeDiv.innerHTML = okGeneratedCode;

    hljs.highlightAll()
}