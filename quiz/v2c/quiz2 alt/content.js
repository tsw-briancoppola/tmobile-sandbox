const panelContent = [
  {
    panel: 0,
    title: "Thinking about switching to T&#8209;Mobile?",
    paragraph:
      "We're here to make switching easy. Choose what you'd like more information on and we'll give you a customized how to switch checklist.",
  },
  {
    panel: 1,
    title: "Why are you interested in swtching to T&#8209;Mobile?",
    questionUI: {
      name: "tsw-why-interested",
      type: "radio",
      choices: [
        {
          value: "new device",
          text: "I want a deal on a new device",
        },
        {
          value: "fits budget",
          text: "I want a plan that fits my budget",
        },
        {
          value: "both",
          text: "Equally interested in both",
        },
        {
          value: "other",
          text: "Other",
        },
      ],
    },
  },
  {
    panel: 2,
    title: "Do you know what T&#8209;Mobile phone plan you want?",
    questionUI: {
      name: "tsw-know-plan",
      type: "radio",
      choices: [
        {
          value: "yes",
          text: "Yes, I already know my plan",
          answer: "Awesome! We'll help you figure out the rest of the switching process.",
        },
        {
          value: "not sure",
          text: "I'm not sure",
          answer: "That's okay, we'll help you find the perfect plan.",
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
          value: "1",
          text: "1",
        },
        {
          value: "2",
          text: "2",
        },
        {
          value: "3",
          text: "3",
        },
        {
          value: "4",
          text: "4",
        },
        {
          value: "5+",
          text: "5+",
        },
      ],
    },
  },
];

const planData = [{}];
