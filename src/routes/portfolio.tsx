import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import heroImg from "@/assets/hero.jpg";
import kitchenImg from "@/assets/portfolio-kitchen.jpg";
import bedroomImg from "@/assets/portfolio-bedroom.jpg";
import officeImg from "@/assets/portfolio-office.jpg";
import wardrobeImg from "@/assets/portfolio-wardrobe.jpg";
import ceilingImg from "@/assets/portfolio-ceiling.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — NSS Home Designs" },
      { name: "description", content: "Selected interior design projects across Bengaluru — homes, kitchens, offices and more." },
      { property: "og:title", content: "Portfolio — NSS Home Designs" },
      { property: "og:description", content: "Selected interior design projects across Bengaluru." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Portfolio,
});

const projects = [
  { img: heroImg, title: "Noir Living", tag: "Living Room · Jayanagar", span: "lg:col-span-2 aspect-[16/10]" },
  { img: kitchenImg, title: "Onyx Kitchen", tag: "Modular Kitchen · Whitefield", span: "aspect-[4/5]" },
  { img: bedroomImg, title: "Serene Suite", tag: "Master Bedroom · HSR Layout", span: "aspect-[4/5]" },
  { img: officeImg, title: "Walnut Workspace", tag: "Office · Koramangala", span: "aspect-[4/5]" },
  { img: wardrobeImg, title: "Atelier Wardrobe", tag: "Walk-in Closet · Indiranagar", span: "aspect-[4/5]" },
  { img: ceilingImg, title: "Luminous Ceiling", tag: "False Ceiling · Electronic City", span: "lg:col-span-2 aspect-[16/10]" },
];

function Portfolio() {
  return (
    <SiteLayout>
      <section className="container-luxe pt-36 pb-12 md:pt-44 md:pb-20">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Portfolio</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
          Selected <span className="italic text-gold-gradient">work</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          A curated selection of homes, kitchens and workspaces we've designed across Bengaluru.
        </p>
      </section>

      <section className="container-luxe pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <figure key={p.title} className={`group overflow-hidden rounded-sm bg-card ${p.span}`}>
              <div className="relative h-full w-full overflow-hidden">
                <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-cream/70">{p.tag}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}