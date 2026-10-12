import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode; // whatever is placed between <Card> and </Card>
};

export default function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
