export default function FaqPage(){
    return  <section className="faq-bg" id="faq">
      <div className="section centered">
        <h2 className="section-title">Common questions</h2>
        <p className="section-desc">Everything you need to know before downloading.</p>
        <div className="faq-list">
          <details open>
            <summary>Is The Fur Finder free to use? <span className="faq-icon">+</span></summary>
            <div className="faq-answer">Yes — downloading the app and posting lost or found reports is completely free, no credit card required. Premium ($4.99/month) unlocks AI photo matching, post scanning, and biometric identification for those who want the full toolkit.</div>
          </details>
          <details>
            <summary>How does the AI photo matching work? <span className="faq-icon">+</span></summary>
            <div className="faq-answer">When you upload a photo of your pet, our AI analyses it for visual characteristics — coat colour and patterns, facial features, markings, and body shape. It then compares these against every found pet report within your search radius and returns a ranked list of potential matches with a confidence percentage and written explanation.</div>
          </details>
          <details>
            <summary>I've found a stray — what should I do? <span className="faq-icon">+</span></summary>
            <div className="faq-answer">Open the app, tap "Report Found Pet", take a few photos, and drop a pin on the map where you found them. Our AI will immediately check it against all active lost reports in the area. You can also use the Quick Snap feature to photograph the pet and run a biometric scan to see if their owner has registered them. In the meantime, check if the pet is microchipped at your nearest vet — it's free.</div>
          </details>
          <details>
            <summary>My pet is lost right now — what do I do first? <span className="faq-icon">+</span></summary>
            <div className="faq-answer">Stay calm, then: 1) Post a lost report in the app immediately with the best photos you have. 2) Share the report to your local Facebook and community groups. 3) Contact nearby vets and shelters — the app's directory makes this easy. 4) Use the app's printable flyer feature to create posters you can put up in the area. 5) Enable area alerts so you're notified if someone finds a pet matching your description nearby.</div>
          </details>
          <details>
            <summary>What types of pets are supported? <span className="faq-icon">+</span></summary>
            <div className="faq-answer">Dogs, cats, birds, rabbits, reptiles, small animals (guinea pigs, hamsters, ferrets), and any other pet. When creating a report, simply select the pet type from the list — the AI matching adapts its analysis accordingly.</div>
          </details>
          <details>
            <summary>Is my personal information kept private? <span className="faq-icon">+</span></summary>
            <div className="faq-answer">Yes. Your phone number is optional and hidden from public view by default — you choose whether to show it. All messages between users happen inside the app so neither party needs to share personal contact details. We do not sell your data to third parties. You can read our full Privacy Policy for details.</div>
          </details>
          <details>
            <summary>I found my pet — how do I close my report? <span className="faq-icon">+</span></summary>
            <div className="faq-answer">Open your report, tap the "Mark as Reunited" button, and optionally share a short reunion message. Your report will move to the Happy Tails section, celebrating your reunion and giving hope to others. The report is no longer shown as active in the search.</div>
          </details>
          <details>
            <summary>Can vets, shelters, and rescues use the app? <span className="faq-icon">+</span></summary>
            <div className="faq-answer">Absolutely — and it's free. Organisations can register as a partner, list animals currently in their care, and have those animals automatically included in AI matching results. When a lost pet's owner runs a match, your shelter's animals appear in the results if they're a match. Register through the app under Settings → Register as Partner.</div>
          </details>
        </div>
      </div>
    </section>

}