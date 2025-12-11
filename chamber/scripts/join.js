// timestamp
document.getElementById("timestamp").value = new Date().toISOString();

// modals
const cards = document.querySelectorAll(".open-modal");
const modals = document.querySelectorAll(".modal");

cards.forEach(card => {
  card.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById(card.parentElement.dataset.modal).style.display = "block";
  });
});

modals.forEach(m => {
  m.querySelector(".close").addEventListener("click", () => {
    m.style.display = "none";
  });
});

window.addEventListener("click", e => {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});

// fade-in animation for cards
document.querySelectorAll(".card").forEach((card, i) => {
  card.style.animationDelay = `${i * 0.2}s`;
  card.classList.add("fade-in");
});
