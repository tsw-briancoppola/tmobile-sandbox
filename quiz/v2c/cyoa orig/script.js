const panelsContainer = document.querySelector(".tsw-quiz-panel-container");
const panels = document.querySelectorAll(".tsw-quiz-panel");
const panelList = document.querySelector(".tsw-quiz-panel-list");
const panelListItems = document.querySelectorAll(".tsw-quiz-panel-list li");
const backButton = document.querySelector(".tsw-quiz-button-back");
const nextButton = document.querySelector(".tsw-quiz-button-next");
const helpTypeButtons = document.querySelectorAll(".tsw-quiz-help-buttons li input");

// User state object
let quizState = {
  currentPanel: 0,
  choices: {},
};

const updatecurrentPanel = (index) => {
  // Toggle list item visibility based on current panel
  panelList.classList.toggle("active", index !== 0);

  // Remove 'active' from all list items and panels
  panelListItems.forEach((item) => {
    item.classList.remove("active");
  });
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });

  // Add 'active' to new list item and panel
  if (index > 0) {
    panelListItems[index - 1].classList.add("active");
  }
  panels[index].classList.add("active");

  // Update quizState.currentPanel
  quizState.currentPanel = index;

  // Update local storage
  localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
};

const updateStepperButtons = () => {
  backButton.disabled = quizState.currentPanel <= 0;
  nextButton.disabled = quizState.currentPanel >= panels.length - 1;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// List and button event handlers
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

panelListItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    updatecurrentPanel(index + 1);
    updateStepperButtons();
  });
});

// Stepper buttons

backButton.addEventListener("click", () => {
  updatecurrentPanel(quizState.currentPanel - 1);
  updateStepperButtons();
});

nextButton.addEventListener("click", () => {
  updatecurrentPanel(quizState.currentPanel + 1);
  updateStepperButtons();
});

// All panel inputs

panelsContainer.addEventListener("change", (event) => {
  const { target } = event;
  const { name, value, type, checked } = target;

  // Update quizState based on input type
  if (type === "checkbox") {
    if (!quizState.choices[name]) quizState.choices[name] = [];

    if (checked) {
      quizState.choices[name].push(value);
    } else {
      quizState.choices[name] = quizState.choices[name].filter((item) => item !== value);
    }
  } else {
    quizState.choices[name] = value;
  }

  // Reveal appropriate answer element if any
  const currentPanel = target.closest(".tsw-quiz-panel");
  if (!currentPanel) return;

  const answerSection = currentPanel.querySelector(".tsw-quiz-answer-section");
  if (answerSection) answerSection.classList.add("active");

  const answers = currentPanel.querySelectorAll(`.tsw-quiz-answer[data-question="${name}"]`);
  answers.forEach((ans) => ans.classList.remove("active"));

  const targetAnswer = currentPanel.querySelector(`[data-answer="${value}"]`);
  if (targetAnswer) {
    targetAnswer.classList.add("active");
  }

  localStorage.setItem("tsw-quiz", JSON.stringify(quizState));

  console.log("Current State:", quizState.choices);
});

// =-=-=-=
// On load
// =-=-=-=

const initHelpTypeButtons = (state) => {
  // Set initial value of all help type buttons based on local storage or default
  // helpTypeButtons.forEach((button) => {
  //   if (state.selectedHelpTypes.includes(button.value)) {
  //     button.checked = true;
  //   } else {
  //     button.checked = false;
  //   }
  // });
};

const initChoiceButtons = (state) => {
  // Set initial value of all choice buttons based on local storage or default
  // const buttonMaps = [
  //   { buttons: panel2RadioButtons, value: state.choices.knowsPlan },
  //   { buttons: panel3RadioButtons, value: state.choices.lineCount },
  //   { buttons: panel4RadioButtons, value: state.choices.device },
  //   { buttons: panel5RadioButtons, value: state.choices.unlocked },
  // ];
  // buttonMaps.forEach((map) => {
  //   map.buttons.forEach((button) => {
  //     if (button.value === map.value) {
  //       button.checked = true;
  //     }
  //   });
  // });
};

const init = () => {
  const localStorageData = JSON.parse(localStorage.getItem("tsw-quiz"));
  if (localStorageData) quizState = localStorageData;

  updatecurrentPanel(quizState.currentPanel);
  initHelpTypeButtons(quizState);
  initChoiceButtons(quizState);
  updateStepperButtons();
};

localStorage.removeItem("tsw-quiz");
init();
