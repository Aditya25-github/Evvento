var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1.9, // Shows full center image and small parts of others
  centeredSlides: true,
  loop: true,
  autoplay: {
      delay: 2500,
      disableOnInteraction: false,
  },
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  },
});
