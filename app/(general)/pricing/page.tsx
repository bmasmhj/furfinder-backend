import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - The Fur Finder',
  description: 'Simple, honest pricing for The Fur Finder. Core app is free, premium unlocks AI-powered features.',
}

async function getPricingPlans() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/v1/public/pricing`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return []
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching pricing:', error)
    return []
  }
}

export default async function Pricing() {
  const plans = await getPricingPlans()

  return (
    <section className="pricing-bg" id="pricing">
      <div className="section centered">
        <h2 className="section-title">Simple, honest pricing</h2>
        <p className="section-desc">
          The core app is completely free. Premium unlocks AI-powered features for those who want every possible advantage finding their pet.
        </p>

        {plans.length > 0 ? (
          <>
            <div className="pricing-grid">
              {plans.map((plan: any) => (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.is_popular ? 'featured' : ''}`}
                >
                  {plan.is_popular && (
                    <div className="plan-badge">Most Popular</div>
                  )}
                  <div className="plan-name">{plan.name}</div>
                  <div className={`plan-price ${plan.name.toLowerCase() === 'free' ? 'free-price' : ''}`}>
                    {plan.name.toLowerCase() === 'free' ? (
                      'Free'
                    ) : (
                      <>
                        <sup>$</sup>
                        {plan.price}
                        <span>/{plan.billing_period}</span>
                      </>
                    )}
                  </div>
                  <div className="plan-yearly">{plan.description}</div>
                  <div className="plan-divider"></div>

                  {Array.isArray(plan.features) ? (
                    plan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="plan-feature">
                        <span className={feature.includes('✓') ? 'plan-check' : 'plan-cross'}>
                          {feature.includes('✓') ? '✓' : '–'}
                        </span>
                        {feature.replace('✓ ', '').replace('– ', '')}
                      </div>
                    ))
                  ) : null}

                  <a
                    href="https://apps.apple.com/app/id6759967208"
                    className={`plan-btn ${
                      plan.name.toLowerCase() === 'free'
                        ? 'plan-btn-free'
                        : 'plan-btn-premium'
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {plan.name.toLowerCase() === 'free'
                      ? 'Get Started Free'
                      : 'Start Premium Trial'}
                  </a>
                </div>
              ))}
            </div>
            <p className="pricing-note">
              Subscriptions managed securely via the App Store &amp; Google Play. Cancel anytime.
            </p>
          </>
        ) : (
          <p className="text-center text-[#6b7280]">No pricing plans available at the moment.</p>
        )}
      </div>
    </section>
  )
}
