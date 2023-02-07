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
class Drink {
  constructor(id, name, category, image) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.image = image;
  }
}
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?";
const DRINKS_CONTAINER = document.getElementById("drinks");
let drinks = [];

const createDrink = (drink) => {
  const container = document.createElement("div");
  const div = document.createElement("div");
  div.id = drink.id;
  div.classList.add(`media`);
  div.classList.add(drink.category);
  const divLeft = document.createElement("div");
  divLeft.classList.add("media-left");
  const img = document.createElement("img");
  img.src = drink.image;
  img.alt = "";
  divLeft.appendChild(img);

  const divBody = document.createElement("div");
  divBody.classList.add("media-body");
  const h4 = document.createElement("h4");
  h4.classList.add("media-heading");
  h4.textContent = drink.name;
  divBody.appendChild(h4);

  div.appendChild(divLeft);
  div.appendChild(divBody);
  container.appendChild(div);
  return container;
};

const CATEGORIES = [
  "Beer",
  "Cocktail",
  // "Shot",
  // "Coffe / Tea",
  // "Homenade Liqueur",
  // "Punch / Party Drink",
  // "Soft Drink",
  // ,"Non_Alcoholic"
];

async function getCategory(category) {
  let drinkElement;
  const response = await fetch(API_URL + "c=" + category);
  const responseJson = await response.json();
  responseJson.drinks.forEach((drink) => {
    drinkElement = new Drink(
      drink.idDrink,
      drink.strDrink,
      category,
      drink.strDrinkThumb
    );
    drinks.push(drinkElement);
  });
}

function getAllDrinks() {
  CATEGORIES.forEach((category) => {
    getCategory(category);
  });
  drinks.sort((a, b) => {
    return a.name - b.name;
  });
}
getAllDrinks();

const options = document.querySelectorAll(".option");
options.forEach((option) => {
  option.addEventListener("click", function () {
    options.forEach((option) => {
      option.classList.remove("selected");
    });
    this.classList.add("selected");
  });
});
