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
  const navMenu = document.querySelector(".nav_contents");
  const menuToggle = document.querySelector(".menu-toggle");

  // Toggle 'show' class for slide-in effect
  navMenu.classList.toggle("show");

  // Change icon between ☰ and ✖
  if (navMenu.classList.contains("show")) {
    menuToggle.innerHTML = "&#10006;"; // Cross (✖)
  } else {
    menuToggle.innerHTML = "&#9776;"; // Hamburger (☰)
  }
}

// Close navbar when clicking a menu link
document.querySelectorAll(".nav_contents a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".nav_contents").classList.remove("show");
    document.querySelector(".menu-toggle").innerHTML = "&#9776;"; // Reset to ☰
  });
});


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

document.addEventListener("click", function (event) {
  const navMenu = document.querySelector(".nav_contents");
  const menuToggle = document.querySelector(".menu-toggle");
  if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    navMenu.classList.remove("show");
  }
});
