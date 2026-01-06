const panelContentMulti = [
  {
    panel: 0,
    title: "Thinking about switching to T&#8209;Mobile?",
    text: [
      {
        type: "p",
        value:
          "Answer a few quick questions and we'll give you a customized checklist of everything you need to know about switching.",
      },
      {
        type: "button",
        text: "Get started",
        onClick: "next",
      },
    ],
  },
  {
    panel: 1,
    title: "Why are you interested in swtching to T&#8209;Mobile?",
    question: {
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
    question: {
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
    question: {
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
    question: {
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
    title: "Do you want to keep your current phone number?",
    question: {
      name: "tsw-keep-current-number",
      type: "radio",
      choices: [
        {
          text: "Yes, I want to keep my current phone number",
          value: "yes",
          answer:
            "No problem. There is no charge for transferring your phone number and the transfer can take as little as 10 minutes.",
          button: {
            text: "See my results",
            onClick: "next",
          },
        },
        {
          text: "No",
          value: "no",
          answer: "We'll get you set up with a new number when you switch.",
          button: {
            text: "See my results",
            onClick: "next",
          },
        },
      ],
    },
  },
  {
    panel: 6,
    title: "Here's what you'll need to switch",
    text: [
      {
        type: "list",
        items: [
          {
            text: "Pick your plan",
            url: "#",
          },
          {
            text: "Choose your new device",
            url: "#",
          },
          {
            text: "Unlock your device",
            url: "#",
          },
          {
            text: "Check your device compatibility (IMEI)",
            url: "#",
          },
          {
            text: "Trade-in your device",
            url: "#",
          },
          {
            text: "Check trade-in value",
            url: "#",
          },
          {
            text: "Transfer your phone number",
            url: "#",
          },
          {
            text: "Explore device deals",
            url: "#",
          },
        ],
      },
      {
        type: "p",
        value: [
          {
            text: "When you're ready, you can ",
          },
          {
            text: "switch online",
            url: "#",
          },
          {
            text: " or through the ",
          },
          {
            text: "T&#8209;Life app",
            url: "#",
          },
          {
            text: ".",
          },
        ],
      },
      {
        type: "p",
        value: [
          {
            text: "You can also ",
          },
          {
            text: "chat with us",
            url: "#",
          },
          {
            text: " or ",
          },
          {
            text: "find the closest store",
            url: "#",
          },
          {
            text: " if you need extra help.",
          },
        ],
      },
    ],
  },
];
