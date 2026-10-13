import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode; // whatever is placed between <Card> and </Card>
};

export default function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-xl border border-line bg-card p-6 sm:p-8">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
