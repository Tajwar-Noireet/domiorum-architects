import type { ReactNode } from "react";
import { HoverText } from "@/components/ui/HoverText";

export function ScrollTitle({ lines }: { lines: ReactNode[] }) {
  return (
    <span className="scroll-title" data-scroll-title>
      {lines.map((line, index) => (
        <span className="scroll-title-mask" key={index}>
          <span className="scroll-title-line" data-title-line>
            <HoverText>{line}</HoverText>
          </span>
          {index < lines.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

export function ScrollWords({ children }: { children: string }) {
  return (
    <span className="scroll-words" data-scroll-words>
      {children.split(/\s+/).map((word, index, words) => (
        <span key={index}>
          <span data-scroll-word>{word}</span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
