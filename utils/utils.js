  export async function handleHttpErrors(res) {
    if (!res.ok) {
      const errorResponse = await res.json();
      const error = new Error(errorResponse.message)
      // @ts-ignore
      error.fullResponse = errorResponse
      throw error
    }
    return res.json()
  }
 
  
export function renderTemplate(template, contentId) {
  const content = document.getElementById(contentId)
  if (!content) {
    throw Error("No Element found for provided content id")
  }
  content.innerHTML = ""
  content.append(template)
}

export async function loadHtml(page) {
  const resHtml = await fetch(page).then(r => {
    if (!r.ok) {
      throw new Error(`Failed to load the page: '${page}' `)
    }
    return r.text()
  });
  const parser = new DOMParser()
  const content = parser.parseFromString(resHtml, "text/html")
  const div = content.querySelector(".template")
  if (!div) {
    throw new Error(`No outer div with class 'template' found in file '${page}'`)
  }
  return div
};

export function adjustForMissingHash() {
  let path = window.location.hash
  if (path == "") { //Do this only for hash
    path = "#/"
    window.history.pushState({}, path, window.location.href + path);
  }
}

export function setActiveLink(topnav, activeUrl) {
  const links = document.getElementById(topnav).querySelectorAll("a");
  links.forEach(child => {
    child.classList.remove("active")
    //remove leading '/' if any
    if (child.getAttribute("href").replace(/\//, "") === activeUrl) {
      child.classList.add("active")
    }
  })
}

export async function fetchPostJsonFormData(URL, form, event, token = null) {
  let formElement = /** @type {HTMLFormElement} */ (form);
  event.preventDefault();
  const formData = new FormData(formElement);
  const dataFromForm = {};
  formData.forEach((value, key) => dataFromForm[key] = value);

  const options = {
    method: 'POST',
    body: JSON.stringify(dataFromForm),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  const addedData = await fetch(URL, options)
   .then(handleHttpErrors);
   return addedData;
}

export async function fetchGetJson(URL) {
  try {
    const data = await fetch(URL)
    .then(handleHttpErrors)
    console.log("Data: ", data)
    return data;
  } catch (error) {
    if(error.fullResponse) {
      console.error("Error: ", error.fullResponse)
    }
  }
}



export async function fetchGetImage(URL)  {
  try {
    const response = await fetch(URL);
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    const buffer = await response.arrayBuffer();
    const base64Image = btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
  
    const imgElement = document.createElement('img');
    imgElement.src = `data:image/png;base64,${base64Image}`;
    
    const imageContainer = document.getElementById('image-container');
    imageContainer.appendChild(imgElement);
   
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

export function sanitizeStringWithTableRows(tableRows) {
  // @ts-ignore
  let secureRows = DOMPurify.sanitize("<table>" + tableRows + "</table>")
  secureRows = secureRows.replace("<table>", "").replace("</table>", "")
  return secureRows
}

export function sanitizeStringWithList(listGame) {
  let secureList = DOMPurify.sanitize("<li>" + listGame + "</li>")
  secureList = secureList.replace("<li>", "").replace("</li>", "")
  return secureList
}

export function sanitizeStringWithParagraph(pGame) {
  let secureP = DOMPurify.sanitize("<p>" + pGame + "</p>")
  secureP = secureP.replace("<p>", "").replace("</p>", "")
  return secureP
}

export function encode(str) {
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  return str;
}


