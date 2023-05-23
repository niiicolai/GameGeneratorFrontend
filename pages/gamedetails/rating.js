import { API_URL } from "../../utils/settings.js";

/**
 * The error message to display when the 
 * user has already rated the game idea.
 * 
 * @type {string}
 * @private
 */
const ALREADY_RATED_ERROR = "You have already rated this game idea.";

/**
 * The error message to display when 
 * something went wrong.
 * 
 * @type {string}
 * @private
 */
const SOMETHING_WENT_WRONG_ERROR = "Something went wrong!";

/**
 * hasRated is used to prevent users from rating the same 
 * game idea multiple times without reloading the page,
 * or moving to another game idea.
 * 
 * @type {boolean}
 * @private
 */
let hasRated = false;

/**
 * The class name for the star element.
 * 
 * @type {string}
 * @private
 */
const starObjectClass = "fa-star";

/**
 * The class name for the star container element.
 * 
 * @type {string}
 * @private
 */
const starContainerClass = "star-container";

/**
 * The class name for the star container element when rated.
 * This is used to prevent the visual effect of hovering over
 * the stars when the user has already rated the game idea.
 * 
 * @type {string}
 * @private
 */
const starContainerRatedClass = "rated";

/**
 * The class name for a checked star element.
 * 
 * @type {string}
 * @private
 */
const checkedClass = "checked";

/**
 * The id for the rating output element.
 * 
 * @type {string}
 * @private
 */
const ratingOutputId = "rating";

/**
 * Create a rating for a game idea.
 * 
 * @param {object} rating
 * @returns Promise
 * @private
 */
function createRating(rating) {
    return fetch(API_URL + "game-ratings", {
        method: "POST",
        body: JSON.stringify(rating),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

/**
 * Handle the click event on a star.
 * 
 * @param {number} i
 * @param {number} id
 * @returns void
 * @private
 */
function onStarsClick(i, id) {
    // Prevent the user from rating the same game idea multiple times.
    if (hasRated) {
        console.log(ALREADY_RATED_ERROR);
        return;
    }

    // Calculate the score based on the index.
    const score = 5 - i;

    // Create the rating object sent to the API.
    const rating = {
        gameIdeaId: id,
        score,
    };

    // Complete the rating.
    completeRating(rating);
}

/**
 * Send the rating to the API and update the UI.
 * 
 * @param {object} rating
 * @returns void
 * @private
 */
function completeRating(rating) {
    createRating(rating)
        .then((res) => res.json())
        .then((data) => {
            if (data) {
                setRatingOutput(data);
                setContainerRated(true);
                colorStarsBasedOnRating(rating.score);

                // Prevent the user from rating the same game idea multiple times.
                hasRated = true;
            }
            else {
                alert(SOMETHING_WENT_WRONG_ERROR);
            }
        })
        .catch((err) => {
            alert(err);
        });
}

/**
 * Set the rating output.
 * 
 * @param {number} rating
 * @returns void
 * @private
 */
function setRatingOutput(data) {
    // Set new rating
    const ratingOutput = document.getElementById(ratingOutputId);
    if (ratingOutput) {
        ratingOutput.innerHTML = `${Math.floor(data.totalScoreInPercent)}%`;
    }

    // Set new rating count
    const ratingCountOutput = document.getElementById("rating-count");
    if (ratingCountOutput) {
        ratingCountOutput.innerHTML = `${data.numberOfRatings}`;
    }
}

/**
 * Set or remove the container rated class.
 * 
 * @param {boolean} rated
 * @returns void
 * @private
 */
function setContainerRated(rated) {
    const container = document.querySelector(`.${starContainerClass}`);
    if (container) {
        if (rated) {
            container.classList.add(starContainerRatedClass);
        }
        else {
            container.classList.remove(starContainerRatedClass);
        }
    }
}

/**
 * Remove the checked class from all stars.
 * 
 * @returns void
 * @private
 */
function removeCheckedClass() {
    document.querySelectorAll(`.${starObjectClass}`).forEach((star) => {
        star.classList.remove(checkedClass);
    });
}

/**
 * Color stars based on rating.
 * 
 * @param {number} rating
 * @returns void
 * @private
 */
function colorStarsBasedOnRating(rating) {
    console.log(rating);
    const stars = document.querySelectorAll(`.${starObjectClass}`);
    // Color stars based on rating
    for (let i = 0; i < rating; i++) {
        const index = 4 - i;
        stars[index].classList.add(checkedClass);
    }
}

/**
 * Initialize the rating.
 * 
 * @returns void
 * @public
 */
export function initRating(id) {
    setContainerRated(false);
    removeCheckedClass();

    // Reset every time we initialize the rating,
    // so that we can rate games when switching between them.
    hasRated = false;

    // Get all stars
    const stars = document.querySelectorAll(`.${starObjectClass}`);
    // Add event listener to each star and increase rating by 1 for each star
    for (let i = 0; i < stars.length; i++) {
        if (!hasRated) {
            // Note: because we override the onclick function, instead
            // of using the addEventListener method, we avoid having
            // multiple event listeners on the same element.
            //
            // Why not use addEventListener? Because we want to be able
            // to update the id being passed to the onStarsClick function,
            // when showing another game idea.
            stars[i].onclick = () => onStarsClick(i, id);
        }
    }
}