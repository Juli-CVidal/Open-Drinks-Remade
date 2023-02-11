/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/*===== MENU SHOW =====*/
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
    navToggle.style.opacity = 0;
  });
}

/*===== MENU HIDDEN =====*/
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
    navToggle.style.opacity = 1;
  });
}

/*=============== REMOVE MENU MOBILE ===============*/
const NAVIGATION_LINKS = document.querySelectorAll(".nav__link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navToggle.style.opacity = 1;
  navMenu.classList.remove("show-menu");
};
NAVIGATION_LINKS.forEach((n) => n.addEventListener("click", linkAction));

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

function getIngredients(drinkResponse) {
  const INGREDIENT_MEASURES = {};
  for (let index = 1; index <= 15; index++) {
    const ingredient = drinkResponse[`strIngredient${index}`];
    if (!ingredient) {
      break;
    }
    INGREDIENT_MEASURES[drinkResponse[`strIngredient${index}`]] =
      drinkResponse[`strMeasure${index}`];
  }

  const ingredient_container = document.getElementById("ingredients");
  const ul = document.createElement("ul");
  Object.entries(INGREDIENT_MEASURES).map(([ingredient, measure]) => {
    const li = document.createElement("li");
    li.textContent = `${measure} ${ingredient}`;
    ul.appendChild(li);
  });

  ingredient_container.appendChild(ul);
}

function getSteps(steps) {
  const STEP_LIST = steps.split(".");
  const STEP_CONTAINER = document.getElementById("steps");

  STEP_LIST.forEach((step) => {
    const p = document.createElement("p");
    p.innerText = step;
    STEP_CONTAINER.appendChild(p);
  });
}

function createPage(data) {
  document.getElementById(
    "drink__image"
  ).style.backgroundImage = `url(${data.strDrinkThumb})`;
  document.getElementById("drink__name").innerText = data.strDrink;

  getIngredients(data);
  getSteps(data.strInstructions);
}

function getDrink() {
  fetch(API_URL + localStorage.getItem("id"))
    .then((response) => response.json())
    .then((data) => {
      createPage(data.drinks[0]);
    })
    .catch((error) => {
      console.error(error);
    });
}

getDrink();
