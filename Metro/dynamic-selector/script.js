// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// DOM references and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// DOM references
const dsContainer = document.querySelector("#tsw-modal-samsung").querySelector("xpr-npi-content").shadowRoot;

const joinButtons = dsContainer.querySelectorAll(".tsw-ds-option-btn");
const planButtons = dsContainer.querySelectorAll(".tsw-ds-plan-btn");
const monthlyAmount = dsContainer.querySelector(".tsw-ds-pricing-row--monthly .tsw-ds-pricing-row__amount");
const monthlyLabel = dsContainer.querySelector(".tsw-ds-pricing-row--monthly .tsw-ds-pricing-row__name");
const dueTodayAmount = dsContainer.querySelector(".tsw-ds-pricing-row__amount--due-today");

// Plan value variables
// Change these dollar values as needed
const planValues = {
  40: { regular: 40, firstMonth: null },
  50: { regular: 50, firstMonth: 55 },
  60: { regular: 60, firstMonth: 65 },
};

const plans = Object.fromEntries(
  Object.entries(planValues).map(([key, { regular, firstMonth }]) => {
    const label = firstMonth
      ? [`$${regular}/mo. with AutoPay,`, `${formatPrice(firstMonth)} for first month`]
      : [`$${regular}/mo. Period.`];

    return [key, { monthly: formatPrice(firstMonth ?? regular), label }];
  }),\
);

// Selected options (and default values on load)
let selectedJoin = "get";
let selectedPlan = 50;

// =-=-=-=-=-=-=-=-
// Helper functions
// =-=-=-=-=-=-=-=-

const renderPaymentValues = (plan) => {
  monthlyAmount.textContent = plans[plan].monthly;
  monthlyLabel.innerHTML = plans[plan].label.join("<br>");
  dueTodayAmount.textContent = plans[plan].monthly;
};

// =-=-=-=-=-=-=-=-=-=-=-
// Button event listeners
// =-=-=-=-=-=-=-=-=-=-=-

joinButtons.forEach((button) => {
  button.addEventListener("click", () => {
    joinButtons.forEach((btn) => {
      btn.classList.remove("tsw-ds-option-btn--selected");
      btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("tsw-ds-option-btn--selected");
    button.setAttribute("aria-pressed", "true");
  });
});

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const price = parseInt(button.dataset.plan);
    selectedPlan = price;

    planButtons.forEach((btn) => {
      btn.classList.remove("tsw-ds-plan-btn--selected");
      btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("tsw-ds-plan-btn--selected");
    button.setAttribute("aria-pressed", "true");

    renderPaymentValues(price);
  });
});

// =-=-=-=
// On load
// =-=-=-=

const init = () => {
  renderPaymentValues(selectedPlan);

  // Set default button selections
  const defaultJoinBtn = dsContainer.querySelector(`.tsw-ds-option-btn[data-join="${selectedJoin}"]`);
  if (defaultJoinBtn) {
    defaultJoinBtn.classList.add("tsw-ds-option-btn--selected");
    defaultJoinBtn.setAttribute("aria-pressed", "true");
  }

  const defaultPlanBtn = dsContainer.querySelector(`.tsw-ds-plan-btn[data-plan="${selectedPlan}"]`);
  if (defaultPlanBtn) {
    defaultPlanBtn.classList.add("tsw-ds-plan-btn--selected");
    defaultPlanBtn.setAttribute("aria-pressed", "true");
  }
};

init();
