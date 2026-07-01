import type { TextStyle } from "react-native";
import { typography } from "./index";

export type TypographyStyleId = keyof typeof typography;

export type TypographyStyleEntry = {
  id: TypographyStyleId;
  name: string;
  description: string;
  sample: string;
  style: TextStyle;
  uppercase?: boolean;
};

export const typographyCatalog: TypographyStyleEntry[] = [
  {
    id: "displayLarge",
    name: "Display/Large",
    description: "Large hero text — splash screens, marketing surfaces",
    sample: "Build beautiful apps.",
    style: typography.displayLarge,
  },
  {
    id: "headingH1",
    name: "Heading/H1",
    description: "Top-level screen headings",
    sample: "Section title",
    style: typography.headingH1,
  },
  {
    id: "headingH2",
    name: "Heading/H2",
    description: "Group titles within a screen",
    sample: "Subsection heading",
    style: typography.headingH2,
  },
  {
    id: "headingH3",
    name: "Heading/H3",
    description: "Card titles, dialog titles",
    sample: "Card heading",
    style: typography.headingH3,
  },
  {
    id: "titleDefault",
    name: "Title/Default",
    description: "List rows, prominent labels",
    sample: "List item title",
    style: typography.titleDefault,
  },
  {
    id: "titleSmall",
    name: "Title/Small",
    description: "Dense lists, navigation labels",
    sample: "Compact title",
    style: typography.titleSmall,
  },
  {
    id: "bodyLarge",
    name: "Body/Large",
    description: "First paragraph in a screen",
    sample: "Lead paragraph for important descriptive content.",
    style: typography.bodyLarge,
  },
  {
    id: "bodyDefault",
    name: "Body/Default",
    description: "Default for paragraphs",
    sample: "Default body text. Used for most copy in the app.",
    style: typography.bodyDefault,
  },
  {
    id: "bodySmall",
    name: "Body/Small",
    description: "Helper text, captions in lists",
    sample: "Secondary body text or dense content.",
    style: typography.bodySmall,
  },
  {
    id: "labelDefault",
    name: "Label/Default",
    description: "Form field labels",
    sample: "Field label",
    style: typography.labelDefault,
  },
  {
    id: "labelSmall",
    name: "Label/Small",
    description: "Tags, chips, compact labels",
    sample: "Small label / tag text",
    style: typography.labelSmall,
  },
  {
    id: "buttonMd",
    name: "Button/Default",
    description: "Standard button text",
    sample: "Continue",
    style: typography.buttonMd,
  },
  {
    id: "buttonSm",
    name: "Button/Small",
    description: "Small / compact button text",
    sample: "Apply",
    style: typography.buttonSm,
  },
  {
    id: "caption",
    name: "Caption",
    description: "Form helpers, footnotes",
    sample: "Helper / caption text",
    style: typography.caption,
  },
  {
    id: "overline",
    name: "Overline",
    description: "Eyebrow text above headings, all caps",
    sample: "Section overline",
    style: typography.overline,
    uppercase: true,
  },
];
