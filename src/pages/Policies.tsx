import { SEO } from '../components/SEO';

export function Policies() {
  return (
    <div className="bg-sand-100 min-h-screen pt-40 pb-32">
      <SEO 
        title="Guest Guidelines & Concept Information | Dalisara"
        description="Booking rules, seasonal minimum stay policies, cancellation terms, accessibility information, and fictional concept details."
        canonical="/policies"
      />
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h1 className="font-serif text-5xl md:text-6xl italic tracking-tighter text-ink-900 mb-16">Policies & Information</h1>
        
        <div className="space-y-16">
          <section>
            <h2 className="uppercase tracking-[0.4em] opacity-40 text-[10px] mb-6 block">Reservation & Booking Rules</h2>
            <div className="space-y-6 text-ink-700 leading-relaxed text-sm opacity-90">
              <p><strong className="font-medium text-ink-900 block mb-1">Check-in / Check-out</strong> Check-in is at 3:00 PM (Asia/Manila time). Check-out is at 12:00 noon. Early check-in or late check-out is subject to availability and cannot be guaranteed at booking.</p>
              
              <p><strong className="font-medium text-ink-900 block mb-1">Minimum Stay Requirements</strong> 
                Based on the check-in date:<br/>
                • Green Season (1 June – 31 October): 2 nights<br/>
                • High Season (1 November – 19 December and 6 January – 31 May): 3 nights<br/>
                • Festive Season (20 December – 5 January): 5 nights<br/>
                <em>Festive Overlay:</em> If any night of the stay falls within the Festive Season dates, a 5-night minimum applies regardless of the check-in date.
              </p>

              <p><strong className="font-medium text-ink-900 block mb-1">Rate Plans & Cancellation</strong> 
                <strong>Flexible:</strong> 50% fictional deposit at booking. Fully refundable if canceled up to 14 calendar days before the check-in date. The remaining 50% is due at the 14-day cancellation boundary, after which the reservation is non-refundable.<br/>
                <strong>Advance Purchase:</strong> 15% discount off the accommodation nightly subtotal. 100% fictional prepayment required. Non-refundable and no modifications permitted.<br/>
                <strong>Stay Longer:</strong> 10% discount for eligible stays of 5 nights or more. Deposit and cancellation terms follow the Flexible rate plan.
              </p>
            </div>
          </section>

          <section>
            <h2 className="uppercase tracking-[0.4em] opacity-40 text-[10px] mb-6 block">Physical Accessibility</h2>
            <div className="space-y-4 text-ink-700 leading-relaxed text-sm opacity-90">
              <p>
                Dalisara features a predominantly step-free public spine connecting the arrival court, reception, The Shore Kitchen, Canopy Bar, Main Pool deck, and Wellness House. The Main Pool is equipped with an accessible entry solution.
              </p>
              <p>
                We offer one accessible Grove Pavilion and one accessible Family Pool Villa. These configurations include step-free routes, wider clearances, roll-in showers, and accessible bathroom layouts. Please note that private villa pools are not independently accessible. Beach access includes a firm boardwalk to the upper beach edge, but the soft sand and sea entry remain natural barriers.
              </p>
            </div>
          </section>

          <section>
            <h2 className="uppercase tracking-[0.4em] opacity-40 text-[10px] mb-6 block">Project Note / Concept Disclosure</h2>
            <div className="space-y-4 text-ink-700 leading-relaxed p-6 bg-sand-200 border-l border-ink-900/20 text-sm opacity-90">
              <p>
                <strong className="font-medium text-ink-900">Dalisara is a fictional resort concept.</strong> This website is a portfolio simulation built to demonstrate maximum presentation realism within a fictional-integrity boundary.
              </p>
              <p>
                There is no real reservation created, no payment processed, no real inventory queried, and no hotel enquiry delivered. No real-world operational consequences or business listings exist for this entity.
              </p>
            </div>
          </section>

          <section>
            <h2 className="uppercase tracking-[0.4em] opacity-40 text-[10px] mb-6 block">Privacy Behavior</h2>
            <div className="space-y-4 text-ink-700 leading-relaxed text-sm opacity-90">
              <p>
                Because Dalisara is a portfolio project and not an operating business, this application is designed not to durably store or transmit real guest personal data. 
              </p>
              <p>
                Any guest details entered during the simulated booking flow are held in temporary browser state purely to demonstrate the user interface sequence. The information is not sent to a real hotel database, nor is it stored permanently. No real payment or government identification information is requested or collected.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
