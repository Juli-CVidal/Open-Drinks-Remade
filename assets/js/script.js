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
function createDrink(drink) {
  const div = document.createElement("div");
  div.id = drink.idDrink;
  div.classList.add(`media`);
  div.classList.add(drink.category);
  const divLeft = document.createElement("div");
  divLeft.classList.add("media-left");
  const img = document.createElement("img");
  img.src = drink.strDrinkThumb;
  img.alt = "";
  divLeft.appendChild(img);

  const divBody = document.createElement("div");
  divBody.classList.add("media-body");
  const h4 = document.createElement("h4");
  h4.classList.add("media-heading");
  h4.textContent = drink.strDrink;
  divBody.appendChild(h4);

  div.appendChild(divLeft);
  div.appendChild(divBody);
  return div;
}

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
const DRINKS_CONTAINER = document.getElementById("drinks");
let lastSelected = "All";
let drinks = [];
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

function getAllDrinks() {
  const promises = [];

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
      drinks.sort((a, b) => a.strDrink - b.strDrink);
    })
    .then(() => {
      initFilters();
      initSearchInput();
    })
    .catch((error) => {
      console.error(error);
    });
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
    DRINKS_CONTAINER.appendChild(createDrink(drink));
  });
}

function initSearchInput() {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("keyup", () => {
    filterByName(searchInput.value);
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

function filterByCategory(category) {
  DRINKS_CONTAINER.innerHTML = "";
  filteredList =
    category === "All"
      ? drinks
      : drinks.filter((drink) => drink.category === category);
  filteredList.forEach((drink) => {
    DRINKS_CONTAINER.appendChild(createDrink(drink));
  });
}

getAllDrinks();
