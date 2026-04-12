import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "FAQ - The Fur Finder",
  description:
    "Frequently asked questions about The Fur Finder app and how it helps reunite lost pets with their families.",
};

async function getFaqs() {
  try {
    const faqs = await db.queryMany(
      'SELECT * FROM faqs WHERE is_active = true ORDER BY display_order ASC'
    );
    return faqs || [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  const groupedFaqs = faqs.reduce((acc: any, faq: any) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <section className="border-y border-border bg-muted/50" id="faq">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-[30px] font-bold tracking-[-0.5px] text-foreground">
          Common questions
        </h2>
        <p className="mx-auto mt-2.5 max-w-[580px] text-[15px] leading-[1.7] text-muted-foreground">
          Everything you need to know about The Fur Finder.
        </p>

        {Object.keys(groupedFaqs).length > 0 ? (
          <>
            {Object.entries(groupedFaqs).map(
              ([category, categoryFaqs]: [string, any]) => (
                <div key={category} className="mb-12 mt-8">
                  <h3 className="mb-6 text-left text-xl font-semibold text-foreground">
                    {category}
                  </h3>
                  <div className="mx-auto flex max-w-[720px] flex-col gap-3">
                    {categoryFaqs.map((faq: any) => (
                      <details
                        key={faq.id}
                        className="group rounded-[14px] border border-border bg-card transition-shadow open:border-primary/20 open:shadow-md"
                      >
                        <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-semibold text-foreground">
                          {faq.question}
                          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary transition-transform group-open:rotate-45 group-open:bg-primary group-open:text-white">
                            +
                          </span>
                        </summary>
                        <div className="border-t border-border px-6 pb-5 pt-4 text-left text-sm leading-[1.8] text-muted-foreground">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )
            )}
          </>
        ) : (
          <p className="mt-8 text-muted-foreground">No FAQs available at the moment.</p>
        )}
      </div>
    </section>
  );
}
