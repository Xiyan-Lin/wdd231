// scripts/discover.js
import { places } from '../data/places.mjs';

// nodes
const grid = document.getElementById('places-grid');
const visitMessageEl = document.getElementById('visit-message');

// ----- localStorage last-visit logic -----
const storageKey = 'chamber_last_visit';
const now = Date.now();
const previous = localStorage.getItem(storageKey);

function daysBetween(ms1, ms2) {
  const diffMs = Math.abs(ms1 - ms2);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

let message = '';
if (!previous) {
  message = 'Welcome! Let us know if you have any questions.';
} else {
  const prevMs = parseInt(previous, 10);
  const days = daysBetween(now, prevMs);
  if (days === 0) {
    message = 'Back so soon! Awesome!';
  } else if (days === 1) {
    message = 'You last visited 1 day ago.';
  } else {
    message = `You last visited ${days} days ago.`;
  }
}
visitMessageEl.textContent = message;

// store current visit time for next time
localStorage.setItem(storageKey, String(now));

// ----- render places using named grid areas placeholders -----
// We'll assign each card a class matching the area name (area-1 .. area-8)
function createCard(p, index) {
  const wrapper = document.createElement('article');
  wrapper.className = `place-card area-${index+1}`;
  wrapper.setAttribute('tabindex', '0'); // keyboard navigable

  // required structure: h2, figure, address, p, button "learn more"
  wrapper.innerHTML = `
    <h2>${p.title}</h2>
    <figure>
      <img src="images/${p.image}" alt="${p.title}" loading="lazy" width="300" height="200">
    </figure>
    <address>${p.address}</address>
    <p class="short-desc">${p.description}</p>
    <button class="learn-more" aria-expanded="false">Learn more</button>
    <div class="more" hidden>
      <p>${p.description} <!-- you can expand this with additional content --> </p>
    </div>
  `;

  // learn more toggle
  const btn = wrapper.querySelector('.learn-more');
  const more = wrapper.querySelector('.more');
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (expanded) {
      more.hidden = true;
      btn.textContent = 'Learn more';
    } else {
      more.hidden = false;
      btn.textContent = 'Show less';
    }
  });

  return wrapper;
}

// append in order
places.slice(0,8).forEach((p, i) => {
  grid.appendChild(createCard(p, i));
});
