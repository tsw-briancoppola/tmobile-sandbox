// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// DOM references and global variables
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// DOM references
const dsContainerSamsung = document.querySelector("#tsw-modal-samsung").querySelector("xpr-npi-content").shadowRoot;

const joinButtonsSamsung = dsContainerSamsung.querySelectorAll(".tsw-ds-option-btn");
const planButtonsSamsung = dsContainerSamsung.querySelectorAll(".tsw-ds-plan-btn");

const oneTimeStrikeSamsung = dsContainerSamsung.querySelector(".tsw-ds-pricing-row__amount--strike");
const oneTimeFinalSamsung = dsContainerSamsung.querySelector(".tsw-ds-pricing-row__amount--final");
const monthlyAmountSamsung = dsContainerSamsung.querySelector(
  ".tsw-ds-pricing-row--monthly .tsw-ds-pricing-row__amount",
);
const monthlyLabelSamsung = dsContainerSamsung.querySelector(".tsw-ds-pricing-row--monthly .tsw-ds-pricing-row__name");
const dueTodayAmountSamsung = dsContainerSamsung.querySelector(".tsw-ds-pricing-row__amount--due-today");

// Plan values
// Change these dollar values as needed
const plansSamsung = {
  oneTimeStrike: 229.99,
  get: {
    40: { oneTimeFinal: 0, monthly: 40, firstMonth: null, dueToday: 40 },
    50: { oneTimeFinal: 0, monthly: 50, firstMonth: 55, dueToday: 55 },
    60: { oneTimeFinal: 0, monthly: 60, firstMonth: 65, dueToday: 65 },
  },
  bring: {
    40: { oneTimeFinal: 0, monthly: 40, firstMonth: null, dueToday: 40 },
    50: { oneTimeFinal: 0, monthly: 50, firstMonth: 55, dueToday: 55 },
    60: { oneTimeFinal: 0, monthly: 60, firstMonth: 65, dueToday: 65 },
  },
};

// Selected options (and default values on load)
let selectedJoin = "get";
let selectedPlan = "50";

// =-=-=-=-=-=-=-=-
// Helper functions
// =-=-=-=-=-=-=-=-

const formatPrice = (n) => `$${n.toFixed(2)}`;

const renderPaymentValues = (join, plan) => {
  const oneTimeStrike = plansSamsung.oneTimeStrike;
  const { oneTimeFinal, monthly, firstMonth, dueToday } = plansSamsung[join][plan];

  const label = firstMonth
    ? [`$${monthly}/mo. with AutoPay,`, `${formatPrice(firstMonth)} for first month`]
    : [`$${monthly}/mo.`, `Period.`];

  oneTimeStrikeSamsung.textContent = formatPrice(oneTimeStrike);
  oneTimeFinalSamsung.textContent = formatPrice(oneTimeFinal);
  monthlyAmountSamsung.textContent = formatPrice(firstMonth ?? monthly);
  monthlyLabelSamsung.innerHTML = label.join("<br>");
  dueTodayAmountSamsung.textContent = formatPrice(dueToday);
};

// =-=-=-=-=-=-=-=-=-=-=-
// Button event listeners
// =-=-=-=-=-=-=-=-=-=-=-

joinButtonsSamsung.forEach((button) => {
  button.addEventListener("click", () => {
    const join = button.dataset.join;
    selectedJoin = join;

    joinButtonsSamsung.forEach((btn) => {
      btn.classList.remove("tsw-ds-option-btn--selected");
      btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("tsw-ds-option-btn--selected");
    button.setAttribute("aria-pressed", "true");

    renderPaymentValues(join, selectedPlan);
  });
});

planButtonsSamsung.forEach((button) => {
  button.addEventListener("click", () => {
    const price = button.dataset.plan;
    selectedPlan = price;

    planButtonsSamsung.forEach((btn) => {
      btn.classList.remove("tsw-ds-plan-btn--selected");
      btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("tsw-ds-plan-btn--selected");
    button.setAttribute("aria-pressed", "true");

    renderPaymentValues(selectedJoin, price);
  });
});

// =-=-=-=
// On load
// =-=-=-=

const init = () => {
  renderPaymentValues(selectedJoin, selectedPlan);

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
