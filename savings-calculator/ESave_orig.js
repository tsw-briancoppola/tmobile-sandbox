const savingsData = {
  benefitList: [
    { id: "netflix", active: ["ebeyond", "emore", "esave"], copy: "Netflix" },
    { id: "appletv", active: ["ebeyond", "emore", "esave"], copy: "Apple TV" },
    { id: "hulu", active: ["ebeyond", "esave"], copy: "Hulu" },
    { id: "satellite", active: ["ebeyond", "esave"], copy: "T-Satellite" },
    { id: "pricelock", active: ["ebeyond", "emore", "esave"], copy: "Price Guarantee" },
  ],
  tmobileData: {
    id: "tmo",
    name: "T-Mobile",
    plans: [
      {
        id: "esave",
        planName: "Experience Beyond Value",
        tagline: "Our most value-packed plan",
        selected: true,
        pricePoints: {
          id: "pricing",
          promo: true,
          segments: [{ id: "standard", maxlines: 6, minlines: 3, amounts: [0, 0, 140, 170, 200, 230] }],
        },
        benefits: [
          {
            id: "netflix",
            type: "streaming",
            value: "$7.99/mo.",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/netflix1.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [0, 0, 0, 0, 0, 0],
          },
          {
            id: "appletv",
            type: "streaming",
            value: "$9.99/mo.",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/apple-tv-updated.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [3, 3, 3, 3, 3, 3],
          },
          {
            id: "hulu",
            type: "streaming",
            value: "$11.99/mo.",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/hulu.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [0, 0, 0, 0, 0, 0],
          },
          {
            id: "satellite",
            type: "plan",
            value: "$10/mo. per line",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/t-sat-logo.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [0, 0, 0, 0, 0, 0],
          },
          { id: "pricelock", included: true, text: "5 Years", valuetable: false },
        ],
        additional_value: [
          {
            id: "hotspot",
            type: "plan",
            value: "$25/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "Unlimited high-speed mobile hotspot data (domestic)",
          },
          {
            id: "canmex",
            type: "plan",
            value: "$50/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "30GB high-speed data in Canada & Mexico",
          },
          {
            id: "int-data",
            type: "plan",
            value: "$100/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "30GB high-speed international data",
          },
          {
            id: "scamshield",
            type: "plan",
            value: "$4/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/scamshield-icon.svg",
            valuetable: true,
            copy: "ScamShield&trade; Premium",
          },
          {
            id: "thirdline",
            type: "plan",
            value: "$xx/mo.",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "Third line FREE included",
          },
          {
            id: "upgrade",
            type: "perks",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-smartphone.svg",
            valuetable: true,
            copy: "Option to upgrade your phone every two years",
          },
          {
            id: "deals",
            type: "perks",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-smartphone.svg",
            valuetable: true,
            copy: "New T-Mobile customers and existing customers get the same great phone deals every two years",
          },
        ],
      },
      {
        id: "ebeyond",
        planName: "Experience Beyond",
        tagline: "Our most value-packed plan",
        selected: false,
        pricePoints: {
          id: "pricing",
          promo: true,
          segments: [
            { id: "standard", maxlines: 6, amounts: [100, 170, 170, 215, 260, 305] },
            { id: "fiftyfive", maxlines: 2, copy: "w/ 55+ Savings", amounts: [85, 130] },
            { id: "military", maxlines: 6, copy: "w/ Military Savings", amounts: [85, 130, 165, 200, 235, 270] },
            {
              id: "firstrespond",
              maxlines: 6,
              copy: "w/ First Responder Savings",
              amounts: [85, 130, 165, 200, 235, 270],
            },
          ],
        },
        benefits: [
          {
            id: "netflix",
            type: "streaming",
            value: "$7.99/mo.",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/netflix1.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [0, 0, 0, 0, 0, 0],
          },
          {
            id: "appletv",
            type: "streaming",
            value: "$9.99/mo.",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/apple-tv-updated.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [3, 3, 3, 3, 3, 3],
          },
          {
            id: "hulu",
            type: "streaming",
            value: "$11.99/mo.",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/hulu.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [0, 0, 0, 0, 0, 0],
          },
          {
            id: "satellite",
            type: "plan",
            value: "$10/mo. per line",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/t-sat-logo.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [0, 0, 0, 0, 0, 0],
          },
          { id: "pricelock", included: true, text: "5 Years", valuetable: false },
        ],
        additional_value: [
          {
            id: "hotspot",
            type: "plan",
            value: "$25/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "Unlimited high-speed mobile hotspot data (domestic)",
          },
          {
            id: "canmex",
            type: "plan",
            value: "$50/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "30GB high-speed data in Canada & Mexico",
          },
          {
            id: "int-data",
            type: "plan",
            value: "$50/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "15GB high-speed international data",
          },
          {
            id: "scamshield",
            type: "plan",
            value: "$4/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/scamshield-icon.svg",
            valuetable: true,
            copy: "ScamShield&trade; Premium",
          },
          {
            id: "upgrade",
            type: "perks",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-smartphone.svg",
            valuetable: true,
            copy: "Option to upgrade your phone every year",
          },
          {
            id: "deals",
            type: "perks",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-smartphone.svg",
            valuetable: true,
            copy: "New T-Mobile customers and existing customers get the same great phone deals every year",
          },
        ],
      },
      {
        id: "emore",
        planName: "Experience More",
        tagline: "Our most popular plan",
        selected: false,
        pricePoints: {
          id: "pricing",
          promo: true,
          segments: [
            { id: "standard", maxlines: 6, amounts: [85, 140, 140, 170, 200, 230] },
            { id: "fiftyfive", maxlines: 2, copy: "w/ 55+ Savings", amounts: [70, 100] },
            { id: "military", maxlines: 6, copy: "w/ Military Savings", amounts: [70, 100, 120, 140, 160, 180] },
            {
              id: "firstrespond",
              maxlines: 6,
              copy: "w/ First Responder Savings",
              amounts: [70, 100, 120, 140, 160, 180],
            },
          ],
        },
        benefits: [
          {
            id: "netflix",
            type: "streaming",
            value: "$7.99/mo.",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/netflix1.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [0, 0, 0, 0, 0, 0],
          },
          {
            id: "appletv",
            type: "streaming",
            value: "$9.99/mo.",
            logo: "/content/dam/digx/tmobile/us/en/branding/logos/external/apple-tv-updated.svg",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            amounts: [3, 3, 3, 3, 3, 3],
          },
          { id: "pricelock", included: true, text: "5 Years", valuetable: false },
        ],
        additional_value: [
          {
            id: "hotspot",
            type: "plan",
            value: "$6/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "60GB high-speed mobile hotspot data (domestic)",
          },
          {
            id: "canmex",
            type: "plan",
            value: "$25/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "15GB high-speed data in Canada & Mexico",
          },
          {
            id: "int-data",
            type: "plan",
            value: "$35/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-checkmark.svg",
            valuetable: true,
            copy: "5GB high-speed international data",
          },
          {
            id: "scamshield",
            type: "plan",
            value: "$4/mo. per line",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/scamshield-icon.svg",
            valuetable: true,
            copy: "ScamShield&trade; Premium",
          },
          {
            id: "upgrade",
            type: "perks",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-smartphone.svg",
            valuetable: true,
            copy: "Option to upgrade your phone every two years",
          },
          {
            id: "deals",
            type: "perks",
            icon: "/content/dam/digx/tmobile/us/en/branding/logos/external/sc-smartphone.svg",
            valuetable: true,
            copy: "New T-Mobile customers and existing customers get the same great phone deals every two years",
          },
        ],
      },
      {
        id: "essentials",
        planName: "Essentials",
        tagline: "Our lowest price plan",
        selected: false,
        pricePoints: {
          id: "pricing",
          promo: true,
          segments: [
            { id: "standard", maxlines: 6, amounts: [60, 90, 90, 100, 120, 135] },
            { id: "fiftyfive", planName: "Essentials Choice 55", maxlines: 2, amounts: [45, 60] },
            { id: "military", maxlines: 6, copy: "w/ Military Savings", amounts: [45, 80, 90, 100, 110, 120] },
            {
              id: "firstrespond",
              maxlines: 6,
              copy: "w/ First Responder Savings",
              amounts: [45, 80, 90, 100, 110, 120],
            },
          ],
        },
        benefits: [],
        additional_value: [],
      },
      {
        id: "essentialssaver",
        planName: "Essentials Saver",
        tagline: "Our lowest price plan",
        selected: false,
        pricePoints: {
          id: "pricing",
          segments: [{ id: "standard", maxlines: 2, amounts: [50, 80] }],
        },
        benefits: [],
        additional_value: [],
      },
    ],
  },
  carrierList: [
    {
      id: "verizon",
      name: "Verizon",
      selected: true,
      setMobileSelect(newValue) {
        this.selected = newValue;
      },
      plans: [
        {
          id: "esave",
          planName: "Unlimited Ultimate",
          pricePoints: {
            id: "pricing",
            segments: [{ id: "standard", amounts: [90, 160, 195, 220, 275, 330] }],
          },
          benefits: [
            { id: "netflix", amounts: [10, 10, 10, 10, 10, 10], legal: "Optional Netflix & Max (With Ads) bundle" },
            { id: "appletv", amounts: [15, 15, 15, 15, 15, 15], legal: "Optional Apple One bundle" },
            { id: "hulu", amounts: [10, 10, 10, 10, 10, 10], legal: "Optional Disney+, Hulu, ESPN+ (With Ads) bundle" },
            {
              id: "satellite",
              amounts: [10, 20, 30, 40, 50, 60],
              legal: "Add T-Satellite—auto connects, powers your apps",
            },
            { id: "pricelock", included: true, text: "3 Years" },
          ],
        },
        {
          id: "ebeyond",
          planName: "Unlimited Ultimate",
          pricePoints: {
            id: "pricing",
            segments: [
              { id: "standard", amounts: [90, 160, 195, 220, 275, 330] },
              { id: "fiftyfive", copy: "&nbsp;", amounts: [90, 160] },
              { id: "military", copy: "w/ Military Discount", amounts: [80, 135, 170, 200, 255, 310] },
              { id: "firstrespond", copy: "w/ First Responder Discount", amounts: [80, 135, 170, 200, 255, 310] },
            ],
          },
          benefits: [
            { id: "netflix", amounts: [10, 10, 10, 10, 10, 10], legal: "Optional Netflix & Max (With Ads) bundle" },
            { id: "appletv", amounts: [15, 15, 15, 15, 15, 15], legal: "Optional Apple One bundle" },
            { id: "hulu", amounts: [10, 10, 10, 10, 10, 10], legal: "Optional Disney+, Hulu, ESPN+ (With Ads) bundle" },
            {
              id: "satellite",
              amounts: [10, 20, 30, 40, 50, 60],
              legal: "Add T-Satellite—auto connects, powers your apps",
            },
            { id: "pricelock", included: true, text: "3 Years" },
          ],
        },
        {
          id: "emore",
          planName: "Unlimited Ultimate",
          pricePoints: {
            id: "pricing",
            segments: [
              { id: "standard", amounts: [90, 160, 195, 220, 275, 330] },
              { id: "fiftyfive", copy: "&nbsp;", amounts: [90, 160] },
              { id: "military", copy: "w/ Military Discount", amounts: [80, 135, 170, 200, 255, 310] },
              { id: "firstrespond", copy: "w/ First Responder Discount", amounts: [80, 135, 170, 200, 255, 310] },
            ],
          },
          benefits: [
            { id: "netflix", amounts: [10, 10, 10, 10, 10, 10], legal: "Optional Netflix & Max (With Ads) bundle" },
            { id: "appletv", amounts: [15, 15, 15, 15, 15, 15], legal: "Optional Apple One bundle" },
            { id: "pricelock", included: true, text: "3 Years" },
          ],
        },
        {
          id: "essentials",
          planName: "Unlimited Welcome",
          pricePoints: {
            id: "pricing",
            segments: [
              { id: "standard", amounts: [65, 110, 120, 120, 150, 180] },
              { id: "fiftyfive", amounts: [65, 110, 120, 120, 150, 180] },
              { id: "military", copy: "w/ Military Discount", amounts: [55, 85, 95, 100, 130, 160] },
              { id: "firstrespond", copy: "w/ First Responder Discount", amounts: [55, 85, 95, 100, 130, 160] },
            ],
          },
        },
        {
          id: "essentialssaver",
          planName: "Unlimited Welcome",
          pricePoints: {
            id: "pricing",
            segments: [{ id: "standard", amounts: [65, 110] }],
          },
        },
      ],
    },
    {
      id: "att",
      name: "AT&T",
      selected: false,
      setMobileSelect(newValue) {
        this.selected = newValue;
      },
      plans: [
        {
          id: "esave",
          planName: "Unlimited Premium® PL",
          pricePoints: {
            id: "pricing",
            segments: [{ id: "standard", amounts: [85.99, 151.98, 182.97, 203.96, 229.95, 275.94] }],
          },
          benefits: [
            { id: "netflix", amounts: [7.99, 7.99, 7.99, 7.99, 7.99, 7.99], legal: "Sold separately" },
            { id: "appletv", amounts: [12.99, 12.99, 12.99, 12.99, 12.99, 12.99], legal: "Sold separately" },
            { id: "hulu", amounts: [11.99, 11.99, 11.99, 11.99, 11.99, 11.99], legal: "Sold separately" },
            {
              id: "satellite",
              amounts: [10, 20, 30, 40, 50, 60],
              legal: "Add T-Satellite—auto connects, powers your apps",
            },
            { id: "pricelock", included: true, text: "Not Included" },
          ],
        },
        {
          id: "ebeyond",
          planName: "Unlimited Premium® PL",
          pricePoints: {
            id: "pricing",
            segments: [
              { id: "standard", amounts: [85.99, 151.98, 182.97, 203.96, 229.95, 275.94] },
              { id: "fiftyfive", copy: "&nbsp;", amounts: [85.99, 151.98] },
              {
                id: "military",
                copy: "w/ Military Discount",
                amounts: [64.49, 113.98, 137.22, 152.96, 172.45, 206.94],
              },
              {
                id: "firstrespond",
                copy: "w/ First Responder Discount",
                amounts: [64.49, 113.98, 137.22, 152.96, 172.45, 206.94],
              },
            ],
          },
          benefits: [
            { id: "netflix", amounts: [7.99, 7.99, 7.99, 7.99, 7.99, 7.99], legal: "Sold separately" },
            { id: "appletv", amounts: [12.99, 12.99, 12.99, 12.99, 12.99, 12.99], legal: "Sold separately" },
            { id: "hulu", amounts: [11.99, 11.99, 11.99, 11.99, 11.99, 11.99], legal: "Sold separately" },
            {
              id: "satellite",
              amounts: [10, 20, 30, 40, 50, 60],
              legal: "Add T-Satellite—auto connects, powers your apps",
            },
            { id: "pricelock", included: true, text: "Not Included" },
          ],
        },
        {
          id: "emore",
          planName: "Unlimited Premium® PL",
          pricePoints: {
            id: "pricing",
            segments: [
              { id: "standard", amounts: [85.99, 151.98, 182.97, 203.96, 229.95, 275.94] },
              { id: "fiftyfive", copy: "&nbsp;", amounts: [85.99, 151.98] },
              {
                id: "military",
                copy: "w/ Military Discount",
                amounts: [64.49, 113.98, 137.22, 152.96, 172.45, 206.94],
              },
              {
                id: "firstrespond",
                copy: "w/ First Responder Discount",
                amounts: [64.49, 113.98, 137.22, 152.96, 172.45, 206.94],
              },
            ],
          },
          benefits: [
            { id: "netflix", amounts: [7.99, 7.99, 7.99, 7.99, 7.99, 7.99], legal: "Sold separately" },
            { id: "appletv", amounts: [12.99, 12.99, 12.99, 12.99, 12.99, 12.99], legal: "Sold separately" },
            { id: "pricelock", included: true, text: "Not Included" },
          ],
        },
        {
          id: "essentials",
          planName: "Unlimited Starter® EL",
          pricePoints: {
            id: "pricing",
            segments: [
              { id: "standard", amounts: [65.99, 121.98, 137.97, 143.96, 154.95, 185.94] },
              { id: "fiftyfive", planName: "55+", amounts: [40.0, 70.0] },
              { id: "military", copy: "w/ Military Discount", amounts: [49.49, 91.48, 103.47, 107.96, 116.2, 139.44] },
              {
                id: "firstrespond",
                copy: "w/ First Responder Discount",
                amounts: [49.49, 91.48, 103.47, 107.96, 116.2, 139.44],
              },
            ],
          },
        },
        {
          id: "essentialssaver",
          planName: "Unlimited Starter® EL",
          pricePoints: {
            id: "pricing",
            segments: [{ id: "standard", amounts: [65.99, 121.98] }],
          },
        },
      ],
    },
  ],
};

const planNotifications = [
  {
    crit: ["go5g-next", "age55"],
    lines: 2,
    headline: "Need 3 or more lines?",
    copy: "You'll save more on 3+ lines with the Standard version of this plan, thanks to our 3rd Line Discount promotion.",
  },
  {
    crit: ["age55"],
    lines: 2,
    headline: "Need 3 or more lines?",
    copy: "You'll save more on 3+ lines with the Standard version of this plan, thanks to our 3rd Line Free promotion.",
  },
  {
    crit: ["standard"],
    lines: 6,
    headline: "",
    copy: "You can only check out with a maximum of 5 devices at a time online. Looking to add more than 5 devices to your transaction?",
  },
];

// Method that creates a new plan card
function createPlanCard(theData) {
  let planItem = `
      <div `;
  if (theData.selected != null) {
    planItem += `tsw-selected="${theData.selected}" `;
  }
  planItem += `class="card ${theData.id}">
        <div class="card-head">
          <div class="content">
            <div class="plan">
              <h3>${theData.name}</h3>
              <span class="plan-title"></span>
            </div>
          </div>
        </div>

        <div class="card-desc"></div>
        <div class="card-total">
          <span class="line-desc est-total-hl">Estimated total</span>
          <div class="total-section">
            <span class="line-price total-price monthly price-ind">0.00</span>
            <div class="savings-banner"><span></span></div>
          </div>
        </div>
      </div>
    `;

  // Return the plan card
  return planItem;
}

// Method that creates a line item in the savings calculator
function createLineItem(theData, theBenefit) {
  // Get variables from selectors
  let lineAmount = findLineCount();
  let mySeg = findSegment();
  let tmoSelect = SAVINGSCALC.querySelector(".tsw-savings-calc .plan-selectors select#tmoplan");

  // Set initial line item html
  let lineItem = ``;

  if (theData.id == "pricing") {
    let price = "";
    theData.segments.forEach((seg) => {
      if (seg.id == mySeg) {
        price = seg.amounts[lineAmount - 1];
      }
    });
    lineItem = `
            <div class="line-item" tsw-type="${theData.id}">
                <span class="line-desc">
                ${lineAmount} line(s) w/ AutoPay`;
    if (
      mySeg == "standard" &&
      lineAmount >= 3 &&
      theData.promo != undefined &&
      theData.promo &&
      tmoSelect.value != "esave"
    ) {
      lineItem += `*`;
    }
    lineItem += `</span>
                <div class="price-wrapper">
                    <span class="line-price rate monthly price-ind">
                    ${price}
                    </span>
                </div>
            </div>`;
  } else {
    let myBenLine = theData.benefits.find((ben) => ben.id == theBenefit.id);
    if (myBenLine.included) {
      lineItem = `
                  <div class="line-item" tsw-type="${myBenLine.id}">
                    <span class="line-desc">${theBenefit.copy}</span>
                    <div class="price-wrapper">
                    <span class="line-price">${myBenLine.text}</span>
                  `;
      if (myBenLine.legal != undefined) {
        lineItem += `<span class="tsw-ben-legal">${myBenLine.legal}</span>`;
      }
      lineItem += `
                    </div>
                  </div>
                `;
    } else {
      let convertedValue;
      let myPriceClasses;
      let myValue = myBenLine.amounts[parseInt(lineAmount) - 1];

      if (myValue == 0) {
        convertedValue = "Included";
        myPriceClasses = "line-price";
      } else {
        convertedValue = myValue.toFixed(2);
        myPriceClasses = "line-price rate monthly price-ind";
      }

      lineItem = `
                <div class="line-item" tsw-type="${theBenefit.id}">
                  <span class="line-desc">${theBenefit.copy}</span>
                  <div class="price-wrapper">
                  <span class="${myPriceClasses}">${convertedValue}</span>
                `;
      if (myBenLine.legal != undefined) {
        lineItem += `<span class="tsw-ben-legal">${myBenLine.legal}</span>`;
      }
      lineItem += `
                  </div>
                </div>
                `;
    }
  }

  return lineItem;
}

// Function that creates the value table
function createValueTable() {
  // Find current tmo plan
  let myCurrPlan = SAVINGSCALC.querySelector(".tsw-savings-calc .plan-selectors select#tmoplan");
  let myValueData = savingsData.tmobileData.plans.find((plan) => plan.id == myCurrPlan.value);

  let myValueTable = VALUETABLE.querySelector(".tsw-value-table");

  // Update plan name
  myValueTable.querySelector(".vt-header h3 .plan-title").innerText = myValueData.planName;

  // Clear value sections
  myValueTable.querySelectorAll(".vt-section ul").forEach((list) => {
    list.innerHTML = "";
  });

  // Update value sections
  myValueData.benefits.forEach((bennie) => {
    if (bennie.valuetable) {
      let theSection = myValueTable.querySelector(`.vt-section[tsw-type='${bennie.type}'] ul`);
      // Create new line item
      let newLineItem = `<li><div class="vt-title"><img alt="" src="${bennie.icon}" />`;
      if (bennie.copy != undefined) {
        newLineItem += `<span class="desc">${bennie.copy}</span>`;
      }
      if (bennie.logo != undefined) {
        newLineItem += `<img class="${bennie.id} logo" alt="${bennie.id} logo" src="${bennie.logo}" />`;
      }
      newLineItem += `</div>`;
      if (bennie.value != undefined) {
        newLineItem += `<span class="price">${bennie.value} value</span>`;
      }
      newLineItem.innerHTML += `</li>`;
      // Append new item
      theSection.innerHTML += newLineItem;
    }
  });

  myValueData.additional_value.forEach((perk) => {
    if (perk.valuetable) {
      let theSection = myValueTable.querySelector(`.vt-section[tsw-type='${perk.type}'] ul`);
      // Create new line item
      let newLineItem = `<li><div class="vt-title"><img alt="" src="${perk.icon}" />`;
      if (perk.copy != undefined) {
        newLineItem += `<span class="desc">${perk.copy}</span>`;
      }
      if (perk.logo != undefined) {
        newLineItem += `<img class="${perk.id} logo" alt="${perk.id} logo" src="${perk.logo}" />`;
      }
      newLineItem += `</div>`;
      if (perk.value != undefined) {
        newLineItem += `<span class="price">${perk.value} value</span>`;
      }
      newLineItem.innerHTML += `</li>`;
      // Append new item
      theSection.innerHTML += newLineItem;
    }
  });
}

// Function that toggles the value table on/off depending on plan selection
function toggleValueTable() {
  let myPlan = SAVINGSCALC.querySelector(".tsw-savings-calc .plan-selectors select#tmoplan").value;
  let myValueTable = document.querySelector("#tswValueTable");
  if (myPlan == "essentials" || myPlan == "essentialssaver") {
    myValueTable.style.display = "none";
  } else {
    myValueTable.style.display = "block";
  }
}

// Method that calculates percent savings
function calculateSavings(compRate) {
  let tmoRate = parseFloat(
    SAVINGSCALC.querySelector(".tsw-savings-calc .calc-card-list .card.tmo .total-section .total-price").innerText
  );
  let calcSaving = compRate - tmoRate;

  // Convert to percentage
  let myDiff = tmoRate / compRate;
  myPercent = 1 - myDiff;
  myPercent *= 100;

  if (calcSaving < 0) {
    calcSaving = 0;
  }
  return myPercent.toFixed(0);
}

// Method that calculates the prices on each card
function calculatePrice() {
  let curNum = findLineCount();
  let currSeg = findSegment();
  SAVINGSCALC.querySelectorAll(".tsw-savings-calc .calc-card-list .card").forEach((card) => {
    let myBanner = card.querySelector(".savings-banner");
    myBanner.innerHTML = "";

    let runningTotal = 0;
    card.querySelectorAll(".rate").forEach((rate) => {
      runningTotal += parseFloat(rate.innerText);
    });

    let adjustedTotal = runningTotal.toFixed(2);
    card.querySelector(".total-price").innerText = adjustedTotal;

    // Adjust savings message
    if (!card.classList.contains("tmo")) {
      let myPercent = calculateSavings(adjustedTotal);

      // Blocker for no savings
      if (myPercent <= 0) {
        myBanner.innerHTML = "&nbsp;";
        return;
      }

      let savingsMsg = "Save about ";
      savingsMsg += myPercent;
      savingsMsg += "% with T&#8209;Mobile";
      myBanner.innerHTML = savingsMsg;
    } else if (
      card.classList.contains("tmo") &&
      curNum >= 3 &&
      currSeg == "standard" &&
      SAVINGSCALC.querySelector(".tsw-select select").value != "essentialssaver" &&
      SAVINGSCALC.querySelector(".tsw-select select").value != "esave"
    ) {
      myBanner.innerText = "*3rd line FREE!";
    } else {
      myBanner.innerHTML = "&nbsp;";
    }
  });
}

// Method that sets up the dropdown options
function setupDropdownOptions() {
  // Grab the dropdown selectors
  let tmoPlanDrop = SAVINGSCALC.querySelector(".tsw-savings-calc .plan-selectors select#tmoplan");
  let compPlanDrop = SAVINGSCALC.querySelector(".tsw-savings-calc .plan-selectors select#compplan");

  // Create new options
  savingsData.tmobileData.plans.forEach((plan) => {
    let newOption = document.createElement("option");
    newOption.setAttribute("value", plan.id);
    newOption.innerText = plan.planName;
    if (plan.selected) {
      newOption.setAttribute("selected", true);
    }
    tmoPlanDrop.append(newOption);
  });

  savingsData.carrierList.forEach((carrier) => {
    let newOption = document.createElement("option");
    newOption.setAttribute("value", carrier.id);
    newOption.innerText = carrier.name;
    if (carrier.selected) {
      newOption.setAttribute("selected", true);
    }
    compPlanDrop.append(newOption);
  });
}

// Method that checks the dropdown for the right selectors depending on plan conditions
function checkPlanDropdown() {
  // Grab the dropdown selectors
  let tmoPlanDrop = SAVINGSCALC.querySelector(".tsw-savings-calc .plan-selectors select#tmoplan");
  let mySegment = findSegment();
  let myOptions = tmoPlanDrop.options;

  // Signal whether we add/remove Essential Saver
  let optionFlag = false;

  // Signal whether we add/remove Experience Savings
  let saverFlag = false;

  // Get current line selection
  let myInput = SAVINGSCALC.querySelector(".tsw-savings-calc .device-selector .stepper input");
  let myValue = myInput.value;

  // Run through to make sure we handle Essential Saver Plan
  if (myValue > 2 || mySegment != "standard") {
    Array.prototype.forEach.call(myOptions, (option, index) => {
      if (option.value == "essentialssaver") {
        tmoPlanDrop.remove(index);
      }
    });
  } else if (myValue <= 2 && mySegment == "standard") {
    Array.prototype.forEach.call(myOptions, (option, index) => {
      if (option.value == "essentialssaver") {
        optionFlag = true;
      }
    });
    if (!optionFlag) {
      let newOption = document.createElement("option");
      newOption.setAttribute("value", "essentialssaver");
      newOption.innerText = "Essentials Saver";
      tmoPlanDrop.add(newOption);
    }
  }

  // Run through to make sure we handle Experience Saver Plan
  if (myValue <= 2 || mySegment != "standard") {
    Array.prototype.forEach.call(myOptions, (option, index) => {
      if (option.value == "esave") {
        tmoPlanDrop.remove(index);
      }
    });
  } else if (myValue > 2 && mySegment == "standard") {
    Array.prototype.forEach.call(myOptions, (option, index) => {
      if (option.value == "esave") {
        saverFlag = true;
      }
    });
    if (!saverFlag) {
      let newOption = document.createElement("option");
      newOption.setAttribute("value", "esave");
      newOption.innerText = "Experience Savings";
      tmoPlanDrop.insertBefore(newOption, tmoPlanDrop.querySelector("option:first-child"));
    }
  }

  checkStepper(SAVINGSCALC.querySelector(".tsw-savings-calc .device .stepper"));
}

// Method that checks the dropdown the competitor compare on mobile
function checkCompDropdown() {
  let myCompDrop = SAVINGSCALC.querySelector(".tsw-savings-calc .plan-selectors select#compplan");
  let myValue = myCompDrop.value;

  // Set object with new value
  savingsData.carrierList.forEach((carrier) => {
    if (carrier.id == myValue) {
      carrier.setMobileSelect(true);
    } else {
      carrier.setMobileSelect(false);
    }
  });

  SAVINGSCALC.querySelectorAll("[tsw-selected]").forEach((card) => {
    if (card.classList.contains(myValue)) {
      card.setAttribute("tsw-selected", true);
    } else {
      card.setAttribute("tsw-selected", false);
    }
  });
  checkStepper(SAVINGSCALC.querySelector(".tsw-savings-calc .device .stepper"));
}

/* Function that sets up the stepper functions for line counts */
function setupStepper(theStepper) {
  let stepUp = theStepper.querySelector("[step-up]");
  let stepDown = theStepper.querySelector("[step-down]");
  let myValue = theStepper.querySelector("input");

  if (stepUp != null) {
    stepUp.addEventListener("click", () => {
      let myPlanValue = SAVINGSCALC.querySelector(".tsw-sd-selection select").value;
      if (myValue.value < parseInt(myValue.getAttribute("max"))) {
        myValue.value++;
      }
      if (myValue.getAttribute("tsw-for") == "phone") {
        changeChartContent(myValue.value - 1, myPlanValue);
      }

      SAVINGSCALC.querySelectorAll(".stepper input").forEach((step) => {
        if (step.getAttribute("tsw-for") == "phone") {
          step.value = myValue.value;
        }
      });

      if (myValue.getAttribute("max") == myValue.value) {
        stepUp.setAttribute("active", false);
      } else {
        stepUp.setAttribute("active", true);
      }

      if (myValue.getAttribute("min") == myValue.value) {
        stepDown.setAttribute("active", false);
      } else {
        stepDown.setAttribute("active", true);
      }

      checkPlanDropdown();
      checkStepper(SAVINGSCALC.querySelector(".tsw-savings-calc .device .stepper"));
    });
  }

  if (stepDown != null) {
    stepDown.addEventListener("click", () => {
      let myPlanValue = SAVINGSCALC.querySelector(".tsw-sd-selection select").value;
      if (myValue.value > parseInt(myValue.getAttribute("min"))) {
        myValue.value--;
      }
      if (myValue.getAttribute("tsw-for") == "phone") {
        changeChartContent(myValue.value - 1, myPlanValue);
      }

      SAVINGSCALC.querySelectorAll(".stepper input").forEach((step) => {
        if (step.getAttribute("tsw-for") == "phone") {
          step.value = myValue.value;
        }
      });

      if (myValue.getAttribute("max") == myValue.value) {
        stepUp.setAttribute("active", false);
      } else {
        stepUp.setAttribute("active", true);
      }

      if (myValue.getAttribute("min") == myValue.value) {
        stepDown.setAttribute("active", false);
      } else {
        stepDown.setAttribute("active", true);
      }

      checkPlanDropdown();
      checkStepper(SAVINGSCALC.querySelector(".tsw-savings-calc .device .stepper"));
    });
  }

  myValue.addEventListener("change", () => {
    let myPlanValue = SAVINGSCALC.querySelector(".tsw-sd-selection select").value;
    if (myValue.getAttribute("tsw-for") == "phone") {
      changeChartContent(myValue.value - 1, myPlanValue);
    }

    SAVINGSCALC.querySelectorAll(".stepper input").forEach((step) => {
      if (step.getAttribute("tsw-for") == "phone") {
        step.value = myValue.value;
      }
    });

    if (myValue.getAttribute("max") == myValue.value) {
      stepUp.setAttribute("active", false);
    } else {
      stepUp.setAttribute("active", true);
    }

    if (myValue.getAttribute("min") == myValue.value) {
      stepDown.setAttribute("active", false);
    } else {
      stepDown.setAttribute("active", true);
    }

    checkPlanDropdown();
    checkStepper(SAVINGSCALC.querySelector(".tsw-savings-calc .device .stepper"));
  });
}

/* Function that checks the active states of stepper buttons */
function checkStepper(theStepper) {
  let stepUp = theStepper.querySelector("[step-up]");
  let stepDown = theStepper.querySelector("[step-down]");
  let myValue = theStepper.querySelector("input");

  if (myValue.getAttribute("max") == myValue.value) {
    stepUp.setAttribute("active", false);
  } else {
    stepUp.setAttribute("active", true);
  }

  if (myValue.getAttribute("min") == myValue.value) {
    stepDown.setAttribute("active", false);
  } else {
    stepDown.setAttribute("active", true);
  }
}

// Method that dynamically changes the content depending on user input
function changeChartContent(theNum, thePlan) {
  // Knockout the plan cards
  let myCardList = SAVINGSCALC.querySelector(".tsw-savings-calc .calc-card-list");
  myCardList.innerHTML = "";

  // Grab Segment and Line Amounts
  let currSegment = findSegment();
  let myLines = theNum + 1;

  // Build the cards
  myCardList.innerHTML += createPlanCard(savingsData.tmobileData);
  savingsData.carrierList.forEach((carrier) => {
    myCardList.innerHTML += createPlanCard(carrier);
  });

  myCardList.querySelectorAll(".card").forEach((card) => {
    // Grab benefits list of card
    let myBenLines = card.querySelector(".card-desc");
    myBenLines.innerHTML = "";

    if (card.classList.contains("tmo")) {
      // Find the pricing pertaining to segment
      savingsData.tmobileData.plans.forEach((plan) => {
        if (plan.id == thePlan) {
          // Append discount tag is applicable
          let cardSegment = plan.pricePoints.segments.find((theSeg) => theSeg.id == currSegment);
          let myPlanTitle;

          // Add plan name
          if (cardSegment.planName != undefined) {
            myPlanTitle = cardSegment.planName;
          } else {
            myPlanTitle = plan.planName;
          }

          if (cardSegment.id != "standard" && cardSegment.copy != undefined) {
            myPlanTitle += `<br>${cardSegment.copy}`;
          }

          card.querySelector(".plan-title").innerHTML = myPlanTitle;
          // Add pricing
          myBenLines.innerHTML += createLineItem(plan.pricePoints);

          // Add additional lines for each benefit
          savingsData.benefitList.forEach((benefit) => {
            if (benefit.active.includes(plan.id)) {
              myBenLines.innerHTML += createLineItem(plan, benefit);
            }
          });
        }
      });
    } else {
      savingsData.carrierList.forEach((carrier) => {
        if (card.classList.contains(carrier.id)) {
          // Add plan name
          carrier.plans.forEach((compplan) => {
            if (compplan.id == thePlan) {
              // Append discount tag is applicable
              let cardSegment = compplan.pricePoints.segments.find((theSeg) => theSeg.id == currSegment);
              let myPlanTitle;

              // Add plan name
              if (cardSegment.planName != undefined) {
                myPlanTitle = cardSegment.planName;
              } else {
                myPlanTitle = compplan.planName;
              }

              if (cardSegment.id != "standard" && cardSegment.copy != undefined) {
                myPlanTitle += `<br>${cardSegment.copy}`;
              }

              card.querySelector(".plan-title").innerHTML = myPlanTitle;
              // Add pricing
              myBenLines.innerHTML += createLineItem(compplan.pricePoints);
              // Add additional lines for each benefit
              savingsData.benefitList.forEach((benefit) => {
                if (benefit.active.includes(compplan.id)) {
                  myBenLines.innerHTML += createLineItem(compplan, benefit);
                }
              });
            }
          });
        }
      });
    }
  });

  /**********/
  calculatePrice();
  createValueTable();
  toggleValueTable();
  toggleNotification();
  checkStepper(SAVINGSCALC.querySelector(".tsw-savings-calc .device .stepper"));
}

/* Function that sets the segment in table */
function setSegment(theSeg) {
  let myInput = SAVINGSCALC.querySelector(".tsw-savings-calc .device-selector .stepper input");
  let myValue = myInput.value;

  let mySegBtns = SAVINGSCALC.querySelectorAll(".tsw-savings-calc .segment-selector button");

  // Get dropdown element
  let mySegmentDropdown = SAVINGSCALC.querySelector(".tsw-savings-calc .tsw-select select");
  let myOptions = mySegmentDropdown.options;
  let myCurrPlan = mySegmentDropdown.value;
  let optionFlag = false;

  mySegBtns.forEach((seg) => {
    if (seg.classList.contains("active")) {
      seg.classList.remove("active");
    }
  });

  SAVINGSCALC.querySelector('.tsw-savings-calc .segment-selector button[tsw-value="' + theSeg + '"]').classList.add(
    "active"
  );

  // Set conditionals for the stepper
  if (theSeg == "fiftyfive") {
    myInput.setAttribute("max", 2);
    if (myValue > 2) {
      myInput.value = 2;
      myValue = 2;
    }
  } else {
    myInput.setAttribute("max", 6);
  }

  checkPlanDropdown();
  changeChartContent(myValue - 1, myCurrPlan);
  checkStepper(SAVINGSCALC.querySelector(".tsw-savings-calc .device .stepper"));
}

/* Function that finds and returns current segment */
function findSegment() {
  let currSeg = SAVINGSCALC.querySelector(".tsw-savings-calc .segment-selector button.active").getAttribute(
    "tsw-value"
  );
  return currSeg;
}

/* Function that finds the current line amount */
function findLineCount() {
  return SAVINGSCALC.querySelector(".device-selector .device .stepper input").value;
}

/* Function that toggles the plan selector notification */
function toggleNotification() {
  let myPlan = SAVINGSCALC.querySelector(".tsw-sd-selection .tsw-select select").value;
  let mySegment = SAVINGSCALC.querySelector(".segment-selector button.active").getAttribute("tsw-value");
  let myLines = SAVINGSCALC.querySelector(".device-selector .device input").value;

  let myNotification = SAVINGSCALC.querySelector(".tsw-notification");

  if (mySegment == "fiftyfive" && myLines == 2) {
    myNotification.querySelector("span").innerText = planNotifications[1].headline;
    myNotification.querySelector("p").innerText = planNotifications[1].copy;
    if (!myNotification.classList.contains("active")) {
      myNotification.classList.add("active");
    }
    if (myNotification.classList.contains("caution")) {
      myNotification.classList.remove("caution");
    }
  } else if (myLines == 6) {
    myNotification.querySelector("span").innerText = planNotifications[2].headline;
    myNotification.querySelector("p").innerText = planNotifications[2].copy;
    if (!myNotification.classList.contains("active")) {
      myNotification.classList.add("active");
    }
    if (!myNotification.classList.contains("caution")) {
      myNotification.classList.add("caution");
    }
  } else {
    if (myNotification.classList.contains("active")) {
      myNotification.classList.remove("active");
    }
    if (!myNotification.classList.contains("caution")) {
      myNotification.classList.add("caution");
    }
  }
}

/* Function that initializes the cart start on CTA click */
async function scTriggerCartStart() {
  // Key Value Pairs
  const MY_PLAN_MAP = {
    segments: [
      { key: "standard", value: "Consumer" },
      { key: "fiftyfive", value: "55+" },
      { key: "military", value: "MILITARY" },
      { key: "firstrespond", value: "FIRST_RESPONDER" },
    ],
    action: [
      { key: ["standard", "ebeyond"], lines: [1, 2, 3, 4, 5, 6], value: "C25L2T1" },
      { key: ["standard", "emore"], lines: [1, 2, 3, 4, 5, 6], value: "C25L2T2" },
      { key: ["standard", "essentials"], lines: [3, 5, 6], value: "TESS2L" },
      { key: ["standard", "essentials"], lines: [1, 2], value: "PR1LESS" },
      { key: ["standard", "essentials"], lines: [4], value: "4LNESSPRO" },
      { key: ["fiftyfive", "ebeyond"], lines: [1, 2, 3, 4, 5, 6], value: "C255L2T1" },
      { key: ["fiftyfive", "emore"], lines: [1, 2, 3, 4, 5, 6], value: "C255L2T2" },
      { key: ["fiftyfive", "essentials"], lines: [1, 2, 3, 4, 5, 6], value: "ESENT552L" },
      { key: ["military", "ebeyond"], lines: [1, 2, 3, 4, 5, 6], value: "C25ML2T1" },
      { key: ["military", "emore"], lines: [1, 2, 3, 4, 5, 6], value: "C25ML2T2" },
      { key: ["military", "essentials"], lines: [1, 2, 3, 4, 5, 6], value: "ESSMIL2L" },
      { key: ["firstrespond", "ebeyond"], lines: [1, 2, 3, 4, 5, 6], value: "C25FL2T1" },
      { key: ["firstrespond", "emore"], lines: [1, 2, 3, 4, 5, 6], value: "C25FL2T2" },
      { key: ["firstrespond", "essentials"], lines: [1, 2, 3, 4, 5, 6], value: "ESSFR2L" },
    ],
  };

  // Get values from calculator
  let currentSegment = SAVINGSCALC.querySelector(".tsw-savings-calc .segment-selector .active").getAttribute(
    "tsw-value"
  );
  let currentLineAmount = SAVINGSCALC.querySelector(".tsw-savings-calc .device-selector .stepper input").value;
  let lineIntValue = parseInt(currentLineAmount);
  let currentPlanType = SAVINGSCALC.querySelector(".tsw-savings-calc .tsw-select select").value;

  // Map out routing for PHX ctas
  let phxSegment;
  MY_PLAN_MAP.segments.forEach((seg) => {
    if (seg.key == currentSegment) {
      phxSegment = seg.value;
    }
  });

  let phxSoc;
  MY_PLAN_MAP.action.forEach((posAction) => {
    if (
      posAction.key.includes(currentSegment) &&
      posAction.key.includes(currentPlanType) &&
      posAction.lines.includes(lineIntValue)
    ) {
      phxSoc = posAction.value;
    }
  });

  console.log("PHX Soc Set Success: " + phxSoc);

  // PHX Mapping
  window.phoenix.bus.publish("COUNTER", "CHANGE", { payload: { PHONES: parseInt(currentLineAmount) } });
  document
    .querySelector('[data-xpr-category-key="' + phxSegment + '"]')
    .querySelector("input")
    .click();
  await window.phoenix.persistedState.set("PLANS_LINES_INCREMENTOR", { PHONES: currentLineAmount });
  return phxSoc;
}

// Event listeners for generating new content per user input
window.onload = () => {
  // Setup the line selector stepper
  SAVINGSCALC.querySelectorAll(".stepper").forEach((stepper) => {
    setupStepper(stepper);
  });

  // Setup the plan selector
  SAVINGSCALC.querySelector(".tsw-sd-selection select").addEventListener("change", () => {
    let mySelect = SAVINGSCALC.querySelector(".tsw-sd-selection select");
    let myStepper = SAVINGSCALC.querySelector(".device-selector .device .stepper");
    let myInput = myStepper.querySelector("input");
    let myNum = myInput.value;
    changeChartContent(myNum - 1, mySelect.value);
    if (mySelect.value != "" && !mySelect.classList.contains("active")) {
      mySelect.classList.add("active");
    } else if (mySelect.value == "" && mySelect.classList.contains("active")) {
      mySelect.classList.remove("active");
    }

    // Set conditionals for essentials saver and experience savings
    let mySegments = SAVINGSCALC.querySelectorAll(".segment-selector button");

    // Conditions for Essential Saver and Experience Savings
    if (mySelect.value == "esave") {
      mySegments.forEach((seg) => {
        if (seg.getAttribute("tsw-value") == "standard") {
          seg.classList = "active";
        } else {
          seg.classList = "";
          seg.disabled = true;
        }
      });
      myInput.setAttribute("min", 3);
      myInput.setAttribute("max", 6);
    } else if (mySelect.value == "essentialssaver") {
      mySegments.forEach((seg) => {
        if (seg.getAttribute("tsw-value") == "standard") {
          seg.classList = "active";
        } else {
          seg.classList = "";
          seg.disabled = true;
        }
      });
      myInput.setAttribute("max", 2);
    } else {
      mySegments.forEach((seg) => {
        if (seg.disabled) {
          seg.disabled = false;
        }
      });
      if (findSegment() != "fiftyfive") {
        myInput.setAttribute("max", 6);
      }
      myInput.setAttribute("min", 1);
    }

    checkStepper(myStepper);
  });

  // Setup the competitor selector
  SAVINGSCALC.querySelector(".tsw-sd-selection select#compplan").addEventListener("change", checkCompDropdown);

  // Set up all the segment filtering
  let mySegments = SAVINGSCALC.querySelector(".tsw-savings-calc .segment-selector");
  mySegments.querySelectorAll("button").forEach((segBtn) => {
    segBtn.addEventListener("click", () => {
      setSegment(segBtn.getAttribute("tsw-value"));
    });
  });

  // Add event listener for starting cart after savings calculator selections
  if (document.querySelector("#savings-calc-cart-start") != null) {
    document.querySelector("#savings-calc-cart-start").addEventListener("click", () => {
      scTriggerCartStart().then((socValue) => {
        document.querySelector('[data-upf-plans-billing-soc="' + socValue + '"] .upf-planCard__CTA').click();
        console.log("Pass Success: " + socValue);
      });
    });
  }

  setupDropdownOptions();
  checkPlanDropdown();
  changeChartContent(3, "esave");
  checkStepper(SAVINGSCALC.querySelector(".tsw-savings-calc .device .stepper"));
};

// Setup globals for multiple NPI components
const SAVINGSCALC = document
  .querySelector("#tswSavingsCalc")
  .querySelector("xpr-npi-content")
  .shadowRoot.querySelector(".tsw-main");
const VALUETABLE = document
  .querySelector("#tswValueTable")
  .querySelector("xpr-npi-content")
  .shadowRoot.querySelector(".tsw-main");
