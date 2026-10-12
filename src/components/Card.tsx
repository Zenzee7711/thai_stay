import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode; // whatever is placed between <Card> and </Card>
};

export default function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-3xl border border-line bg-card p-6 motion-safe:animate-rise sm:p-8">
      <h2 className="text-xs font-medium tracking-[0.14em] text-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}
