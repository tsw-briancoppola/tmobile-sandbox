const listItems = document.querySelectorAll(".tsw-quiz-checklist li");
const panels = document.querySelectorAll(".tsw-quiz-panel");
const backButton = document.querySelector(".tsw-quiz-button-back");
const nextButton = document.querySelector(".tsw-quiz-button-next");
const panel2buttons = document.querySelectorAll('.tsw-quiz-panel--2 input[type="radio"]');
const panel2results = document.querySelectorAll(".tsw-quiz-panel--2 .tsw-quiz-panel-result");
const panel3buttons = document.querySelectorAll('.tsw-quiz-panel--3 input[type="radio"]');
const panel3results = document.querySelectorAll(".tsw-quiz-panel--3 .tsw-quiz-panel-result");
const panel4buttons = document.querySelectorAll('.tsw-quiz-panel--4 input[type="radio"]');
const panel4results = document.querySelectorAll(".tsw-quiz-panel--4 .tsw-quiz-panel-result");
const panel5buttons = document.querySelectorAll('.tsw-quiz-panel--5 input[type="radio"]');
const panel5results = document.querySelectorAll(".tsw-quiz-panel--5 .tsw-quiz-panel-result");

// User state object
let quizState = {
  currentListItem: 0,
  knowsPlan: null,
  lineCount: 0,
  device: null,
  unlocked: null,
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

// Panel choice buttons and results

const choiceButtonMaps = [
  { buttons: panel2buttons, results: panel2results, stateKey: "knowsPlan" },
  { buttons: panel3buttons, results: panel3results, stateKey: "lineCount" },
  { buttons: panel4buttons, results: panel4results, stateKey: "device" },
  { buttons: panel5buttons, results: panel5results, stateKey: "unlocked" },
];

choiceButtonMaps.forEach(({ buttons, results, stateKey }) => {
  buttons.forEach((button) => {
    button.addEventListener("change", function () {
      quizState[stateKey] = this.value;
      localStorage.setItem("tsw-quiz", JSON.stringify(quizState));

      results.forEach((result) => {
        result.classList.remove("active");
      });

      const targetId = this.getAttribute("data-target");
      if (targetId) {
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add("active");
        }
      }
    });
  });
});

// =-=-=-=
// On load
// =-=-=-=

const initChoiceButtons = (state) => {
  // Set initial value of all choice buttons based on local storage or default
  const buttonMaps = [
    { buttons: panel2buttons, value: state.knowsPlan },
    { buttons: panel3buttons, value: state.lineCount },
    { buttons: panel4buttons, value: state.device },
    { buttons: panel5buttons, value: state.unlocked },
  ];

  buttonMaps.forEach((map) => {
    map.buttons.forEach((button) => {
      if (button.value === map.value) {
        button.checked = true;
      }
    });
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
