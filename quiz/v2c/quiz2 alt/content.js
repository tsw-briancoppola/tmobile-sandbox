const planData = [
  {
    title: "Experience beyond",
    tagline: "Most value packed",
    rate: "$100/month",
    rateStrikethrough: "$105",
    boldText: "for 1 phone line + taxes and fees",
  },
  {
    title: "Essentials",
    tagline: "Our lowest price",
    rate: "$60/month",
    rateStrikethrough: "$65",
    boldText: "for 1 phone line + taxes and fees",
  },
  {
    title: "Experience more",
    tagline: "Most popular plan",
    rate: "$85/month",
    rateStrikethrough: "$90",
    boldText: "for 1 phone line + taxes and fees",
  },
];

const panelContent = [
  {
    panel: 0,
    title: "Thinking about switching to T&#8209;Mobile?",
    content: [
      {
        text: "We're here to make switching easy. Choose what you'd like more information on and we'll give you a customized how to switch checklist.",
      },
    ],
  },
  {
    panel: 1,
    title: "Why are you interested in swtching to T&#8209;Mobile?",
    questionUI: {
      name: "tsw-why-interested",
      type: "radio",
      choices: [
        {
          text: "I want a deal on a new device",
          value: "new device",
        },
        {
          text: "I want a plan that fits my budget",
          value: "fits budget",
        },
        {
          text: "Equally interested in both",
          value: "both",
        },
        {
          text: "Other",
          value: "other",
        },
      ],
    },
  },
  {
    panel: 2,
    title: "Do you know what T&#8209;Mobile phone plan you want?",
    questionUI: {
      name: "tsw-knows-plan",
      type: "radio",
      choices: [
        {
          text: "Yes, I already know my plan",
          value: "yes",
          answer: "Awesome! We'll help you figure out the rest of the switching process.",
        },
        {
          text: "I'm not sure",
          value: "not sure",
          answer: "That's okay, we'll help you find the perfect plan.",
          supplemental: {
            type: "plan-data",
            data: planData,
          },
        },
      ],
    },
  },
  {
    panel: 3,
    title: "How many lines are you bringing?",
    questionUI: {
      name: "tsw-line-count",
      type: "radio",
      choices: [
        {
          text: "1",
          value: "1",
        },
        {
          text: "2",
          value: "2",
        },
        {
          text: "3",
          value: "3",
        },
        {
          text: "4",
          value: "4",
        },
        {
          text: "5+",
          value: "5+",
        },
      ],
    },
  },
  {
    panel: 4,
    title: "Do you need to buy a new device or are you bringing your own?",
    questionUI: {
      name: "tsw-which-device",
      type: "radio",
      choices: [
        {
          text: "I need to buy a new device",
          value: "buy",
        },
        {
          text: "I'm bringing my own device",
          value: "own",
        },
        {
          text: "I'd like to trade in my current device",
          value: "trade",
        },
      ],
    },
  },
  {
    panel: 5,
    title: "Is your device unlocked?",
    questionUI: {
      name: "tsw-device-unlocked",
      type: "radio",
      choices: [
        {
          text: "Yes",
          value: "yes",
          answer:
            "Having an unlocked device makes it even easier to complete the switching process, so you already have a head start.",
        },
        {
          text: "No",
          value: "no",
          answer: "We'll help you figure out how to unlock your device.",
        },
        {
          text: "I'm not sure",
          value: "not sure",
          answer:
            "That's okay! Most devices that are paid off are unlocked. We'll give you all the info you need to check if your device is unlocked.",
        },
      ],
    },
  },
  {
    panel: 6,
    title: "Do you want to keep your current phone number?",
    questionUI: {
      name: "tsw-keep-current-number",
      type: "radio",
      choices: [
        {
          text: "Yes, I want to keep my current phone number",
          value: "yes",
          answer:
            "No problem. There is no charge for transferring your phone number and the transfer can take as little as 10 minutes.",
        },
        {
          text: "No",
          value: "no",
          answer: "We’ll get you set up with a new number when you switch.",
        },
      ],
    },
  },
];
