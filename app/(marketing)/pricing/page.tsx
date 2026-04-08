export default function Pricing(){
    return  <section className="pricing-bg" id="pricing">
      <div className="section centered">
        <h2 className="section-title">Simple, honest pricing</h2>
        <p className="section-desc">The core app is completely free. Premium unlocks AI-powered features for those who want every possible advantage finding their pet.</p>
        <div className="pricing-grid">
          <div className="plan-card">
            <div className="plan-name">Free</div>
            <div className="plan-price free-price">Free</div>
            <div className="plan-yearly">Always free, no credit card needed</div>
            <div className="plan-divider"></div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Post lost &amp; found reports</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Browse the interactive map</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Vet &amp; shelter directory</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Community tips on reports</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> In-app messaging</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Printable flyer generator</div>
            <div className="plan-feature"><span className="plan-cross">&#x2013;</span> AI photo matching</div>
            <div className="plan-feature"><span className="plan-cross">&#x2013;</span> Scan online posts</div>
            <div className="plan-feature"><span className="plan-cross">&#x2013;</span> Biometric ID scanning</div>
            <div className="plan-feature"><span className="plan-cross">&#x2013;</span> Multi-photo upload (up to 5)</div>
            <a href="https://apps.apple.com/app/id6759967208" className="plan-btn plan-btn-free" target="_blank">Get Started Free</a>
          </div>
          <div className="plan-card featured">
            <div className="plan-badge">Most Popular</div>
            <div className="plan-name">Premium</div>
            <div className="plan-price"><sup>$</sup>4.99<span>/month</span></div>
            <div className="plan-yearly">or <strong>$49.99/year</strong> — save 2 months</div>
            <div className="plan-divider"></div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Everything in Free</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> <strong>AI photo matching</strong></div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> <strong>Scan online posts with AI</strong></div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> <strong>Biometric ID scanning</strong></div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Multi-photo upload (up to 5 photos)</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Unlimited reports &amp; pet profiles</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Area alerts for nearby pets</div>
            <div className="plan-feature"><span className="plan-check">&#x2713;</span> Boost report for extra visibility</div>
            <a href="https://apps.apple.com/app/id6759967208" className="plan-btn plan-btn-premium" target="_blank">Start Premium Trial</a>
          </div>
        </div>
        <p className="pricing-note">Subscriptions managed securely via the App Store &amp; Google Play. Cancel anytime.</p>
      </div>
    </section>
}