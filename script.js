const storageKey = 'small-ideas';

const elements = {
  ideaForm: document.querySelector('#idea-form'),
  ideaInput: document.querySelector('#idea-input'),
  ideaList: document.querySelector('#idea-list'),
  ideaCount: document.querySelector('#idea-count'),
  emptyState: document.querySelector('#empty-state'),
  digitalClock: document.querySelector('#digital-clock'),
  analogClock: document.querySelector('#analog-clock'),
  hourHand: document.querySelector('#hour-hand'),
  minuteHand: document.querySelector('#minute-hand'),
  secondHand: document.querySelector('#second-hand'),
  clockModes: document.querySelectorAll('.clock-mode')
};

const appState = {
  ideas: loadIdeas()
};

function loadIdeas() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (error) {
    console.error('Unable to load saved ideas.', error);
    return [];
  }
}

function saveIdeas() {
  localStorage.setItem(storageKey, JSON.stringify(appState.ideas));
}

function formatTimePart(value) {
  return String(value).padStart(2, '0');
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  elements.digitalClock.textContent = `${formatTimePart(hours)}:${formatTimePart(minutes)}:${formatTimePart(seconds)}`;
  elements.hourHand.style.transform = `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`;
  elements.minuteHand.style.transform = `rotate(${minutes * 6 + seconds * 0.1}deg)`;
  elements.secondHand.style.transform = `rotate(${seconds * 6}deg)`;
}

function setClockMode(mode) {
  const isAnalog = mode === 'analog';

  elements.digitalClock.classList.toggle('is-hidden', isAnalog);
  elements.analogClock.classList.toggle('is-visible', isAnalog);

  elements.clockModes.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function updateCount() {
  const totalIdeas = appState.ideas.length;
  elements.ideaCount.textContent = `${totalIdeas} ${totalIdeas === 1 ? 'idea' : 'ideas'}`;
}

function removeIdea(index) {
  appState.ideas.splice(index, 1);
  saveIdeas();
  renderIdeas();
}

function createIdeaItem(idea, index) {
  const item = document.createElement('li');
  const text = document.createElement('span');
  const deleteButton = document.createElement('button');

  text.textContent = idea;

  deleteButton.className = 'delete-button';
  deleteButton.type = 'button';
  deleteButton.textContent = '×';
  deleteButton.setAttribute('aria-label', `Delete idea: ${idea}`);
  deleteButton.addEventListener('click', () => removeIdea(index));

  item.append(text, deleteButton);
  return item;
}

function renderIdeas() {
  elements.ideaList.innerHTML = '';

  if (appState.ideas.length === 0) {
    elements.ideaList.append(elements.emptyState);
    updateCount();
    return;
  }

  appState.ideas.forEach((idea, index) => {
    const ideaItem = createIdeaItem(idea, index);
    elements.ideaList.append(ideaItem);
  });

  updateCount();
}

function handleIdeaSubmit(event) {
  event.preventDefault();

  const newIdea = elements.ideaInput.value.trim();

  if (!newIdea) {
    return;
  }

  appState.ideas.unshift(newIdea);
  saveIdeas();
  renderIdeas();

  elements.ideaForm.reset();
  elements.ideaInput.focus();
}

function bindEvents() {
  elements.ideaForm.addEventListener('submit', handleIdeaSubmit);

  elements.clockModes.forEach((modeButton) => {
    modeButton.addEventListener('click', () => setClockMode(modeButton.dataset.mode));
  });
}

bindEvents();
renderIdeas();
updateClock();
setInterval(updateClock, 1000);
