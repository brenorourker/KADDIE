import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceModeState = "listening" | "processing" | "responding" | "paused";

const LISTENING_MS = 4500;
const PROCESSING_MS = 2200;
const RESPONDING_MS = 5500;

type UseVoiceModeOptions = {
  getResponse: (index: number) => string;
};

export function useVoiceMode({ getResponse }: UseVoiceModeOptions) {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<VoiceModeState>("listening");
  const [response, setResponse] = useState<string | null>(null);
  const [responseIndex, setResponseIndex] = useState(0);
  const getResponseRef = useRef(getResponse);

  getResponseRef.current = getResponse;

  const open = useCallback(() => {
    setResponse(null);
    setState("listening");
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setState("listening");
    setResponse(null);
  }, []);

  const toggleMic = useCallback(() => {
    setState((current) => {
      if (current === "listening") return "paused";
      if (current === "paused") return "listening";
      return current;
    });
  }, []);

  const submitText = useCallback((_text: string) => {
    setState("processing");
  }, []);

  useEffect(() => {
    if (!visible || state === "paused") return;

    if (state === "listening") {
      const timer = setTimeout(() => setState("processing"), LISTENING_MS);
      return () => clearTimeout(timer);
    }

    if (state === "processing") {
      const timer = setTimeout(() => {
        setResponse(getResponseRef.current(responseIndex));
        setState("responding");
      }, PROCESSING_MS);
      return () => clearTimeout(timer);
    }

    if (state === "responding") {
      const timer = setTimeout(() => {
        setResponse(null);
        setResponseIndex((index) => index + 1);
        setState("listening");
      }, RESPONDING_MS);
      return () => clearTimeout(timer);
    }
  }, [responseIndex, state, visible]);

  return {
    visible,
    state,
    response,
    open,
    close,
    toggleMic,
    submitText,
  };
}

export function getVoiceModePrompt(state: VoiceModeState): string {
  switch (state) {
    case "listening":
      return "Speak now, I'm listening...";
    case "processing":
      return "Thinking...";
    case "paused":
      return "Tap the mic to continue";
    case "responding":
      return "";
  }
}
