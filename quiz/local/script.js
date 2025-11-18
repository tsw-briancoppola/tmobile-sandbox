const listItems = document.querySelectorAll(".tsw-quiz-checklist li");
const panels = document.querySelectorAll(".tsw-quiz-panel");
const backButton = document.querySelector(".tsw-quiz-button-back");
const nextButton = document.querySelector(".tsw-quiz-button-next");
const choiceButtonsKnowsPlan = document.querySelectorAll('input[name="tsw-knows-plan"]');
const choiceButtonsLineCount = document.querySelectorAll('input[name="tsw-line-count"]');

// User state object
let quizState = {
  currentListItem: 0,
  knowsPlan: null,
  lineCount: 0,
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

choiceButtonsKnowsPlan.forEach((radio) => {
  radio.addEventListener("change", function () {
    quizState.knowsPlan = this.value;
    localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
  });
});

choiceButtonsLineCount.forEach((radio) => {
  radio.addEventListener("change", function () {
    quizState.lineCount = this.value;
    localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
  });
});

// =-=-=-=
// On load
// =-=-=-=

const initChoiceButtons = (local) => {
  choiceButtonsKnowsPlan.forEach((button) => {
    if (button.value === local.knowsPlan) button.checked = true;
  });
  choiceButtonsLineCount.forEach((button) => {
    if (button.value === local.lineCount) button.checked = true;
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
