
const disclaimerClass = "disclaimer";
const showCategoriesButtonClass = "show-categories-btn";
const showAutomaticFormButtonId = "show-automatic-form";
const showManuallyFormButtonId = "show-manually-form";
const automaticFormId = "automatic-form";
const manuallyFormId = "manually-form";

function setElementVisibility(elementId, visible) {
    document.getElementById(elementId).style.display = visible ? "block" : "none";
}

function setElementVisibilityByClass(elementClass, visible) {
    document.querySelector(`.${elementClass}`).style.display = visible ? "block" : "none";
}

export function initCategories() {
    // Setup show manually form button click event    
    document.getElementById(showManuallyFormButtonId).addEventListener("click", function() {
        setElementVisibility(showAutomaticFormButtonId, false);
        setElementVisibility(automaticFormId, false);
        setElementVisibility(manuallyFormId, true);
        setElementVisibility(this.id, false);
        setElementVisibilityByClass(disclaimerClass, false);
    });

    // Setup show automatically form button click event
    document.getElementById(showAutomaticFormButtonId).addEventListener("click", function() {
        setElementVisibility(showManuallyFormButtonId, false);
        setElementVisibility(manuallyFormId, false);
        setElementVisibility(automaticFormId, true);
        setElementVisibility(this.id, false);
        setElementVisibilityByClass(disclaimerClass, false);
    });

    // Setup cancel buttons
    const cancelButtons = document.querySelectorAll(`.${showCategoriesButtonClass}`);
    cancelButtons.forEach(element => {
      element.addEventListener("click", function() {
        setElementVisibility(showManuallyFormButtonId, true);
        setElementVisibility(showAutomaticFormButtonId, true);
        setElementVisibility(manuallyFormId, false);
        setElementVisibility(automaticFormId, false);
        setElementVisibilityByClass(disclaimerClass, true);
      });
    });
}