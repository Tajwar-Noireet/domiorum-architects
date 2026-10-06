import { LinkButton } from "@/components/ui/LinkButton";
export default function NotFound() {
  return (
    <section className="section page-section not-found">
      <p className="eyebrow">404 / Page not found</p>
      <h1>
        Let’s find
        <br />
        your way back.
      </h1>
      <p>This page may have moved, or the address may be incorrect.</p>
      <LinkButton href="/">Back to the homepage</LinkButton>
    </section>
  );
}
