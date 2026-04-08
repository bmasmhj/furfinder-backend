export default function HowitWorks() {
    return  <><section className="section centered max-w-7xl mx-auto" id="how-it-works">
      <h2 className="section-title">Three steps. That's all it takes.</h2>
      <p className="section-desc">Getting started takes less than two minutes, whether you've lost a pet or found one wandering.</p>
      <div className="steps">
        <div className="step-card">
          <div className="step-num">1</div>
          <h3>Create a Report</h3>
          <p>Upload photos, describe your pet, drop a pin on the map where they were last seen or found, and hit submit. Done in under 2 minutes.</p>
          <span className="step-arrow">&#x2192;</span>
        </div>
        <div className="step-card">
          <div className="step-num">2</div>
          <h3>AI Scans for Matches</h3>
          <p>Our AI immediately compares your report against the entire database — analysing photos, breed, colour, markings, and location radius simultaneously.</p>
          <span className="step-arrow">&#x2192;</span>
        </div>
        <div className="step-card">
          <div className="step-num">3</div>
          <h3>Get Connected & Reunite</h3>
          <p>When a match is found, both parties are notified with a push alert. Message each other securely in the app and arrange a safe reunion.</p>
        </div>
      </div>
    </section>
     <section className="section centered max-w-7xl mx-auto" style={{ paddingTop: 0 }}>
      {/* <p style="font-size:14px;color:#9CA3AF;margin-bottom:20px;font-weight:500;text-transform:uppercase;letter-spacing:.5px">Works for all pet types</p> */}
         <h2 className="section-title">Works for all pet types</h2>
      <div className="pets-row">
        <div className="pet-pill"><span>&#x1F436;</span> Dogs</div>
        <div className="pet-pill"><span>&#x1F431;</span> Cats</div>
        <div className="pet-pill"><span>&#x1F426;</span> Birds</div>
        <div className="pet-pill"><span>&#x1F430;</span> Rabbits</div>
        <div className="pet-pill"><span>&#x1F40D;</span> Reptiles</div>
        <div className="pet-pill"><span>&#x1F439;</span> Small Animals</div>
        <div className="pet-pill"><span>&#x2764;&#xFE0F;</span> Any Other Pet</div>
      </div>
    </section>
     <section className="section max-w-7xl mx-auto" style={{ paddingTop: 0 }}>
      <div className="partner-section">
        <div className="partner-icon-wrap">&#x1F3E5;</div>
        <div>
          <h3>For Vets, Shelters &amp; Rescue Organisations</h3>
          <p>Register your organisation as an official Fur Finder partner. Animals in your care are listed in our public directory and automatically included in AI matching results — connecting lost pet owners directly to your shelter without any extra effort on your part.</p>
          <div className="partner-tags">
            <span className="partner-tag">Free Registration</span>
            <span className="partner-tag">AI Match Integration</span>
            <span className="partner-tag">Organisation Dashboard</span>
            <span className="partner-tag">Public Directory Listing</span>
            <span className="partner-tag">Admin Approval</span>
          </div>
        </div>
      </div>
    </section>

</>
}