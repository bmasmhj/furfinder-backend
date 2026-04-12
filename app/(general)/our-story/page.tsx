export default function OurStoryPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20" id="our-story">
      <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-teal-50 p-12 dark:border-orange-900/30 dark:from-orange-950/20 dark:to-teal-950/20 max-md:p-8">
        {/* Decorative quote */}
        <div className="pointer-events-none absolute left-5 top-[-10px] font-serif text-[130px] leading-none text-primary opacity-[0.09]">
          &ldquo;
        </div>

        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
          &#x1F43E; Founder&apos;s Story
        </div>

        <h2 className="mb-6 text-2xl font-bold leading-[1.3] text-foreground">
          Why I Built The Fur Finder
        </h2>

        <div className="space-y-4 text-sm leading-[1.9] text-foreground/80">
          <p>Last year, my own dog Lucky went missing for two days, and I was devastated. I felt completely broken, unable to eat, and overwhelmed with fear and anxiety. I visited every vet, shelter, pound, and local park. I walked the streets, knocked on doors, and scoured Facebook lost and found pages, as well as community pages across different suburbs. But everything was scattered, and there wasn&apos;t one centralised place to get all the information I needed.</p>
          <p>Time was critical in locating Lucky. We live in an area with busy roads and reckless drivers, and I was terrified that he might be hurt. When I finally found him after two and a half days, he was traumatised, hungry, thirsty, and in pain. I was incredibly lucky to have found him, but not everyone is. There are elderly people and others who struggle to navigate multiple resources in the frantic moments after their pet goes missing.</p>
          <p>Every minute counts when a pet is lost. Too often, these animals end up in far-away pounds, shelters, or even in the hands of people who have no intention of returning them. Many owners are unable to find their pets because their microchip information or contact details haven&apos;t been updated. Too many lost pets live in shelters, never reunited with their loving owners, and both the pets and their families suffer.</p>
          <p>I see this situation every month when I come across lost animals, and I always try to help them reunite with their owners. Having gone through that heartbreak myself, I knew I had to do something to help in a more significant way. That&apos;s why I decided to create The Fur Finder — a platform that brings all the lost and found pet information into one place.</p>
          <p>The running costs of the app are covered by paid subscriptions, ensuring that it remains accessible to everyone, especially those who need it most. It was my own painful experience that motivated me to build this app, and I hope it helps reunite as many pets with their families as possible.</p>
        </div>

        <div className="mt-7 border-t border-orange-200 pt-5 text-sm font-semibold text-primary dark:border-orange-900/30">
          — Lucky &amp; Jaspreet, Founder of The Fur Finder &#x1F43E;
        </div>
      </div>
    </section>
  );
}