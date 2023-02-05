

/*=============== SWIPER PROJECTS ===============*/
let swiperProjects = new Swiper(".home__container", {
    loop: true,
    spaceBetween: 24,
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
  });