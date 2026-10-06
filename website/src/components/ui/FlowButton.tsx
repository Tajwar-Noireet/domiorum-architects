import type { ButtonHTMLAttributes, ReactNode } from "react";

function Arrow({ className }: { className: string }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 12h16m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlowButtonContent({ children }: { children: ReactNode }) {
  return (
    <>
      <Arrow className="flow-arrow flow-arrow-in" />
      <span className="flow-label">{children}</span>
      <Arrow className="flow-arrow flow-arrow-out" />
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
