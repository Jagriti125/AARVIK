import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Compass,
  CheckCircle2,
  PhoneCall,
  Package,
  Home,
  Mountain,
  Eye,
  Radio,
  FileWarning,
} from 'lucide-react';

const SafetyGuidelines = () => {
  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: '#F8FAF7' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-mountain)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            <ShieldAlert size={16} />
            <span>Community Preparedness</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
            Landslide Safety &amp; Emergency Preparedness Guidelines
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Understanding geological warning signs and maintaining family evacuation plans significantly minimizes risks in mountainous terrain.
          </p>
        </div>

        {/* Essential Safety Protocol Disclaimer */}
        <div
          className="card"
          style={{
            background: '#FEF3C7',
            border: '1.5px solid #FCD34D',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <AlertTriangle size={32} color="#B45309" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: '#92400E', lineHeight: 1.5 }}>
            <strong>Vital Field Rule:</strong> Never enter unstable scree slopes, swollen mountain gullies, or active rockfall zones to inspect terrain or take photos. These guidelines are general recommendations and do not supersede mandatory evacuation orders from local civil defense or the National Disaster Management Authority (NDMA).
          </div>
        </div>

        {/* Section 1: Warning Signs */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <Eye size={24} color="var(--color-mountain)" />
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)' }}>
              1. Early Warning Signs of Slope Movement
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ borderTop: '4px solid #D94F45' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Tension Cracks on Ground &amp; Pavement
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                Fresh cracks appearing on highways, retaining walls, paved driveways, or garden soil indicate tension pull from an advancing slump.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid #F2B84B' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Leaning Trees, Utility Poles &amp; Fences
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                Trees, electric poles, or retaining boundary walls tilting downhill or splaying apart are a classic sign of deep slow creep in soil strata.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid #436850' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Sudden Muddy Water Emergence
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                A sudden increase in water flow, new seepage springs emerging from a slope toe, or stream water turning suddenly thick and murky with silt.
              </p>
            </div>

            <div className="card" style={{ borderTop: '4px solid #202B27' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                Sticking Doors &amp; Foundation Cracking
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                Doors and window frames sticking or jamming for the first time, or masonry cracks separating exterior stairs from the main building.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Phase Protocols (Before, During, After) */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <ShieldCheck size={24} color="var(--color-mountain)" />
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)' }}>
              2. Actions Across Disaster Phases
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Before Heavy Rain */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'inline-block', background: 'var(--color-sage-light)', color: 'var(--color-primary-dark)', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                BEFORE RAINFALL
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                Pre-Monsoon Readiness
              </h3>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '0.5rem' }}>Clear hillside drains, gutters, and culverts around your property to prevent water ponding.</li>
                <li style={{ marginBottom: '0.5rem' }}>Identify two alternative evacuation routes leading to stable, designated higher ridge ground.</li>
                <li style={{ marginBottom: '0.5rem' }}>Avoid intensive excavations or cutting toes of steep slopes during the monsoon months.</li>
                <li>Keep emergency kit and battery communications fully charged.</li>
              </ul>
            </div>

            {/* During a Landslide */}
            <div className="card" style={{ padding: '1.75rem', border: '1.5px solid var(--risk-critical-border)' }}>
              <div style={{ display: 'inline-block', background: 'var(--risk-critical-bg)', color: 'var(--risk-critical)', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                DURING AN EVENT
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                Immediate Survival Actions
              </h3>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '0.5rem' }}><strong>Evacuate immediately</strong> if you hear cracking trees, rumbling sounds, or sudden mudflow.</li>
                <li style={{ marginBottom: '0.5rem' }}>If trapped inside and evacuation is impossible, move to an upper story room away from the slope side and curl into a fetal position under sturdy furniture.</li>
                <li style={{ marginBottom: '0.5rem' }}>If driving, do not attempt to cross flooded road dips or active rockfall zones; reverse carefully.</li>
                <li>Stay alert for sudden changes in river and creek water levels.</li>
              </ul>
            </div>

            {/* After a Landslide */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'inline-block', background: '#E0E7FF', color: '#3730A3', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                AFTER THE EVENT
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                Post-Event Recovery
              </h3>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem', color: 'var(--color-charcoal)', lineHeight: 1.6 }}>
                <li style={{ marginBottom: '0.5rem' }}>Stay away from the slide area. Secondary and tertiary slips frequently follow initial failures.</li>
                <li style={{ marginBottom: '0.5rem' }}>Check for damaged utility lines, severed gas lines, or broken water mains and report them immediately.</li>
                <li style={{ marginBottom: '0.5rem' }}>Check for trapped neighbors without entering directly into active debris paths.</li>
                <li>Listen to local radio or verified AARVIK advisories for authorized all-clear notices.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Emergency Kit & Essential Helplines */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Emergency Kit Checklist */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Package size={22} color="var(--color-mountain)" />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
                Essential "Go-Bag" Preparedness Kit
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Prepare an accessible, waterproof grab-and-go bag containing:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span>3 days drinking water</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span>Non-perishable food</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span>Battery torch &amp; extra cells</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span>First aid medicines</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span>Whistle (to signal location)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span>Aadhaar / ID in zip bag</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span>Portable power bank</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--risk-low)" />
                <span>Thermal foil emergency blanket</span>
              </div>
            </div>
          </div>

          {/* National Disaster Helplines */}
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <PhoneCall size={22} color="var(--color-mountain)" />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>
                Emergency Contacts &amp; Helplines
              </h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Direct national emergency response services (India):
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: '#F8FAF7', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                <span>National Emergency Number (All-in-one):</span>
                <strong style={{ color: 'var(--color-primary-dark)' }}>112</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: '#F8FAF7', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                <span>National Disaster Response Force (NDRF):</span>
                <strong style={{ color: 'var(--color-primary-dark)' }}>1078</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: '#F8FAF7', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                <span>State Disaster Management Control Room:</span>
                <strong style={{ color: 'var(--color-primary-dark)' }}>1070</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: '#F8FAF7', borderRadius: 'var(--radius-md)', fontSize: '0.9rem' }}>
                <span>District Disaster Helpline:</span>
                <strong style={{ color: 'var(--color-primary-dark)' }}>1077</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;
