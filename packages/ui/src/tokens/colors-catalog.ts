export type ColorEntry = {
  id: string;
  value: string;
  usedBy: string[];
};

export type ColorGroup = {
  id: string;
  name: string;
  description: string;
  colors: ColorEntry[];
};

export const colorsCatalog: ColorGroup[] = [
  {
    id: "action",
    name: "Action",
    description: "Interactive fills and labels on buttons, chips, and controls.",
    colors: [
      {
        id: "action.primary",
        value: "#38E33C",
        usedBy: ["Button", "Checkbox", "Chip", "Radio", "Switch", "Toggle Button"],
      },
      {
        id: "action.primaryPressed",
        value: "#2FC933",
        usedBy: ["Button"],
      },
      {
        id: "action.onPrimary",
        value: "#000000",
        usedBy: ["Button", "Checkbox", "Chip", "Toggle Button"],
      },
      {
        id: "action.onSecondary",
        value: "#020617",
        usedBy: ["Button"],
      },
      {
        id: "action.onGhost",
        value: "#0F172A",
        usedBy: ["Button"],
      },
      {
        id: "action.ghostPressed",
        value: "#F1F5F9",
        usedBy: ["Button"],
      },
      {
        id: "action.destructive",
        value: "#EF4444",
        usedBy: ["Button"],
      },
      {
        id: "action.destructivePressed",
        value: "#DC2626",
        usedBy: ["Button"],
      },
      {
        id: "action.onDestructive",
        value: "#FFFFFF",
        usedBy: ["Button"],
      },
      {
        id: "action.disabled",
        value: "#E2E8F0",
        usedBy: ["Button"],
      },
      {
        id: "action.onDisabled",
        value: "#94A3B8",
        usedBy: ["Button"],
      },
    ],
  },
  {
    id: "text",
    name: "Text",
    description: "Foreground copy across labels, inputs, and list content.",
    colors: [
      {
        id: "text.primary",
        value: "#0F172A",
        usedBy: [
          "Accordion",
          "Chip",
          "Dropdown",
          "Icons",
          "Input",
          "List",
          "Number Stepper",
          "Text Field",
          "Toggle Button",
        ],
      },
      {
        id: "text.secondary",
        value: "#475569",
        usedBy: ["List", "Toggle Button"],
      },
      {
        id: "text.tertiary",
        value: "#64748B",
        usedBy: ["Dropdown", "Input", "Number Stepper", "Text Field", "Button"],
      },
      {
        id: "text.disabled",
        value: "#94A3B8",
        usedBy: [
          "Accordion",
          "Chip",
          "Dropdown",
          "Input",
          "Number Stepper",
          "Radio",
          "Text Field",
        ],
      },
    ],
  },
  {
    id: "background",
    name: "Background",
    description: "Surfaces and muted fills behind inputs and controls.",
    colors: [
      {
        id: "background.surface",
        value: "#FFFFFF",
        usedBy: [
          "Accordion",
          "Button",
          "Checkbox",
          "Chip",
          "Dropdown",
          "Input",
          "List",
          "Number Stepper",
          "Radio",
          "Switch",
          "Text Field",
          "Toggle Button",
        ],
      },
      {
        id: "background.muted",
        value: "#F1F5F9",
        usedBy: [
          "Avatar",
          "Button",
          "Checkbox",
          "Chip",
          "Dropdown",
          "Input",
          "Number Stepper",
          "Radio",
          "Switch",
          "Text Field",
          "Toggle Button",
        ],
      },
    ],
  },
  {
    id: "border",
    name: "Border",
    description: "Outlines for fields, chips, and dividers.",
    colors: [
      {
        id: "border.default",
        value: "#E2E8F0",
        usedBy: [
          "Accordion",
          "Checkbox",
          "Chip",
          "Dropdown",
          "Input",
          "Number Stepper",
          "Radio",
          "Text Field",
          "Toggle Button",
        ],
      },
      {
        id: "border.strong",
        value: "#CBD5E1",
        usedBy: [
          "Button",
          "Checkbox",
          "Chip",
          "Dropdown",
          "Input",
          "Number Stepper",
          "Radio",
          "Text Field",
        ],
      },
      {
        id: "border.focus",
        value: "#38E33C",
        usedBy: ["Dropdown", "Input", "Number Stepper", "Text Field"],
      },
      {
        id: "border.error",
        value: "#EF4444",
        usedBy: ["Dropdown", "Input", "Number Stepper", "Text Field"],
      },
    ],
  },
  {
    id: "feedback",
    name: "Feedback",
    description: "Validation, success, and informational states.",
    colors: [
      {
        id: "feedback.error",
        value: "#B91C1C",
        usedBy: ["Dropdown", "Input", "Number Stepper", "Text Field"],
      },
      {
        id: "feedback.successBg",
        value: "#ECFDEC",
        usedBy: ["Avatar", "List"],
      },
      {
        id: "feedback.successFg",
        value: "#239626",
        usedBy: ["Avatar", "List"],
      },
      {
        id: "feedback.infoBg",
        value: "#EFF6FF",
        usedBy: [],
      },
    ],
  },
  {
    id: "legacy",
    name: "Playground shell",
    description: "Legacy aliases used by the playground chrome and icons grid.",
    colors: [
      {
        id: "surface",
        value: "#FFFFFF",
        usedBy: ["Playground", "Icons"],
      },
      {
        id: "surfaceMuted",
        value: "#F3F4F6",
        usedBy: ["Playground", "Icons"],
      },
      {
        id: "textMuted",
        value: "#6B7280",
        usedBy: ["Playground", "Icons", "Button"],
      },
      {
        id: "borderLegacy",
        value: "#E5E7EB",
        usedBy: ["Playground", "Icons", "List"],
      },
    ],
  },
];
