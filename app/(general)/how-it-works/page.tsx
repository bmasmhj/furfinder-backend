import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works - The Fur Finder',
  description: 'Learn how The Fur Finder helps reunite lost pets with their families in just three simple steps.',
}

async function getHowItWorksSteps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/v1/public/how-it-works`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching how-it-works:', error)
    return []
  }
}

async function getWhoItsFor() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/v1/public/who-its-for`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching who-its-for:', error)
    return []
  }
}

export default async function HowitWorks() {
  const steps = await getHowItWorksSteps()
  const whoItsFor = await getWhoItsFor()

  return (
    <>
      <section className="section centered max-w-7xl mx-auto" id="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-desc">Getting started takes less than two minutes, whether you&apos;ve lost a pet or found one wandering.</p>

        {steps.length > 0 ? (
          <div className="steps">
            {steps.map((step: any) => (
              <div key={step.id} className="step-card">
                <div className="step-num">{step.step_number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {step !== steps[steps.length - 1] && (
                  <span className="step-arrow">→</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#6b7280]">No steps available at the moment.</p>
        )}
      </section>

      {whoItsFor.length > 0 && (
        <section className="section centered max-w-7xl mx-auto" style={{ paddingTop: 0 }}>
          <h2 className="section-title">Who It&apos;s For</h2>
          <div className="pets-row">
            {whoItsFor.map((item: any) => (
              <div key={item.id} className="pet-pill">
                {item.icon && <span>{item.icon}</span>}
                {item.title}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section max-w-7xl mx-auto" style={{ paddingTop: 0 }}>
        <div className="partner-section">
          <div className="partner-icon-wrap">🏥</div>
          <div>
            <h3>For Vets, Shelters &amp; Rescue Organisations</h3>
            <p>
              Register your organisation as an official Fur Finder partner. Animals in your care are listed in our public directory and automatically included in AI matching results — connecting lost pet owners directly to your shelter without any extra effort on your part.
            </p>
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
  )
}
