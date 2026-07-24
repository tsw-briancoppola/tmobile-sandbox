// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// DOM references and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// DOM references
const dsContainerSamsung = document.querySelector("#tsw-modal-samsung").querySelector("xpr-npi-content").shadowRoot;

const joinButtons = dsContainerSamsung.querySelectorAll(".tsw-ds-option-btn");
const planButtons = dsContainerSamsung.querySelectorAll(".tsw-ds-plan-btn");
const monthlyAmount = dsContainerSamsung.querySelector(".tsw-ds-pricing-row--monthly .tsw-ds-pricing-row__amount");
const monthlyLabel = dsContainerSamsung.querySelector(".tsw-ds-pricing-row--monthly .tsw-ds-pricing-row__name");
const dueTodayAmount = dsContainerSamsung.querySelector(".tsw-ds-pricing-row__amount--due-today");

// Plan values
// Change these dollar values as needed
const plansSamsung = {
  40: { monthly: 40, firstMonth: null },
  50: { monthly: 50, firstMonth: 55 },
  60: { monthly: 60, firstMonth: 65 },
};

// Selected options (and default values on load)
let selectedJoin = "get";
let selectedPlan = "50";

// =-=-=-=-=-=-=-=-
// Helper functions
// =-=-=-=-=-=-=-=-

const formatPrice = (n) => `$${n.toFixed(2)}`;

const renderPaymentValues = (plan) => {
  const { monthly, firstMonth } = plansSamsung[plan];

  const label = firstMonth
    ? [`$${monthly}/mo. with AutoPay,`, `${formatPrice(firstMonth)} for first month`]
    : [`$${monthly}/mo. Period.`];

  monthlyAmount.textContent = formatPrice(firstMonth ?? monthly);
  monthlyLabel.innerHTML = label.join("<br>");
  dueTodayAmount.textContent = formatPrice(firstMonth ?? monthly);
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
    const price = button.dataset.plan;
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

  const defaultJoinBtn = dsContainerSamsung.querySelector(`.tsw-ds-option-btn[data-join="${selectedJoin}"]`);
  if (defaultJoinBtn) {
    defaultJoinBtn.classList.add("tsw-ds-option-btn--selected");
    defaultJoinBtn.setAttribute("aria-pressed", "true");
  }

  const defaultPlanBtn = dsContainerSamsung.querySelector(`.tsw-ds-plan-btn[data-plan="${selectedPlan}"]`);
  if (defaultPlanBtn) {
    defaultPlanBtn.classList.add("tsw-ds-plan-btn--selected");
    defaultPlanBtn.setAttribute("aria-pressed", "true");
  }
};

init();
