const Logos1 = () => {
  const partners = [
    {
      name: "Astro",
      logo: "https://shadcnblocks.com/images/block/logos/astro.svg",
    },
    {
      name: "Vercel",
      logo: "https://shadcnblocks.com/images/block/logos/vercel.svg",
    },
    {
      name: "Astro",
      logo: "https://shadcnblocks.com/images/block/logos/astro.svg",
    },
    {
      name: "Supabase",
      logo: "https://shadcnblocks.com/images/block/logos/supabase.svg",
    },
    {
      name: "Figma",
      logo: "https://shadcnblocks.com/images/block/logos/figma.svg",
    },
  ];

  return (
    <section className="container flex flex-wrap items-center justify-between gap-12 py-32">
      <p className="text-lg leading-[140%] tracking-[-0.32px] text-primary">
        Used by the world&apos;s leading companies
      </p>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-6 opacity-70 grayscale lg:gap-[60px]">
        {partners.map((partner, index) => (
          <img
            key={index}
            src={partner.logo}
            alt={`${partner.name} logo`}
            width={109}
            height={48}
            className="object-contain"
          />
        ))}
      </div>
    </section>
  );
};

export default Logos1;
