import type { ButtonHTMLAttributes, ReactNode } from "react";
import { DirectionalArrow } from "./DirectionalArrow";

export function FlowButtonContent({ children }: { children: ReactNode }) {
  return (
    <>
      <DirectionalArrow className="flow-arrow flow-arrow-in" />
      <span className="flow-label">{children}</span>
      <DirectionalArrow className="flow-arrow flow-arrow-out" />
    </>
  );
}

export function FlowButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`button flow-button ${className}`}
      {...props}
    >
      <FlowButtonContent>{children}</FlowButtonContent>
    </button>
  );
}
