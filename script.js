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

function toggleMenu() {
  document.querySelector(".nav_contents").classList.toggle("show");
}


// JavaScript to handle the card flip on "View Details" button click
document.querySelectorAll('.btn-view').forEach(button => {
  button.addEventListener('click', function () {
    const card = this.closest('.evvent-card');  // Find the closest card
    const cardInner = card.querySelector('.card-inner');  // Find the card-inner element
    cardInner.classList.toggle('flipped');  // Toggle the 'flipped' class to flip the card
  });
});

document.querySelectorAll('.btn-back').forEach(button => {
  button.addEventListener('click', function () {
    const card = this.closest('.evvent-card');  // Find the closest card
    const cardInner = card.querySelector('.card-inner');  // Find the card-inner element
    cardInner.classList.remove('flipped');  // Remove the 'flipped' class to flip the card back
  });
});