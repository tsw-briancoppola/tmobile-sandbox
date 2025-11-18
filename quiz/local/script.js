const listItems = document.querySelectorAll(".tsw-quiz-checklist li");
const panels = document.querySelectorAll(".tsw-quiz-panel");
const backButton = document.querySelector(".tsw-quiz-button-back");
const nextButton = document.querySelector(".tsw-quiz-button-next");
const choiceButtonsKnowsPlan = document.querySelectorAll('input[name="tsw-knows-plan"]');
const choiceButtonsLineCount = document.querySelectorAll('input[name="tsw-line-count"]');
const choiceButtonsDevice = document.querySelectorAll('input[name="tsw-device"]');

// User state object
let quizState = {
  currentListItem: 0,
  knowsPlan: null,
  lineCount: 0,
  device: null,
};

const updateCurrentListItem = (index) => {
  // Remove 'active' from all list items and panels
  listItems.forEach((item) => {
    item.classList.remove("active");
  });
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });

  // Add 'active' to new list item and panel
  listItems[index].classList.add("active");
  panels[index].classList.add("active");

  // Update quizState.currentListItem
  quizState.currentListItem = index;

  // Update local storage
  localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
};

const updateStepperButtons = () => {
  backButton.disabled = quizState.currentListItem <= 0;
  nextButton.disabled = quizState.currentListItem >= listItems.length - 1;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// List and button event handlers
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

listItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    updateCurrentListItem(index);
    updateStepperButtons();
  });
});

// Stepper buttons

backButton.addEventListener("click", () => {
  updateCurrentListItem(quizState.currentListItem - 1);
  updateStepperButtons();
});

nextButton.addEventListener("click", () => {
  updateCurrentListItem(quizState.currentListItem + 1);
  updateStepperButtons();
});

// Choice buttons

choiceButtonsKnowsPlan.forEach((button) => {
  button.addEventListener("change", function () {
    quizState.knowsPlan = this.value;
    localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
  });
});

choiceButtonsLineCount.forEach((button) => {
  button.addEventListener("change", function () {
    quizState.lineCount = this.value;
    localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
  });
});

choiceButtonsDevice.forEach((button) => {
  button.addEventListener("change", function () {
    quizState.device = this.value;
    localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
  });
});

// =-=-=-=
// On load
// =-=-=-=

const initChoiceButtons = (state) => {
  choiceButtonsKnowsPlan.forEach((button) => {
    if (button.value === state.knowsPlan) button.checked = true;
  });
  choiceButtonsLineCount.forEach((button) => {
    if (button.value === state.lineCount) button.checked = true;
  });
  choiceButtonsDevice.forEach((button) => {
    if (button.value === state.device) button.checked = true;
  });
};

const init = () => {
  const localStorageData = JSON.parse(localStorage.getItem("tsw-quiz"));
  if (localStorageData) quizState = localStorageData;

  updateCurrentListItem(quizState.currentListItem);
  initChoiceButtons(quizState);
  updateStepperButtons();
};

init();
