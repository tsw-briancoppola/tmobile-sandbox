const panelsContainer = document.querySelector(".tsw-quiz-panel-container");
const panels = document.querySelectorAll(".tsw-quiz-panel");
const panelList = document.querySelector(".tsw-quiz-panel-list");
const panelListItems = document.querySelectorAll(".tsw-quiz-panel-list li");
const backButton = document.querySelector(".tsw-quiz-button-back");
const nextButton = document.querySelector(".tsw-quiz-button-next");
const helpButtons = document.querySelectorAll(".tsw-quiz-help-buttons li input");

// Content source
const CONTENT_SOURCE = panelContent;

// User state object
let quizState = {
  currentPanel: 0,
  choices: {},
};

// =-=-=-=-=-=-=-=-=-=-=-=
// Panel builder functions
// =-=-=-=-=-=-=-=-=-=-=-=

// Question buttons

const radioCheckboxHTML = (type, index, name, text, value, isChecked) => `
  <input type="${type}" id="${name}--${index}" name="${name}" value="${value}" ${isChecked ? "checked" : ""} />
  <label for="${name}--${index}">${text}</label>
`;

const dropdownOptionsHTML = (choices) => {
  return choices.map((choice) => {
    const { text, value } = choice;
    return `<option value=${value}>${text}</option>`;
  });
};

const questionInputsRow = (question) => {
  if (!question?.choices) return "";
  const { name, type, choices } = question;

  const savedValue = quizState.choices[name];
  let inputs = "";

  if (type === "radio" || type === "checkbox") {
    inputs = choices
      .map((choice, index) => {
        // Determine if this specific button matches the saved state
        const isChecked = savedValue === choice.value;
        if (type === "radio" || type === "checkbox") {
          return radioCheckboxHTML(choice.id || type, index, name, choice.text, choice.value, isChecked);
        }
      })
      .join("");
  } else if (type === "dropdown") {
    return `
      <select class="tsw-quiz-choice-dropdown" id="${name}" name="${name}">
        ${dropdownOptionsHTML(choices)}
      </select>
    `;
  }

  return `<div class="tsw-quiz-inputs">${inputs}</div>`;
};

// Magenta button

const magentaButtonHTML = (text, onClick) => `
  <button type="button" class="magenta-button" data-action="${onClick}">${text}</button>
`;

// Quiz questions and answers

const answerHTML = (name, { value, answer, button, supplemental }) => {
  const isActive = quizState.choices[name] === value ? "active" : "";

  return `<div class="tsw-quiz-answer ${isActive}" data-question="${name}" data-answer="${value}">
    <p class="bold">${answer}</p>
    ${button ? magentaButtonHTML(button.text, button.onClick) : ""}
  </div>`;
};

const questionAnswers = (question) => {
  if (!question) return "";

  const { name, choices } = question;
  const hasAnswers = choices.some((choice) => choice.answer);

  return hasAnswers ? choices.map((choice) => answerHTML(name, choice)).join("") : "";
};

const questionHTML = (question) => `
  <div class="tsw-quiz-question">
    <h2>${question.title}</h2>
    ${questionInputsRow(question)}
  </div>
  ${questionAnswers(question)}
`;

// Quiz text panel areas

const textHTMLParagraph = (p) => {
  return p
    .map((segment) => {
      if (segment.url) {
        return `<a href="${segment.url}">${segment.text}</a>`;
      } else {
        return segment.text;
      }
    })
    .join("");
};

const textHTMLList = (list) => {
  return list
    .map((item) => {
      return `<li><a href="${item.url}">${item.text}</a></li>`;
    })
    .join("");
};

const textHTML = (text) => {
  console.log(text);
  const textTags = text
    .map((tag) => {
      if (tag.type === "p") {
        // Check if tag is an array with URL segments or not
        const segments = Array.isArray(tag.value) ? tag.value : [{ text: tag.value }];
        const subhead = tag.subhead ? `<h3>${tag.subhead}</h3>` : "";
        return `<div>${subhead}<p>${textHTMLParagraph(segments)}</p></div>`;
      } else if (tag.type === "list") {
        return `<ul>${textHTMLList(tag.items)}</ul>`;
      } else if (tag.type === "button") {
        return magentaButtonHTML(tag.text, tag.onClick);
      }
    })
    .join("");

  return textTags;
};

const helpButtonsHTML = (helpButtons) => {
  return helpButtons
    .map(
      (button) => `
    <li>
      <input type="checkbox" name="tsw-help-types" id="${button.name}" value="${button.name}"/>
      <label for="${button.name}">
        <svg>
          <use xlink:href="${button.svg}"></use>
        </svg>
        ${button.text}
      </label>
    </li>
    `
    )
    .join("");
};

// Quiz panel types

const textPanelHTML = (content) => `
  <div class="tsw-quiz-text">
    <h2>${content.title}</h2>
    ${textHTML(content.text)}
    ${content.helpButtons ? `<ul class="tsw-quiz-help-buttons">${helpButtonsHTML(content.helpButtons)}</ul>` : ""}
  </div>
`;

const questionPanelHTML = (questions) => {
  return questions.map((question) => questionHTML(question)).join("");
};

// Main quiz panel container

const QuizPanel = (step, content) => {
  return `
    <div class="tsw-quiz-panel tsw-quiz-panel--${step}" data-panel="${step}">
      ${content.text ? textPanelHTML(content) : ""}
      ${content.questions ? questionPanelHTML(content.questions) : ""}
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

const renderAllPanels = (source) => {
  const allPanelsHTML = source
    .map((content, index) => {
      return QuizPanel(index, content);
    })
    .join("");

  panelsContainer.innerHTML = allPanelsHTML;
};

const updateCurrentPanel = (index) => {
  quizState.currentPanel = index;

  // Toggle list item visibility based on current panel
  panelList.classList.toggle("active", index !== 0);

  // Remove 'active' from all list items and add to active list item
  panelListItems.forEach((item, i) => {
    item.classList.toggle("active", i === index - 1);
  });

  // Hide all panels, show current
  const allPanels = panelsContainer.querySelectorAll(".tsw-quiz-panel");
  allPanels.forEach((panel, i) => {
    panel.classList.toggle("active", i === index);
  });

  // Restore
  const currentPanel = allPanels[index];
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
  nextButton.disabled = quizState.currentPanel >= CONTENT_SOURCE.length - 1;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Input and button event handlers
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

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

// All panel inputs and other buttons

panelsContainer.addEventListener("change", (event) => {
  const { target } = event;
  if (!target.matches("input")) return;

  const { name, value, type, checked } = target;
  const currentPanel = target.closest(".tsw-quiz-panel");

  updateChoice(name, value, type, checked);
  showAnswer(currentPanel, name, value);
});

panelsContainer.addEventListener("click", (event) => {
  const { target } = event;
  if (!target.matches("button[data-action]")) return;

  const action = target.dataset.action;

  if (action === "next") {
    updateCurrentPanel(quizState.currentPanel + 1);
  }
});

// =-=-=-=
// On load
// =-=-=-=

const init = () => {
  const localStorageData = JSON.parse(localStorage.getItem("tsw-quiz-cyoa"));
  if (localStorageData) quizState = localStorageData;

  renderAllPanels(CONTENT_SOURCE);
  updateCurrentPanel(quizState.currentPanel);
};

localStorage.removeItem("tsw-quiz-cyoa");
init();
