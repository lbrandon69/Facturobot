import * as React from "react";

interface TextHoverEffectProps {
  text: string;
  duration?: number;
  fontSize?: number;
  color?: string;
}

export function TextHoverEffect({ text, duration = 0.4, fontSize = 40, color = "#635bff" }: TextHoverEffectProps) {
  return (
    <span
      style={{
        display: "inline-block",
        fontWeight: 800,
        fontSize,
        color,
        cursor: "default",
        position: "relative",
        lineHeight: 1.1,
        letterSpacing: 2,
      }}
    >
      {text}
    </span>
  );
}
