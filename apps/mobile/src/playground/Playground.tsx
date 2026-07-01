import { useState } from "react";
import { PlaygroundHome } from "./PlaygroundHome";
import { PlaygroundEntry, PlaygroundScreen } from "./registry";
import { ButtonPlayground } from "./screens/ButtonPlayground";
import { DropdownPlayground } from "./screens/DropdownPlayground";
import { IconsPlayground } from "./screens/IconsPlayground";
import { InputPlayground } from "./screens/InputPlayground";
import { NumberStepperPlayground } from "./screens/NumberStepperPlayground";
import { StepperPlayground } from "./screens/StepperPlayground";
import { CheckboxPlayground } from "./screens/CheckboxPlayground";
import { RadioPlayground } from "./screens/RadioPlayground";
import { SwitchPlayground } from "./screens/SwitchPlayground";
import { ChipPlayground } from "./screens/ChipPlayground";
import { ToggleButtonPlayground } from "./screens/ToggleButtonPlayground";
import { ListPlayground } from "./screens/ListPlayground";
import { AccordionPlayground } from "./screens/AccordionPlayground";
import { AvatarPlayground } from "./screens/AvatarPlayground";
import { TypographyPlayground } from "./screens/TypographyPlayground";
import { ColorsPlayground } from "./screens/ColorsPlayground";
import { SnackbarPlayground } from "./screens/SnackbarPlayground";
import { MediaCardPlayground } from "./screens/MediaCardPlayground";
import { BannerCardPlayground } from "./screens/BannerCardPlayground";
import { ActionTilePlayground } from "./screens/ActionTilePlayground";
import { AppBarPlayground } from "./screens/AppBarPlayground";
import { BadgePlayground } from "./screens/BadgePlayground";
import { ModalPlayground } from "./screens/ModalPlayground";
import { TextFieldPlayground } from "./screens/TextFieldPlayground";

type PlaygroundProps = {
  onClose?: () => void;
};

export function Playground({ onClose }: PlaygroundProps) {
  const [screen, setScreen] = useState<PlaygroundScreen>("home");

  const openComponent = (entry: PlaygroundEntry) => {
    setScreen(entry.id);
  };

  const goHome = () => {
    setScreen("home");
  };

  if (screen === "button") {
    return <ButtonPlayground onBack={goHome} />;
  }

  if (screen === "input") {
    return <InputPlayground onBack={goHome} />;
  }

  if (screen === "dropdown") {
    return <DropdownPlayground onBack={goHome} />;
  }

  if (screen === "icons") {
    return <IconsPlayground onBack={goHome} />;
  }

  if (screen === "number-stepper") {
    return <NumberStepperPlayground onBack={goHome} />;
  }

  if (screen === "stepper") {
    return <StepperPlayground onBack={goHome} />;
  }

  if (screen === "text-field") {
    return <TextFieldPlayground onBack={goHome} />;
  }

  if (screen === "radio") {
    return <RadioPlayground onBack={goHome} />;
  }

  if (screen === "checkbox") {
    return <CheckboxPlayground onBack={goHome} />;
  }

  if (screen === "switch") {
    return <SwitchPlayground onBack={goHome} />;
  }

  if (screen === "chip") {
    return <ChipPlayground onBack={goHome} />;
  }

  if (screen === "toggle-button") {
    return <ToggleButtonPlayground onBack={goHome} />;
  }

  if (screen === "list") {
    return <ListPlayground onBack={goHome} />;
  }

  if (screen === "accordion") {
    return <AccordionPlayground onBack={goHome} />;
  }

  if (screen === "avatar") {
    return <AvatarPlayground onBack={goHome} />;
  }

  if (screen === "typography") {
    return <TypographyPlayground onBack={goHome} />;
  }

  if (screen === "colors") {
    return <ColorsPlayground onBack={goHome} />;
  }

  if (screen === "snackbar") {
    return <SnackbarPlayground onBack={goHome} />;
  }

  if (screen === "media-card") {
    return <MediaCardPlayground onBack={goHome} />;
  }

  if (screen === "banner-card") {
    return <BannerCardPlayground onBack={goHome} />;
  }

  if (screen === "action-tile") {
    return <ActionTilePlayground onBack={goHome} />;
  }

  if (screen === "app-bar") {
    return <AppBarPlayground onBack={goHome} />;
  }

  if (screen === "badge") {
    return <BadgePlayground onBack={goHome} />;
  }

  if (screen === "modal") {
    return <ModalPlayground onBack={goHome} />;
  }

  return (
    <PlaygroundHome
      onSelect={openComponent}
      onClose={onClose}
    />
  );
}
