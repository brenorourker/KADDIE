import { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useColors } from "../theme/Theme";
import {
  controlSize,
  iconSize,
  radii,
  spacing,
  typography,
  type ColorTokens,
} from "../tokens";
import { ChevronDown, ChevronUp } from "./icons";
import { Menu, getMenuMaxHeight } from "./Menu";

export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  label: string;
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Number of options visible before scrolling. Defaults to 4. */
  visibleOptionCount?: number;
  containerStyle?: ViewStyle;
};

type MenuAnchor = {
  x: number;
  y: number;
  width: number;
  fieldHeight: number;
};

export function Dropdown({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  helperText,
  error,
  disabled = false,
  open,
  onOpenChange,
  visibleOptionCount = 4,
  containerStyle,
}: DropdownProps) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const containerRef = useRef<View>(null);
  const fieldWrapRef = useRef<View>(null);

  const isOpen = open ?? internalOpen;
  const selectedValue = value ?? internalValue;
  const isError = Boolean(error);
  const message = error ?? helperText;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  const hasValue = Boolean(selectedOption);
  const fieldBorderColor = disabled
    ? colors.border.default
    : isError
      ? colors.border.error
      : isOpen
        ? colors.border.focus
        : hasValue
          ? colors.border.strong
          : colors.border.default;
  const fieldBorderWidth = isOpen && !disabled && !isError ? 2 : 1;

  const setOpen = (nextOpen: boolean) => {
    if (disabled) {
      return;
    }
    if (open === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleSelect = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
    setOpen(false);
  };

  const menuMaxHeight = getMenuMaxHeight(visibleOptionCount);

  useEffect(() => {
    if (!isOpen || disabled || Platform.OS !== "web") {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const element = containerRef.current as unknown as HTMLElement | null;
      const target = event.target as Node | null;

      if (element && target && !element.contains(target)) {
        setOpen(false);
      }
    };

    const timeoutId = window.setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [disabled, isOpen]);

  useEffect(() => {
    if (!isOpen || disabled || Platform.OS === "web") {
      setMenuAnchor(null);
      return;
    }

    const frame = requestAnimationFrame(() => {
      fieldWrapRef.current?.measureInWindow((x, y, width, height) => {
        setMenuAnchor({ x, y, width, fieldHeight: height });
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [disabled, isOpen]);

  const renderMenu = () => (
    <Menu
      maxHeight={menuMaxHeight}
      onOptionPress={(option) => handleSelect(option.value!)}
      options={options}
      selectedValue={selectedValue}
      showSelectedCheck
      visible={isOpen}
    />
  );

  return (
    <View
      ref={containerRef}
      style={[styles.container, isOpen && styles.containerOpen, containerStyle]}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>
        {label}
      </Text>

      <View ref={fieldWrapRef} style={styles.fieldWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled, expanded: isOpen }}
          disabled={disabled}
          onPress={() => setOpen(!isOpen)}
          style={[
            styles.field,
            {
              borderColor: fieldBorderColor,
              borderWidth: fieldBorderWidth,
              backgroundColor: disabled
                ? colors.background.muted
                : colors.background.surface,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.fieldText,
              hasValue && !disabled
                ? styles.fieldTextValue
                : styles.fieldTextPlaceholder,
              disabled && styles.fieldTextDisabled,
            ]}
          >
            {selectedOption?.label ?? placeholder}
          </Text>
          {isOpen ? (
            <ChevronUp
              color={disabled ? colors.text.disabled : colors.text.primary}
              size={iconSize.md}
            />
          ) : (
            <ChevronDown
              color={disabled ? colors.text.disabled : colors.text.primary}
              size={iconSize.md}
            />
          )}
        </Pressable>

        {isOpen && !disabled && Platform.OS === "web" ? (
          <Menu
            maxHeight={menuMaxHeight}
            onOptionPress={(option) => handleSelect(option.value!)}
            options={options}
            placement="overlay"
            selectedValue={selectedValue}
            showSelectedCheck
            visible={isOpen}
          />
        ) : null}
      </View>

      {isOpen && !disabled && Platform.OS !== "web" && menuAnchor ? (
        <Modal
          animationType="none"
          onRequestClose={() => setOpen(false)}
          transparent
          visible
        >
          <Pressable
            accessibilityLabel="Close dropdown"
            accessibilityRole="button"
            onPress={() => setOpen(false)}
            style={styles.modalBackdrop}
          />
          <View
            style={[
              styles.modalMenuContainer,
              {
                left: menuAnchor.x,
                top: menuAnchor.y + menuAnchor.fieldHeight + spacing.xxs,
                width: menuAnchor.width,
              },
            ]}
          >
            {renderMenu()}
          </View>
        </Modal>
      ) : null}

      {message ? (
        <Text
          style={[
            styles.message,
            isError ? styles.messageError : styles.messageHelper,
            disabled && styles.messageDisabled,
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

function createStyles(colors: ColorTokens) {
  return StyleSheet.create({
    container: {
      gap: spacing.xxs,
      width: "100%",
      maxWidth: 320,
      zIndex: 1,
    },
    containerOpen: {
      overflow: "visible",
      zIndex: 50,
    },
    fieldWrap: {
      overflow: "visible",
      position: "relative",
      zIndex: 1,
    },
    label: {
      ...typography.labelDefault,
      color: colors.text.primary,
    },
    labelDisabled: {
      color: colors.text.disabled,
    },
    field: {
      height: controlSize.md,
      paddingHorizontal: spacing.md,
      borderRadius: radii.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    fieldText: {
      ...typography.bodyDefault,
      flex: 1,
      lineHeight: controlSize.md,
      includeFontPadding: false,
    },
    fieldTextValue: {
      color: colors.text.primary,
    },
    fieldTextPlaceholder: {
      color: colors.text.tertiary,
    },
    fieldTextDisabled: {
      color: colors.text.disabled,
    },
    message: {
      ...typography.caption,
    },
    messageHelper: {
      color: colors.text.tertiary,
    },
    messageError: {
      color: colors.feedback.error,
    },
    messageDisabled: {
      color: colors.text.disabled,
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    modalMenuContainer: {
      position: "absolute",
      zIndex: 1,
    },
  });
}
