const panelContent = [
  {
    panel: 0,
    title: "Thinking about switching to T&#8209;Mobile?",
    text: [
      {
        type: "p",
        value:
          "Answer a few quick questions and we'll give you a customized checklist of everything you need to know about switching.",
      },
    ],
    helpButtons: [
      {
        text: "Phone Plans",
        name: "phone-plans",
        svg: "#tsw-help-button-phone-plans",
      },
      {
        text: "Devices & Offers",
        name: "devices-offers",
        svg: "#tsw-help-button-devices",
      },
      {
        text: "Making the Switch",
        name: "making-the-switch",
        svg: "#tsw-help-button-making-the-switch",
      },
      {
        text: "Pricing",
        name: "pricing",
        svg: "#tsw-help-button-pricing",
      },
    ],
  },
  {
    panel: 1,
    questions: [
      {
        title: "Do you know what T&#8209;Mobile phone plan you want?",
        name: "tsw-knows-plan",
        type: "radio",
        choices: [
          {
            text: "No, I don't know",
            value: "no",
            answer: "No problem, we'll show you all the great plans we offer.",
          },
          {
            text: "Yes, I already know my plan",
            value: "yes",
            answer: "Great! How many lines are you bringing over?",
          },
        ],
      },
    ],
  },
  {
    panel: 2,
    questions: [
      {
        title: "Do you need to buy a new device or are you bringing your own?",
        name: "tsw-device",
        type: "radio",
        choices: [
          {
            text: "I need to buy a new device",
            value: "buy",
          },
          {
            text: "I'm bringing in my own device",
            value: "own",
          },
          {
            text: "I'd like to trade in my current device",
            value: "trade",
          },
        ],
      },
      {
        title: "What phone brand(s) are you interested in?",
        name: "tsw-brands-interested",
        type: "checkbox",
        choices: [
          {
            text: "Apple",
            value: "apple",
          },
          {
            text: "Samsung",
            value: "samsung",
          },
          {
            text: "Motorola",
            value: "motorola",
          },
        ],
      },
    ],
  },
  {
    panel: 3,
    questions: [
      {
        title: "Would you like to explore pricing for devices, plans, or both?",
        name: "tsw-explore-pricing",
        type: "radio",
        choices: [
          {
            text: "Just devices",
            value: "just devices",
          },
          {
            text: "Just plans",
            value: "just plans",
          },
          {
            text: "Both devices and plans",
            value: "both",
          },
        ],
      },
      {
        title: "Do you want to check your trade-in value?",
        name: "tsw-check-value",
        type: "radio",
        choices: [
          {
            text: "Yes",
            value: "yes",
          },
          {
            text: "No",
            value: "no",
          },
        ],
      },
    ],
  },
  {
    panel: 4,
    title: "Here's what you'll need before you switch.",
    text: [
      {
        type: "p",
        subhead: "Current account number",
        value: [
          {
            text: "You can find your account number on one of the following: your paper bill, digital bill, or within your profile on your carrier's app. ",
          },
          {
            text: "Learn more",
            url: "#",
          },
        ],
      },
      {
        type: "p",
        subhead: "Check phone compatibility",
        value: [
          {
            text: "Make sure your phone is compatible with our network. ",
          },
          {
            text: "Check compatibility",
            url: "#",
          },
        ],
      },
      {
        type: "p",
        subhead: "Confirm your phone trade-in value",
        value: [
          {
            text: "Use our simple tool to estimate the value of your device. ",
          },
          {
            text: "Check trade-in",
            url: "#",
          },
        ],
      },
    ],
  },
];
