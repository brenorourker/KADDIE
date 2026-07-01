export type PlaygroundScreen =
  | "home"
  | "button"
  | "input"
  | "dropdown"
  | "icons"
  | "number-stepper"
  | "stepper"
  | "text-field"
  | "radio"
  | "checkbox"
  | "switch"
  | "chip"
  | "toggle-button"
  | "list"
  | "accordion"
  | "avatar"
  | "typography"
  | "colors"
  | "snackbar"
  | "media-card"
  | "banner-card"
  | "action-tile"
  | "app-bar"
  | "badge"
  | "modal";

export type PlaygroundEntry = {
  id: PlaygroundScreen;
  name: string;
};

export const playgroundRegistry: PlaygroundEntry[] = [
  { id: "colors", name: "Colors" },
  { id: "typography", name: "Typography" },
  { id: "icons", name: "Icons" },
  { id: "button", name: "Button" },
  { id: "input", name: "Input" },
  { id: "dropdown", name: "Dropdown" },
  { id: "number-stepper", name: "Number Stepper" },
  { id: "stepper", name: "Stepper" },
  { id: "text-field", name: "Text Field" },
  { id: "radio", name: "Radio" },
  { id: "checkbox", name: "Checkbox" },
  { id: "switch", name: "Switch" },
  { id: "chip", name: "Chip" },
  { id: "toggle-button", name: "Toggle Button" },
  { id: "list", name: "List" },
  { id: "accordion", name: "Accordion" },
  { id: "avatar", name: "Avatar" },
  { id: "snackbar", name: "Snackbar" },
  { id: "media-card", name: "Media Card" },
  { id: "banner-card", name: "Banner Card" },
  { id: "action-tile", name: "Action Tile" },
  { id: "app-bar", name: "App Bar" },
  { id: "badge", name: "Badge" },
  { id: "modal", name: "Modal" },
];
