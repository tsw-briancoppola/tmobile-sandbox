// =-=-
// IIFE
// =-=-

(() => {
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // DOM references and global variables
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  // DOM references
  const dsContaineriPhone = document.querySelector("#tsw-modal-iphone").querySelector("xpr-npi-content").shadowRoot;

  const joinButtonsiPhone = dsContaineriPhone.querySelectorAll(".tsw-ds-option-btn");
  const planButtonsiPhone = dsContaineriPhone.querySelectorAll(".tsw-ds-plan-btn");

  const oneTimeStrikeiPhone = dsContaineriPhone.querySelector(".tsw-ds-pricing-row__amount--strike");
  const oneTimeFinaliPhone = dsContaineriPhone.querySelector(".tsw-ds-pricing-row__amount--final");
  const monthlyAmountiPhone = dsContaineriPhone.querySelector(
    ".tsw-ds-pricing-row--monthly .tsw-ds-pricing-row__amount",
  );
  const monthlyLabeliPhone = dsContaineriPhone.querySelector(".tsw-ds-pricing-row--monthly .tsw-ds-pricing-row__name");
  const dueTodayAmountiPhone = dsContaineriPhone.querySelector(".tsw-ds-pricing-row__amount--due-today");

  const extraTextHTML = dsContaineriPhone.querySelector(".tsw-ds-pricing-row__extra-text");
  const legalTextHTML = dsContaineriPhone.querySelector(".tsw-ds-legal");

  // Plan values and conditional text
  const extraTextBring60 = "Get it ON US with a $100 rebate after three months of payment, plus applicable tax.";
  const legalNormal = "Bring your number pricing requires qualifying port-in from your current wireless&#160;carrier.";
  const legalBring60 =
    "ON US with $100 rebate: After your third month of service with your new line, you'll need to properly complete a form for a $100 virtual prepaid Mastercard, which you can use online or in stores; no cash access & expires in 6 months. Terms&#160;apply.";

  const plansiPhone = {
    oneTimeStrike: 599.99,
    get: {
      40: { oneTimeFinal: 449.99, monthly: 40, firstMonth: null, dueToday: 489.99 },
      50: { oneTimeFinal: 449.99, monthly: 50, firstMonth: 55, dueToday: 504.99 },
      60: { oneTimeFinal: 299.99, monthly: 55, firstMonth: 60, dueToday: 359.99 },
    },
    bring: {
      40: { oneTimeFinal: 399.99, monthly: 40, firstMonth: null, dueToday: 439.99 },
      50: { oneTimeFinal: 399.99, monthly: 50, firstMonth: 55, dueToday: 454.99 },
      60: {
        oneTimeFinal: 99.99,
        monthly: 55,
        firstMonth: 60,
        dueToday: 159.99,
        extraText: extraTextBring60,
        legalText: legalBring60,
      },
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
    const oneTimeStrike = plansiPhone.oneTimeStrike;
    const { oneTimeFinal, monthly, firstMonth, dueToday } = plansiPhone[join][plan];
    const extraText = plansiPhone[join][plan]?.extraText;
    const legalText = plansiPhone[join][plan]?.legalText;

    const label = firstMonth
      ? [`$${monthly}/mo. with AutoPay,`, `${formatPrice(firstMonth)} for first month`]
      : [`$${monthly}/mo.`, `Period.`];

    oneTimeStrikeiPhone.textContent = formatPrice(oneTimeStrike);
    oneTimeFinaliPhone.textContent = formatPrice(oneTimeFinal);
    monthlyAmountiPhone.textContent = formatPrice(firstMonth ?? monthly);
    monthlyLabeliPhone.innerHTML = label.join("<br>");
    dueTodayAmountiPhone.textContent = formatPrice(dueToday);

    extraTextHTML.hidden = true;
    if (extraText) {
      extraTextHTML.hidden = false;
      extraTextHTML.innerHTML = extraText;
    }

    legalTextHTML.innerHTML = legalNormal;
    if (legalText) {
      legalTextHTML.innerHTML = legalText;
    }
  };

  // =-=-=-=-=-=-=-=-=-=-=-
  // Button event listeners
  // =-=-=-=-=-=-=-=-=-=-=-

  joinButtonsiPhone.forEach((button) => {
    button.addEventListener("click", () => {
      const join = button.dataset.join;
      selectedJoin = join;

      joinButtonsiPhone.forEach((btn) => {
        btn.classList.remove("tsw-ds-option-btn--selected");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("tsw-ds-option-btn--selected");
      button.setAttribute("aria-pressed", "true");

      renderPaymentValues(join, selectedPlan);
    });
  });

  planButtonsiPhone.forEach((button) => {
    button.addEventListener("click", () => {
      const price = button.dataset.plan;
      selectedPlan = price;

      planButtonsiPhone.forEach((btn) => {
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

  const initiPhone = () => {
    renderPaymentValues(selectedJoin, selectedPlan);

    const defaultJoinBtn = dsContaineriPhone.querySelector(`.tsw-ds-option-btn[data-join="${selectedJoin}"]`);
    if (defaultJoinBtn) {
      defaultJoinBtn.classList.add("tsw-ds-option-btn--selected");
      defaultJoinBtn.setAttribute("aria-pressed", "true");
    }

    const defaultPlanBtn = dsContaineriPhone.querySelector(`.tsw-ds-plan-btn[data-plan="${selectedPlan}"]`);
    if (defaultPlanBtn) {
      defaultPlanBtn.classList.add("tsw-ds-plan-btn--selected");
      defaultPlanBtn.setAttribute("aria-pressed", "true");
    }
  };

  initiPhone();
})();
