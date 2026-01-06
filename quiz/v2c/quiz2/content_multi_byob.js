const panelContentMultiBYOB = [
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
          answer: "We'll help you figure out the rest of the switching process.",
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
          answer: "We'll show you our best deals on the latest devices.",
        },
        {
          text: "I'm bringing my own device",
          value: "own",
          answer: "We'll ask you a few more questions about your device to make sure it's eligible.",
        },
        {
          text: "I'm bringing my current devices",
          value: "own multiple",
          answer: "We'll ask you a few more questions about your devices to make sure they're eligible.",
        },
      ],
    },
  },
  {
    panel: 5,
    title: "Would you like to trade-in your current device(s)?",
    question: {
      name: "tsw-trade-in",
      type: "radio",
      choices: [
        {
          text: "Yes, I'd like to trade-in at least one of my devices ",
          value: "yes",
          answer:
            "We'll give you the information to check your trade-in value and see what deals are available to you.",
        },
        {
          text: "No",
          value: "no",
          answer: "< 'No' text >",
        },
      ],
    },
  },
  {
    panel: 6,
    title: "Are your devices unlocked?",
    question: {
      name: "tsw-devices-unlocked",
      type: "radio",
      choices: [
        {
          text: "Yes, all of my devices are unlocked",
          value: "yes",
          answer:
            "We'll give you the information to check your trade-in value and see what deals are available to you.",
        },
        {
          text: "Some or all of my devices are locked",
          value: "some",
          answer: "We'll help you figure out how to unlock your devices.",
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
    panel: 7,
    title: "Do you want to keep your current phone numbers?",
    question: {
      name: "tsw-keep-current-numbers",
      type: "radio",
      choices: [
        {
          text: "Yes, I want to keep my current phone numbers",
          value: "yes",
          answer:
            "No problem. There is no charge for transferring your phone numbers and the transfer can take as little as 10 minutes.",
          button: {
            text: "Get my results",
            onClick: "next",
          },
        },
        {
          text: "No, I would like new phone numbers",
          value: "no",
          answer: "We'll get you set up with new numbers when you switch.",
          button: {
            text: "Get my results",
            onClick: "next",
          },
        },
        {
          text: "A mix of both",
          value: "both",
          answer:
            "We can give you information on keeping your numbers. For the lines needing new numbers, we'll set that up when you switch.",
          button: {
            text: "Get my results",
            onClick: "next",
          },
        },
      ],
    },
  },
  {
    panel: 8,
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
