const form = document.querySelector('#idea-form');
const input = document.querySelector('#idea-input');
const list = document.querySelector('#idea-list');
const count = document.querySelector('#idea-count');
const emptyState = document.querySelector('#empty-state');
const digitalClock = document.querySelector('#digital-clock');
const analogClock = document.querySelector('#analog-clock');
const hourHand = document.querySelector('#hour-hand');
const minuteHand = document.querySelector('#minute-hand');
const secondHand = document.querySelector('#second-hand');
const clockModes = document.querySelectorAll('.clock-mode');

let ideas = JSON.parse(localStorage.getItem('small-ideas') || '[]');

// Documenta la función updateClock, que actualiza la hora en el reloj digital y analógico.
/**
 * Actualiza la hora en el reloj digital y analógico.
 */
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const format = (value) => String(value).padStart(2, '0');

  digitalClock.textContent = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  hourHand.style.transform = `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`;
  minuteHand.style.transform = `rotate(${minutes * 6 + seconds * 0.1}deg)`;
  secondHand.style.transform = `rotate(${seconds * 6}deg)`;
}

clockModes.forEach((modeButton) => {
  modeButton.addEventListener('click', () => {
    const isAnalog = modeButton.dataset.mode === 'analog';

    digitalClock.classList.toggle('is-hidden', isAnalog);
    analogClock.classList.toggle('is-visible', isAnalog);
    clockModes.forEach((button) => {
      const isActive = button === modeButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  });
});

function updateCount() {
  count.textContent = `${ideas.length} ${ideas.length === 1 ? 'idea' : 'ideas'}`;
}

function saveIdeas() {
  localStorage.setItem('small-ideas', JSON.stringify(ideas));
}

function renderIdeas() {
  list.innerHTML = '';

  if (ideas.length === 0) {
    list.append(emptyState);
    updateCount();
    return;
  }

  ideas.forEach((idea, index) => {
    const item = document.createElement('li');
    const text = document.createElement('span');
    const deleteButton = document.createElement('button');

    text.textContent = idea;
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Eliminar idea: ${idea}`);
    deleteButton.addEventListener('click', () => {
      ideas.splice(index, 1);
      saveIdeas();
      renderIdeas();
    });

    item.append(text, deleteButton);
    list.append(item);
  });

  updateCount();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const newIdea = input.value.trim();

  if (!newIdea) {
    return;
  }

  ideas.unshift(newIdea);
  saveIdeas();
  renderIdeas();
  form.reset();
  input.focus();
});

renderIdeas();
updateClock();
setInterval(updateClock, 1000);
