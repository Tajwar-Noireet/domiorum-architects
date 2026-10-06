import Link from "next/link";

export function LinkButton({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link href={href} className={`button${light ? " button-light" : ""}`}>
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
