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
const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

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
    delay: 10_000, //ten seconds
    disableOnInteraction: false,
  },
  slidesPerView: 1,
});

/*===============  CATALOGUE ===============*/
/*SWIPER FOR OPTIONS*/
var options_swiper = new Swiper("#options-slider", {
  slidesPerView: "auto",
  spaceBetween: 10,
  freeMode: true,
});

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
const DRINKS_CONTAINER = document.getElementById("drinks");
let lastSelected = "All";
let DRINK_LIST = [];
let drinks;
let filteredList;

const FETCH_CATEGORIES = [
  "Beer",
  "Cocktail",
  "Shot",
  "Coffee / Tea",
  "Homemade Liqueur",
];
const DRINK_CATEGORIES = [
  "Beer",
  "Cocktail",
  "Shot",
  "Coffee-Tea",
  "Homemade-Liqueur",
  // "Non-Alcoholic",
];

function goToDetails(id) {
  localStorage.setItem("DRINK_LIST", JSON.stringify(DRINK_LIST));
  window.location.href = `/drink_details/${id}`;
}

const createCard = (drink) => {
  const card = document.createElement("div");
  card.id = drink.idDrink;
  card.className = "card";
  card.innerHTML = `
    <div class="card__img" style="background-image: url(${drink.strDrinkThumb})"></div>
    <a class="card__link" href="#">
      <div class="card__img--hover" style="background-image: url(${drink.strDrinkThumb})"></div>
      <div class="card__info">
        <span class="card__category">${drink.category}</span>
        <h3 class="card__title">${drink.strDrink}</h3>
      </div>
    </a>
  `;
  card.querySelector(".card__link").addEventListener("click", (e) => {
    e.preventDefault();
    goToDetails(drink.idDrink);
  });
  return card;
};

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
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("keyup", () => {
    filterByName(searchInput.value);
  });
}

function filterByCategory(category) {
  DRINKS_CONTAINER.innerHTML = "";
  let filteredCards = DRINK_LIST;
  if (category !== "All") {
    filteredCards = DRINK_LIST.filter((card) => {
      return card.querySelector(".card__category").innerHTML === category;
    });
  }
  filteredCards.forEach((card) => {
    DRINKS_CONTAINER.appendChild(createCard(card));
  });
}

function initFilters() {
  filterByCategory(lastSelected);
  const options = document.querySelectorAll(".option");

  options.forEach((option) => {
    option.addEventListener("click", function () {
      if (this.id !== lastSelected) {
        const lastSelectedOption = document.getElementById(lastSelected);
        if (
          lastSelectedOption &&
          lastSelectedOption.classList.contains("selected")
        ) {
          lastSelectedOption.classList.remove("selected");
        }
        this.classList.add("selected");
        lastSelected = this.id;
        filterByCategory(lastSelected);
      }
    });
  });
}

function getAllDrinks() {
  const promises = [];
  let drinks = [];

  FETCH_CATEGORIES.forEach((category) => {
    promises.push(
      fetch(`${API_URL}c=${category}`).then((response) => response.json())
    );
  });
  Promise.all(promises)
    .then(async (lists) => {
      lists.forEach((list, index) => {
        drinks = drinks.concat(
          list.drinks.map((item) => ({
            ...item,
            category: DRINK_CATEGORIES[index],
          }))
        );
      });

      const response = await fetch(`${API_URL}a=Non_Alcoholic`);
      return await response.json();
    })
    .then((list) => {
      drinks = drinks.concat(
        list.drinks.map((item) => ({ ...item, category: "Non-Alcoholic" }))
      );
    })
    .then(() => {
      drinks.sort((a, b) => a.strDrink.localeCompare(b.strDrink));
      DRINK_LIST = drinks;
      drinks.forEach((drink) => {
        createCard(drink);
      });
      initFilters();
      initSearchInput();
    })
    .catch((error) => {
      console.error(error);
    });
}

const LIST_ON_STORAGE = localStorage.getItem("DRINK_LIST");
if (LIST_ON_STORAGE) {
  DRINK_LIST = JSON.parse(LIST_ON_STORAGE);
  initFilters();
  initSearchInput();
} else {
  getAllDrinks();
}

// getAllDrinks();