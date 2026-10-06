import Link from "next/link";
import { FlowButtonContent } from "./FlowButton";

export function LinkButton({
  href,
  children,
  light = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`button flow-button${light ? " button-light" : ""} ${className}`}
    >
      <FlowButtonContent>{children}</FlowButtonContent>
    </Link>
  );
}
