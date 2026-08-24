import { SEO } from '../components/SEO';

export function Contact() {
  return (
    <div className="bg-sand-100 min-h-screen pt-40 pb-32">
      <SEO 
        title="Concierge & Arrival Inquiries | Dalisara"
        description="Direct concierge contact, arrival inquiries, and private transfer requests for Dalisara resort (Fictional Concept)."
        canonical="/contact"
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <header className="mb-24 md:w-2/3 border-b border-ink-900/10 pb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4 opacity-60">Directory</p>
          <h1 className="font-serif text-6xl md:text-[80px] leading-none tracking-tighter italic text-ink-900 mb-8">Contact</h1>
          <p className="text-sm text-ink-700 leading-relaxed max-w-lg opacity-80">
            We are here to assist with reservations, event inquiries, and special requests.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="space-y-16">
            <div>
              <h3 className="uppercase tracking-[0.4em] text-ink-900 opacity-60 text-[10px] mb-4">Reservations</h3>
              <p className="font-serif text-3xl italic tracking-tight text-ink-900 mb-2">reservations@dalisara-fictional.com</p>
              <p className="text-ink-700 opacity-80">+63 00 000 0000</p>
            </div>
            
            <div>
              <h3 className="uppercase tracking-[0.4em] text-ink-900 opacity-60 text-[10px] mb-4">General Inquiries</h3>
              <p className="font-serif text-3xl italic tracking-tight text-ink-900 mb-2">info@dalisara-fictional.com</p>
              <p className="text-ink-700 opacity-80">+63 00 000 0001</p>
            </div>

            <div>
              <h3 className="uppercase tracking-[0.4em] text-ink-900 opacity-60 text-[10px] mb-4">Address</h3>
              <p className="text-ink-900 leading-relaxed opacity-80">
                Long Beach, San Vicente<br />
                Palawan, Philippines<br />
                <span className="text-[10px] text-ink-900 opacity-40 mt-2 block tracking-widest">(Fictional Location)</span>
              </p>
            </div>
          </div>

          <div className="bg-sand-50 p-8 md:p-12 shadow-sm border border-ink-900/10">
            <h3 className="font-serif text-3xl italic tracking-tight text-ink-900 mb-8">Send an Inquiry</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full border-b border-ink-900/20 py-2 focus:outline-none focus:border-ink-900 bg-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full border-b border-ink-900/20 py-2 focus:outline-none focus:border-ink-900 bg-transparent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full border-b border-ink-900/20 py-2 focus:outline-none focus:border-ink-900 bg-transparent transition-colors resize-none"
                />
              </div>
              <button className="w-full py-4 bg-ink-900 text-sand-50 uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-ink-800 transition-colors mt-8">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
