const panelsContainer = document.querySelector(".tsw-quiz-panel-container");
const panels = document.querySelectorAll(".tsw-quiz-panel");
const panelListItems = document.querySelectorAll(".tsw-quiz-panel-list li");
const backButton = document.querySelector(".tsw-quiz-button-back");
const nextButton = document.querySelector(".tsw-quiz-button-next");
const helpTypeButtons = document.querySelectorAll(".tsw-quiz-help-buttons li input");

// User state object
let quizState = {
  currentPanel: 0,
  choices: {},
};

// =-=-=-=-=-=-=-=-=-=-=-=
// Panel builder functions
// =-=-=-=-=-=-=-=-=-=-=-=

const radioButtonHTML = (index, name, text, value, isChecked) => `
  <input type="radio" id="${name}--${index}" name="${name}" value="${value}" ${isChecked ? "checked" : ""}  />
  <label for="${name}--${index}">${text}</label>
`;

const radioButtonsRow = (questionUI) => {
  if (!questionUI || !questionUI.choices) return "";
  const { name, type, choices } = questionUI;

  const savedValue = quizState.choices[name];

  const buttons = choices
    .map((button, index) => {
      // Determine if this specific button matches the saved state
      const isChecked = savedValue === button.value;
      return radioButtonHTML(button.id || index, name, button.text, button.value, isChecked);
    })
    .join("");

  return `<div class="tsw-quiz-radio-buttons">${buttons}</div>`;
};

const supplementalHTML = (supplemental) => {
  console.log(supplemental.data);

  const cards = supplemental.data
    .map((data) => {
      const { title, tagline, rate, rateStrikethrough, boldText } = data;
      return `<div class="tsw-plan-card">
              <div class="tsw-plan-card-headline">${title}</div>
              <div class="tsw-plan-card-main">
                <div class="tsw-plan-card-tagline">${tagline}</div>
                <div class="tsw-plan-card-rate"><span class="strikethrough">${rateStrikethrough}</span>${rate}</div>
                <div>${boldText}</div>
              </div>
            </div>`;
    })
    .join("");

  return `<div class="tsw-plan-card-container">${cards}</div>`;
};

const answerHTML = (name, { value, answer, supplemental }) => {
  return `<div class="tsw-quiz-answer" data-question="${name}" data-answer="${value}">
    <p class="bold">${answer}</p>
    ${supplemental ? supplementalHTML(supplemental) : ""}
  </div>`;
};

const questionAnswers = (questionUI) => {
  if (!questionUI || !questionUI.choices) return "";

  const { name, choices } = questionUI;
  if (!choices || !choices.some((choice) => choice.answer)) return "";

  return choices.map((choice) => answerHTML(name, choice)).join("");
};

const QuizPanel = (step, content) => {
  return `
    <div class="tsw-quiz-panel tsw-quiz-panel--${step}">
      <div class="tsw-quiz-question">
        <h2>${content.title}</h2>
        ${radioButtonsRow(content.questionUI)}
      </div>
      ${questionAnswers(content.questionUI)}
    </div>
  `;
};

// =-=-=-=-=-=-
// Update panel
// =-=-=-=-=-=-

const updatecurrentPanel = (index) => {
  // Update quizState.currentPanel
  quizState.currentPanel = index;

  const newPanelContent = panelContent[index];
  const newPanel = QuizPanel(index, newPanelContent);
  document.querySelector(".tsw-quiz-panel-container").innerHTML = newPanel;

  // Update local storage
  localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
};

const updateStepperButtons = () => {
  backButton.disabled = quizState.currentPanel <= 0;
  nextButton.disabled = quizState.currentPanel >= panelContent.length - 1;
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

  // Update quizState object based on input type
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

  const answers = currentPanel.querySelectorAll(`.tsw-quiz-answer[data-question="${name}"]`);
  answers.forEach((ans) => ans.classList.remove("active"));

  const targetAnswer = currentPanel.querySelector(`[data-answer="${value}"]`);
  if (targetAnswer) {
    targetAnswer.classList.add("active");
  }

  localStorage.setItem("tsw-quiz", JSON.stringify(quizState));

  console.log("quizState:", quizState.choices);
});

// =-=-=-=
// On load
// =-=-=-=

const init = () => {
  const localStorageData = JSON.parse(localStorage.getItem("tsw-quiz"));
  if (localStorageData) quizState = localStorageData;

  updatecurrentPanel(quizState.currentPanel);
  // initHelpTypeButtons(quizState);
  // initChoiceButtons(quizState);
  updateStepperButtons();
};

localStorage.removeItem("tsw-quiz");
init();
