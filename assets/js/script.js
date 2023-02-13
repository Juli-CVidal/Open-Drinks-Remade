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

/*=============== SWIPER SLIDES ===============*/

let swiperProjects = new Swiper(".home__container", {
  spaceBetween: 10,

  effect: "fade",
  speed: 750,
  coverflowEffect: {
    rotate: 30,
    slideShadows: false,
  },
  loop: true,
  autoplay: {
    delay: 5_000, //five seconds
    disableOnInteraction: false,
  },
  slidesPerView: 1,
});

/*===============  CATALOGUE ===============*/
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
const DRINKS_CONTAINER = document.getElementById("drinks");
let options_swiper;
let lastSelected = "All";
let searchInput;
let DRINK_LIST = [];
let filteredList = [];

// RELATED TO OPTIONS
const FETCH_CATEGORIES = [
  "Beer",
  "Cocktail",
  "Cocoa",
  "Coffee / Tea",
  "Homemade Liqueur",
  "Other / Unknown",
  "Ordinary Drink",
  "Punch / Party Drink",
  "Shake",
  "Shot",
  "Soft Drink",
];
const DRINK_CATEGORIES = FETCH_CATEGORIES.map((category) => {
  if (category.length == 1) {
    return category;
  }
  let formattedCategory = category.split(" / ");
  return formattedCategory.slice(0, 2).join("-");
});
DRINK_CATEGORIES.push("Non-Alcoholic");

function createOptions() {
  const OPTION_CONTAINER = document.getElementById("options-slider");
  const container = document.createElement("div");
  container.classList.add("swiper-wrapper");

  DRINK_CATEGORIES.forEach((category) => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    const option = document.createElement("li");
    option.classList.add("option");
    option.id = category;
    option.textContent = category.split("-").join(" ");

    slide.appendChild(option);
    container.appendChild(slide);
  });
  OPTION_CONTAINER.appendChild(container);

  /*SWIPER FOR OPTIONS*/
  options_swiper = new Swiper("#options-slider", {
    slidesPerView: "auto",
    spaceBetween: 10,
    freeMode: true,
  });
}

//RELATED TO FILTER
function getPreviousFilter() {
  searchInput.value = localStorage.getItem("lastSearch") || "";

  return localStorage.getItem("category") || "All";
}

function filterByName(name) {
  DRINKS_CONTAINER.innerHTML = "";
  let listToShow =
    name == ""
      ? filteredList
      : filteredList.filter((drink) =>
          drink.strDrink.toLowerCase().startsWith(name.toLowerCase())
        );

  listToShow.forEach((drink) => {
    DRINKS_CONTAINER.appendChild(createCard(drink));
  });
}

function initSearchInput() {
  searchInput = document.getElementById("search");
  searchInput.addEventListener("keyup", () => {
    filterByName(searchInput.value);
  });
}

function filterByCategory(category) {
  filteredList = DRINK_LIST;
  if (category !== "All") {
    filteredList = filteredList.filter((drink) => drink.category === category);
  }
  filterByName(searchInput.value);
}

function initFilters() {
  filterByCategory(lastSelected);
  const options = document.querySelectorAll(".option");

  options.forEach((option) => {
    option.addEventListener("click", function () {
      if (this.id !== lastSelected) {
        const lastSelectedOption = document.getElementById(lastSelected);
        if (lastSelectedOption?.classList.contains("selected")) {
          lastSelectedOption.classList.remove("selected");
        }
        this.classList.add("selected");
        lastSelected = this.id;
        filterByCategory(lastSelected);
      }
    });
  });
}

//RELATED TO CATALOGUE

function goToDetails(id) {
  localStorage.setItem("DRINK_LIST", JSON.stringify(DRINK_LIST));
  localStorage.setItem("id", id);
  localStorage.setItem("category", lastSelected);
  localStorage.setItem("lastSearch", searchInput.value);
  window.location.href = "details.html";
}

{
  /* <div class="card">
        <div class="card__image one"></div>
        <div class="card__description">
          <h1 class="drink__name">Title</h1>
          <p class="drink__category">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
      </div> */
}
function createCard(drink) {
  const card = document.createElement("div");
  card.id = drink.idDrink;
  card.className = "card";
  card.innerHTML = `<div class="card__image"></div>
        <div class="card__description">
          <h1 class="drink__name">${drink.strDrink}</h1>
          <p class="drink__category">
            ${drink.category}
          </p>
        </div>;
        `;
  card.querySelector(
    ".card__image"
  ).style.backgroundImage = `url(${drink.strDrinkThumb})`;
  card.addEventListener("click", () => {
    goToDetails(drink.idDrink);
  });
  return card;
}

async function getDrinksFromAPI() {
  let drinks = [];
  try {
    const promises = FETCH_CATEGORIES.map((category) =>
      fetch(`${API_URL}c=${category}`).then((response) => response.json())
    );
    const lists = await Promise.all(promises);
    lists.forEach((list, index) => {
      drinks = drinks.concat(
        list.drinks.map((item) => ({
          ...item,
          category: DRINK_CATEGORIES[index],
        }))
      );
    });

    const response = await fetch(`${API_URL}a=Non_Alcoholic`);
    const nonAlcoholic = await response.json();
    drinks = drinks.concat(
      nonAlcoholic.drinks.map((item) => ({
        ...item,
        category: "Non-Alcoholic",
      }))
    );

    drinks.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
    return drinks;
  } catch (error) {
    console.error(error);
  }
}

function getDrinkList() {
  const LIST_ON_STORAGE = localStorage.getItem("DRINK_LIST");
  if (LIST_ON_STORAGE) {
    return JSON.parse(LIST_ON_STORAGE);
  }
  return getDrinksFromAPI();
}

async function init() {
  createOptions();
  initSearchInput();
  initFilters();

  DRINK_LIST = await getDrinkList();
  lastSelected = getPreviousFilter();
  const SELECTED_OPTION = document.getElementById(lastSelected);
  SELECTED_OPTION.classList.add("selected");
  filterByCategory(lastSelected);
}

init();
