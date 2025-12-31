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

// Question buttons

const radioButtonHTML = (index, name, text, value, isChecked) => `
  <input type="radio" id="${name}--${index}" name="${name}" value="${value}" ${isChecked ? "checked" : ""} />
  <label for="${name}--${index}">${text}</label>
`;

const radioButtonsRow = (questionUI) => {
  if (!questionUI?.choices) return "";
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

// Plan cards

const supplementalHTML = (supplemental) => {
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

// Quiz questions and answers

const answerHTML = (name, { value, answer, supplemental }) => {
  const isActive = quizState.choices[name] === value ? "active" : "";

  return `<div class="tsw-quiz-answer ${isActive}" data-question="${name}" data-answer="${value}">
    <p class="bold">${answer}</p>
    ${supplemental ? supplementalHTML(supplemental) : ""}
  </div>`;
};

const questionAnswers = (questionUI) => {
  if (!questionUI?.choices) return "";

  const { name, choices } = questionUI;
  const hasAnswers = choices.some((choice) => choice.answer);

  return hasAnswers ? choices.map((choice) => answerHTML(name, choice)).join("") : "";
};

// Quiz text panel areas

const textHTMLList = (list) => {
  return list
    .map((item) => {
      return `<li><a href="${item.url}">${item.text}</a></li>`;
    })
    .join("");
};

const textHTML = (text) => {
  const textTags = text
    .map((tag) => {
      if (tag.type === "p") {
        return `<p>${tag.value}</p>`;
      } else if (tag.type === "list") {
        return `<ul>${textHTMLList(tag.items)}</ul>`;
      } else if (tag.type === "button") {
        const action = tag.onClick === "next" ? `${updateCurrentPanel(quizState.currentPanel + 1)}` : "";
        return `<button type="button" class="magenta-button" onClick="${action}">${tag.text}</button>`;
      }
    })
    .join("");

  return textTags;
};

// Quiz panel types

const textPanelHTML = (content) => `
  <div class="tsw-quiz-text">
    <h2>${content.title}</h2>
    ${textHTML(content.text)}
  </div>
`;

const questionPanelHTML = (content) => `
  <div class="tsw-quiz-question">
    <h2>${content.title}</h2>
    ${radioButtonsRow(content.questionUI)}
  </div>
  ${questionAnswers(content.questionUI)}
`;

// Main quiz panel container

const QuizPanel = (step, content) => {
  return `
    <div class="tsw-quiz-panel tsw-quiz-panel--${step}" data-panel="${step}">
      ${content.text ? textPanelHTML(content) : ""}
      ${content.questionUI ? questionPanelHTML(content) : ""}
    </div>
  `;
};

// =-=-=-=-=-=-=-=-
// State management
// =-=-=-=-=-=-=-=-

const saveState = () => {
  localStorage.setItem("tsw-quiz", JSON.stringify(quizState));
};

const updateChoice = (name, value, type, checked) => {
  // Update quizState object based on input type
  if (type === "checkbox") {
    quizState.choices[name] = quizState.choices[name] || [];

    if (checked) {
      quizState.choices[name].push(value);
    } else {
      quizState.choices[name] = quizState.choices[name].filter((item) => item !== value);
    }
  } else {
    quizState.choices[name] = value;
  }

  saveState();
};

const showAnswer = (panel, questionName, answerValue) => {
  const answers = panel.querySelectorAll(`.tsw-quiz-answer[data-question="${questionName}"]`);
  answers.forEach((ans) => ans.classList.remove("active"));

  const targetAnswer = panel.querySelector(`[data-answer="${answerValue}"]`);
  targetAnswer?.classList.add("active");
};

// =-=-=-=-=-=-=-=-
// Panel navigation
// =-=-=-=-=-=-=-=-

const renderAllPanels = () => {
  const allPanelsHTML = panelContent
    .map((content, index) => {
      return QuizPanel(index, content);
    })
    .join("");

  panelsContainer.innerHTML = allPanelsHTML;
};

const updateCurrentPanel = (index) => {
  quizState.currentPanel = index;

  // Hide all panels, show current
  const allPanels = panelsContainer.querySelectorAll(".tsw-quiz-panel");
  allPanels.forEach((panel, i) => {
    panel.classList.toggle("active", i === index);
  });

  // Restore
  const currentPanel = allPanels[index];
  console.log(allPanels);
  const inputs = currentPanel.querySelectorAll("input[name]");

  inputs.forEach((input) => {
    const savedValue = quizState.choices[input.name];
    if (savedValue && input.value === savedValue) {
      showAnswer(currentPanel, input.name, savedValue);
    }
  });

  saveState();
  updateStepperButtons();
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
    updateCurrentPanel(index + 1);
  });
});

// Stepper buttons

backButton.addEventListener("click", () => {
  updateCurrentPanel(quizState.currentPanel - 1);
});

nextButton.addEventListener("click", () => {
  updateCurrentPanel(quizState.currentPanel + 1);
});

// All panel inputs

panelsContainer.addEventListener("change", (event) => {
  const { target } = event;
  if (!target.matches("input")) return;

  const { name, value, type, checked } = target;
  const currentPanel = target.closest(".tsw-quiz-panel");

  updateChoice(name, value, type, checked);
  showAnswer(currentPanel, name, value);
});

// =-=-=-=
// On load
// =-=-=-=

const init = () => {
  const localStorageData = JSON.parse(localStorage.getItem("tsw-quiz"));
  if (localStorageData) quizState = localStorageData;

  renderAllPanels();
  updateCurrentPanel(quizState.currentPanel);
};

localStorage.removeItem("tsw-quiz");
init();
