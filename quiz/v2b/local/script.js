const panels = document.querySelectorAll(".tsw-quiz-panel");
const panelList = document.querySelector(".tsw-quiz-panel-list");
const panelListItems = document.querySelectorAll(".tsw-quiz-panel-list li");
const backButton = document.querySelector(".tsw-quiz-button-back");
const nextButton = document.querySelector(".tsw-quiz-button-next");

const helpTypeButtons = document.querySelectorAll(".tsw-quiz-help-buttons li input");
const panel2Buttons = document.querySelectorAll('.tsw-quiz-panel--2 input[type="radio"]');
const panel2Results = document.querySelectorAll(".tsw-quiz-panel--2 .tsw-quiz-panel-result");
const panel3Buttons = document.querySelectorAll('.tsw-quiz-panel--3 input[type="radio"]');
const panel3Results = document.querySelectorAll(".tsw-quiz-panel--3 .tsw-quiz-panel-result");
const panel4Buttons = document.querySelectorAll('.tsw-quiz-panel--4 input[type="radio"]');
const panel4Results = document.querySelectorAll(".tsw-quiz-panel--4 .tsw-quiz-panel-result");
const panel5Buttons = document.querySelectorAll('.tsw-quiz-panel--5 input[type="radio"]');
const panel5Results = document.querySelectorAll(".tsw-quiz-panel--5 .tsw-quiz-panel-result");

// User state object
let quizState = {
  currentPanel: 0,
  selectedHelpTypes: [],
  choices: {
    knowsPlan: null,
    lineCount: 0,
    device: null,
    unlocked: null,
  },
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

// Help type buttons

helpTypeButtons.forEach((button) => {
  button.addEventListener("change", (event) => {
    const { value, checked } = event.target;
    if (checked) {
      quizState.selectedHelpTypes.push(value);
    } else {
      const index = quizState.selectedHelpTypes.indexOf(value);
      if (index > -1) {
        quizState.selectedHelpTypes.splice(index, 1);
      }
    }
    localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
    console.log(quizState.selectedHelpTypes);
  });
});

// Panel choice buttons and results

const choiceButtonMaps = [
  { buttons: panel2Buttons, results: panel2Results, stateKey: "knowsPlan" },
  { buttons: panel3Buttons, results: panel3Results, stateKey: "lineCount" },
  { buttons: panel4Buttons, results: panel4Results, stateKey: "device" },
  { buttons: panel5Buttons, results: panel5Results, stateKey: "unlocked" },
];

choiceButtonMaps.forEach(({ buttons, results, stateKey }) => {
  buttons.forEach((button) => {
    button.addEventListener("change", (event) => {
      const { value, dataset } = event.target;
      quizState.choices[stateKey] = value;
      localStorage.setItem("tsw-quiz", JSON.stringify(quizState));

      // Hide all results in this panel group
      results.forEach((result) => {
        result.classList.remove("active");
      });

      // Show the specific target result
      const targetId = dataset.target;
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

const initHelpTypeButtons = (state) => {
  // Set initial value of all help type buttons based on local storage or default
  helpTypeButtons.forEach((button) => {
    if (state.selectedHelpTypes.includes(button.value)) {
      button.checked = true;
    } else {
      button.checked = false;
    }
  });
};

const initChoiceButtons = (state) => {
  // Set initial value of all choice buttons based on local storage or default
  const buttonMaps = [
    { buttons: panel2Buttons, value: state.choices.knowsPlan },
    { buttons: panel3Buttons, value: state.choices.lineCount },
    { buttons: panel4Buttons, value: state.choices.device },
    { buttons: panel5Buttons, value: state.choices.unlocked },
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

  updatecurrentPanel(quizState.currentPanel);
  initHelpTypeButtons(quizState);
  initChoiceButtons(quizState);
  updateStepperButtons();
};

init();
