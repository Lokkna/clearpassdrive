// Section-level educational diagrams — one per numbered section, 10 chapters
// Compact card format (not full billboard) that introduces each section visually
// Consistent with the existing chapter diagram color palette:
//   navy #0f2040 · amber #f59e0b · slate #1e3a6e · text #e2e8f0 / #94a3b8

import React from 'react'

// ─── Reusable template components ────────────────────────────────────────────

const S: React.CSSProperties = {
  background: '#0f2040',
  borderRadius: '12px',
  border: '1px solid #1e3a6e',
  padding: '18px 24px',
  marginBottom: '24px',
  fontFamily: 'Outfit, sans-serif',
}

function StatCard({ value, unit, label, sub }: { value: string; unit?: string; label: string; sub: string }) {
  return (
    <div style={{ ...S, display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ minWidth: '80px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: '38px', fontWeight: 800, color: '#f59e0b', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>{value}</div>
        {unit && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{unit}</div>}
      </div>
      <div style={{ borderLeft: '2px solid #1e3a6e', paddingLeft: '20px', flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', fontFamily: 'Sora, sans-serif', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>{sub}</div>
      </div>
    </div>
  )
}

function RuleCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div style={{ ...S, display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '26px', flexShrink: 0, lineHeight: 1, marginTop: '2px' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', fontFamily: 'Sora, sans-serif', marginBottom: '5px' }}>{title}</div>
        <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.65 }}>{text}</div>
      </div>
    </div>
  )
}

function Steps({ label, steps, horizontal }: { label: string; steps: string[]; horizontal?: boolean }) {
  return (
    <div style={S}>
      <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexDirection: horizontal ? 'row' : 'column' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#f59e0b', color: '#0f2040', fontWeight: 800, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
            <span style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Comparison({ leftLabel, rightLabel, leftColor, rightColor, rows }: {
  leftLabel: string; rightLabel: string; leftColor: string; rightColor: string; rows: [string, string][]
}) {
  return (
    <div style={S}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: leftColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{leftLabel}</div>
          {rows.map(([left], i) => (
            <div key={i} style={{ fontSize: '12px', color: '#e2e8f0', padding: '5px 0', borderBottom: '1px solid #1e3a6e', lineHeight: 1.4 }}>{left}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: rightColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{rightLabel}</div>
          {rows.map(([, right], i) => (
            <div key={i} style={{ fontSize: '12px', color: '#e2e8f0', padding: '5px 0', borderBottom: '1px solid #1e3a6e', lineHeight: 1.4 }}>{right}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DataTable({ headers, rows, caption }: { headers: string[]; rows: string[][]; caption?: string }) {
  return (
    <div style={S}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ textAlign: 'left', color: '#f59e0b', fontFamily: 'Sora, sans-serif', fontSize: '11px', fontWeight: 700, padding: '4px 8px 8px', borderBottom: '1px solid #1e3a6e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: '6px 8px', color: ci === 0 ? '#e2e8f0' : '#94a3b8', borderBottom: '1px solid #1e3a6e', lineHeight: 1.4 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <div style={{ fontSize: '11px', color: '#475569', marginTop: '10px', fontStyle: 'italic' }}>{caption}</div>}
    </div>
  )
}

function TagRow({ items }: { items: { label: string; color: string; sub?: string }[] }) {
  return (
    <div style={{ ...S, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {items.map(({ label, color, sub }) => (
        <div key={label} style={{ background: '#1e3a6e', borderRadius: '8px', padding: '10px 16px', minWidth: '100px', flex: '1' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color, fontFamily: 'Sora, sans-serif' }}>{label}</div>
          {sub && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{sub}</div>}
        </div>
      ))}
    </div>
  )
}

// ─── Section diagram lookup ───────────────────────────────────────────────────
// Key = section header text (must match content array entry exactly, including number prefix)

const diagrams: Record<string, JSX.Element> = {

  // ── Chapter 1 ──────────────────────────────────────────────────────────────

  '1.2 Your Driver\'s License: Rights and Responsibilities': (
    <Comparison
      leftLabel="Suspended" leftColor="#f59e0b"
      rightLabel="Revoked" rightColor="#ef4444"
      rows={[
        ['Privilege temporarily removed', 'License cancelled entirely'],
        ['Can be reinstated when conditions met', 'Must reapply from scratch — including testing'],
        ['Caused by point accumulation, unpaid fines', 'Caused by DUI, serious or repeat offenses'],
        ['Still shows on driving record', 'Reapplication not guaranteed to succeed'],
      ]}
    />
  ),

  '1.3 The Point System: How California Tracks Your Driving': (
    <DataTable
      headers={['Points Accumulated', 'Time Window', 'DMV Action']}
      rows={[
        ['4 points', '12 months', 'Warning letter'],
        ['6 points', '24 months', 'Probation'],
        ['8 points', '36 months', 'License suspension — Negligent Operator'],
        ['Minor violation', '—', '1 point · stays 3 years'],
        ['Major violation (DUI, reckless)', '—', '2 points · stays 7–10 years'],
      ]}
      caption="Traffic school can mask one point from your insurance record — usable once every 18 months."
    />
  ),

  '1.8 Traffic Violations and Their Consequences': (
    <Comparison
      leftLabel="Infraction" leftColor="#f59e0b"
      rightLabel="Misdemeanor" rightColor="#ef4444"
      rows={[
        ['Minor violation', 'Serious criminal offense'],
        ['Examples: speeding, red light, no signal', 'Examples: DUI, reckless driving, hit and run'],
        ['Fine + points on record', 'Fine + possible jail time + points'],
        ['No criminal record', 'Criminal record created'],
        ['Insurance rate increase likely', 'License suspension or revocation likely'],
      ]}
    />
  ),

  '1.11 Knowing Your Legal Obligations After a Collision': (
    <Steps label="What California law requires you to do after a collision" steps={[
      'Stop immediately — leaving the scene is a crime',
      'Move to a safe location if possible without leaving the scene',
      'Call 911 if anyone is injured — do not wait',
      'Exchange name, license, registration, and insurance with all drivers',
      'File an SR-1 report with the DMV within 10 days if injuries or damage exceeds $1,000',
    ]} />
  ),

  '1.12 Understanding Traffic Law Philosophy': (
    <RuleCard
      icon="⚖️"
      title="Why traffic laws exist"
      text="Traffic laws create shared expectations that allow millions of strangers to navigate the same roads safely. When every driver at a four-way stop knows the same rule, the intersection works predictably. Compliance is not submission — it is participation in a cooperative system that protects human life."
    />
  ),

  '1.13 The California Vehicle Code — A Closer Look at Key Sections': (
    <TagRow items={[
      { label: 'CVC §22350', color: '#f59e0b', sub: 'Basic Speed Law — always drive at a safe speed for conditions' },
      { label: 'CVC §21453', color: '#3b82f6', sub: 'Red light — stop before limit line, crosswalk, or intersection' },
      { label: 'CVC §14601', color: '#ef4444', sub: 'Suspended license — misdemeanor, up to $1,000 fine + jail' },
      { label: 'CVC §20001', color: '#ef4444', sub: 'Hit and run with injury — felony, up to 4 years prison' },
    ]} />
  ),

  '1.15 Driving Records and Their Long-Term Impact': (
    <StatCard
      value="20–30%"
      unit="or more"
      label="Average insurance rate increase from a single speeding ticket"
      sub="Points stay on your driving record for 3 years for minor violations, 7–10 years for major ones. Traffic school can mask the point from your insurer — but not from your DMV record or employer background checks."
    />
  ),

  'A.1 The History of Traffic Safety in California': (
    <Comparison
      leftLabel="1972 — Peak fatalities" leftColor="#ef4444"
      rightLabel="Today — Progress made" rightColor="#10b981"
      rows={[
        ['54,589 U.S. traffic deaths', '~42,000 U.S. traffic deaths'],
        ['Seat belts rarely used', 'Seat belt laws reduce deaths significantly'],
        ['No handheld phone ban', 'CA ban since 2008 (first in the nation)'],
        ['No distracted driving laws', 'Texting while driving banned, points added'],
        ['No electronic stability control', 'ESC mandatory on all new cars since 2012'],
      ]}
    />
  ),

  'A.2 Understanding Traffic Collision Statistics': (
    <DataTable
      headers={['Leading Cause', 'Share of Fatal Crashes']}
      rows={[
        ['Speeding', '~30% of all fatal crashes'],
        ['DUI — alcohol or drugs', '~29% of all fatal crashes'],
        ['Distracted driving', 'Believed significantly underreported'],
        ['Unbelted occupants', '~50% of vehicle occupant deaths'],
        ['Driver fatigue', 'Estimated 20–30% of serious crashes'],
      ]}
      caption="California averages 3,500–4,000 traffic deaths and 276,000 injury collisions annually."
    />
  ),

  "A.4 California's Graduated Driver Licensing Program — Full Detail": (
    <Steps label="California GDL — Three stages to a full license" steps={[
      'Stage 1 — Learner\'s Permit (age 15½): Written test required. Must be accompanied by a licensed driver age 25+ at all times. Hold for at least 6 months.',
      'Stage 2 — Provisional License (age 16–17): No driving 11 PM–5 AM. No passengers under 20 unless a licensed adult 25+ is present. These restrictions reflect the two highest-risk conditions for new teen drivers.',
      'Stage 3 — Full License (age 18): All GDL restrictions lifted. Standard Class C license with full driving privileges.',
    ]} />
  ),

  'A.5 Traffic Law Changes — Staying Current': (
    <RuleCard
      icon="📋"
      title="You are responsible for knowing current California traffic law"
      text="The California Vehicle Code is amended by the state legislature every year. 'I didn't know the law changed' is not a legal defense. The DMV publishes a free updated Driver Handbook annually at dmv.ca.gov — review it when laws change or when you return to driving after an extended break."
    />
  ),

  'B.1 Defensive Driving in Real California Scenarios': (
    <Steps label="The three-phase defensive driving response" steps={[
      'Identify — Scan continuously to detect hazards before they become emergencies',
      'Predict — Anticipate what might happen: What could that vehicle do? Where might that pedestrian go?',
      'Decide and Execute — Choose the safest response and act early, before you are forced to react',
    ]} horizontal />
  ),

  'C.2 Building Long-Term Emotional Resilience for Driving': (
    <RuleCard
      icon="🧠"
      title="Calm drivers are safer drivers — this is not just philosophy"
      text="Research consistently links emotional dysregulation to aggressive driving, speeding, and distraction. Building emotional resilience — through route planning, adequate sleep, realistic travel times, and deliberate patience — reduces your crash risk as meaningfully as any mechanical safety feature."
    />
  ),

  'D.2 The Human Cost of DUI — Beyond Statistics': (
    <StatCard
      value="$10,000+"
      unit="average first-offense DUI"
      label="The true cost of a DUI conviction — before insurance increases"
      sub="Includes fines, court fees, DUI school, attorney costs, and license reinstatement fees. After adding increased insurance premiums over 3–5 years, total cost often reaches $25,000–$45,000. That does not account for lost employment opportunities or the human cost if someone was injured."
    />
  ),

  'D.3 Alcohol Monitoring and SR-22 Insurance — A Practical Guide': (
    <RuleCard
      icon="📄"
      title="SR-22: Proof of insurance required after certain violations"
      text="An SR-22 is not insurance — it is a certificate filed by your insurer with the DMV proving you carry the required coverage. Required after DUI, driving uninsured, or certain license suspensions. Must be maintained for 3 years. If your policy lapses, your insurer notifies the DMV immediately and your license is re-suspended."
    />
  ),

  'E.1 Understanding Your Vehicle\'s Warning Lights': (
    <TagRow items={[
      { label: '🔴 Red — Stop now', color: '#ef4444', sub: 'Oil pressure, engine temp, brake system, battery' },
      { label: '🟡 Yellow — Caution', color: '#f59e0b', sub: 'Check engine, tire pressure, traction control' },
      { label: '🟢 Green — Informational', color: '#10b981', sub: 'Turn signals, high beams, cruise control active' },
      { label: '🔵 Blue — High beams on', color: '#3b82f6', sub: 'Reminder that high beams are active' },
    ]} />
  ),

  'E.2 Buying a Safe Used Vehicle — What to Check': (
    <Steps label="Used vehicle safety inspection checklist" steps={[
      'Run a VIN check (NHTSA or Carfax) for recalls, accidents, and title status',
      'Check tire tread depth, age, and pressure — and look for uneven wear',
      'Test all lights: headlights, brake lights, turn signals, and reverse lights',
      'Test brakes: firm pedal with no pulling, grinding, or vibration',
      'Look for fluid leaks under the vehicle and check all fluid levels',
      'Have an independent mechanic inspect before purchase',
    ]} />
  ),

  "E.3 Fuel and Energy — California's Evolving Vehicle Landscape": (
    <RuleCard
      icon="⚡"
      title="California leads the nation in zero-emission vehicle adoption"
      text="California has mandated that all new passenger vehicles sold in the state be zero-emission by 2035. This is the most aggressive clean vehicle standard in the U.S. Regardless of what you drive now, understanding EV charging infrastructure, range considerations, and the differences in regenerative braking behavior is increasingly relevant for California drivers."
    />
  ),

  'G.1 Agricultural Vehicles and Farm Equipment': (
    <RuleCard
      icon="🚜"
      title="Agricultural vehicles — special rules for California's farm roads"
      text="Implements of husbandry (farm equipment) may legally travel on public roads. They are often slow-moving, wide, and difficult to see around. Maximum speed is generally 25 mph. You must not pass on curves, hills, or where visibility is limited. If caught behind farm equipment, maintain patience and a large following distance — they cannot accelerate or stop quickly."
    />
  ),

  'G.3 Sharing the Road with Horse-Drawn Vehicles and Equestrians': (
    <RuleCard
      icon="🐴"
      title="Horses are unpredictable — slow down and give wide clearance"
      text="Horses can be startled by sudden sounds, quick movements, or close vehicle pass-bys. When you see a horse on or near a road: reduce speed well before reaching it, pass slowly and quietly with as much lateral clearance as possible, and avoid honking or revving your engine. If asked to stop by the rider, do so. A startled horse can be lethal to itself, its rider, and you."
    />
  ),

  'G.4 Pedestrian Scrambles and Shared Signal Phases': (
    <RuleCard
      icon="🚶"
      title="Pedestrian scramble: all directions cross simultaneously"
      text="Some California intersections use a 'pedestrian scramble' or 'Barnes Dance' phase where all vehicle traffic stops and pedestrians may cross in any direction — including diagonally. During this phase, all turning movements are prohibited for vehicles. Watch for scramble phase signage and be prepared to wait while pedestrians cross from multiple directions."
    />
  ),

  'H.2 Key Numbers and Thresholds — Quick Reference': (
    <DataTable
      headers={['Rule', 'Number', 'Context']}
      rows={[
        ['Following distance', '3 seconds min', 'Increase in adverse conditions'],
        ['Signal before turning', '100 feet', 'Residential and business areas'],
        ['Cyclist clearance', '3 feet', 'Minimum when passing (CVC §21760)'],
        ['DUI BAC limit (adult)', '0.08%', '0.04% for CDL, 0.01% under 21'],
        ['Traffic school interval', '18 months', 'Per violation date'],
        ['SR-1 filing threshold', '$1,000 damage', 'Or any injury — within 10 days'],
        ['Tire tread minimum', '1/32 inch', 'All passenger vehicles — CVC §27465'],
        ['Airbag clearance', '10 inches', 'Chest to steering wheel'],
        ['Stopping distance at 65 mph', '400+ feet', 'On dry road, good brakes'],
        ['School zone speed', '25 mph', 'When children are present'],
      ]}
      caption="Memorizing these key thresholds will prepare you for both the exam and real driving situations."
    />
  ),

  '1.12 Understanding Traffic Enforcement in California': (
    <TagRow items={[
      { label: 'OTS Campaigns', color: '#f59e0b', sub: "State-funded enforcement targeting DUI, distraction, speed, and seat belts" },
      { label: 'Photo Enforcement', color: '#3b82f6', sub: "Red light cameras legal in CA — must be clearly posted. Civil, not criminal." },
      { label: 'CHP vs Local', color: '#10b981', sub: "CHP handles highways and state property. Local agencies cover city streets." },
      { label: 'Data-Driven', color: '#94a3b8', sub: "Enforcement is targeted to high-crash corridors identified by collision data." },
    ]} />
  ),

  // ── Chapter 2 ──────────────────────────────────────────────────────────────

  '2.2 The Smith System — A Framework for Defensive Driving': (
    <Steps label="The Smith System — 5 principles of defensive driving" steps={[
      'Aim high in steering — look 12–15 seconds ahead, not just at the car in front of you',
      'Get the big picture — stay aware of everything in a 360° bubble around your vehicle',
      'Keep your eyes moving — scan mirrors every 5–8 seconds; never fix your gaze',
      'Leave yourself an out — always have an escape route; avoid being boxed in',
      'Make sure they see you — use headlights, signals, and eye contact to communicate your presence',
    ]} />
  ),

  '2.3 Following Distance — The Three-Second Rule': (
    <DataTable
      headers={['Speed', 'Perception + Reaction', 'Braking Distance', 'Total Stopping Distance']}
      rows={[
        ['25 mph', '55 ft', '35 ft', '~90 ft'],
        ['35 mph', '77 ft', '65 ft', '~142 ft'],
        ['45 mph', '99 ft', '105 ft', '~204 ft'],
        ['55 mph', '121 ft', '165 ft', '~286 ft'],
        ['65 mph', '143 ft', '240 ft', '~383 ft'],
        ['65 mph (wet road)', '143 ft', '380+ ft', '525+ ft'],
      ]}
      caption="Wet roads can more than double your stopping distance. Maintain greater following distance in rain."
    />
  ),

  '2.13 Driving in Heavy Traffic — Urban and Freeway Congestion': (
    <RuleCard
      icon="🚗"
      title="Zipper merge: use all available lanes, then alternate at the merge point"
      text="When a lane ends ahead, the correct and most traffic-efficient approach is to use all available lanes up to the merge point, then alternate — one from each lane — like a zipper. Early merging creates longer backups and is not safer. Staying in your lane until the merge point is not cutting in line; it is using the road as designed."
    />
  ),

  '2.14 Anticipation — The Highest Defensive Driving Skill': (
    <StatCard
      value="¼ mile"
      unit="at highway speed"
      label="What 12–15 seconds of forward scan covers at 60 mph"
      sub="Most drivers look only 2–3 seconds ahead — the car directly in front. Defensive drivers look a quarter mile down the road, giving time to see brake lights rippling back, a lane closure forming, or a pedestrian about to cross. Anticipation replaces reaction."
    />
  ),

  'I.1 How Humans Process Driving Information': (
    <StatCard
      value="50 bits"
      unit="per second"
      label="Conscious processing capacity while driving"
      sub="Your brain receives approximately 11 million bits of sensory information per second while driving, but your conscious mind can only process around 50 bits per second. This means you are unconsciously filtering out most of what is happening around you — which is why distraction and overconfidence are so dangerous."
    />
  ),

  'I.3 Risk Perception and Risk Compensation': (
    <RuleCard
      icon="⚠️"
      title="Familiarity breeds underestimation of risk"
      text="Risk compensation is the tendency to take more risks when we feel safer. Drivers in safer vehicles, or on familiar roads, tend to drive faster and pay less attention — offsetting the safety benefit. The route you drive every day is not safer than an unfamiliar route. Statistical crash data shows that the majority of collisions happen within 15 miles of home, on familiar roads."
    />
  ),

  'I.4 The Effect of Confidence on Driving Safety': (
    <RuleCard
      icon="🎯"
      title="Overconfidence is one of the most dangerous driving conditions"
      text="Studies consistently show that drivers rate themselves above average — a statistical impossibility. The Dunning-Kruger effect applies to driving: the least skilled drivers most overestimate their ability. The most dangerous driver on the road is not the nervous novice but the overconfident experienced driver who has stopped thinking carefully about what they are doing."
    />
  ),

  'J.1 Bicycle Laws Every Driver Should Know': (
    <Steps label="Your legal obligations toward cyclists in California" steps={[
      '3-foot minimum clearance required when passing a cyclist (CVC §21760)',
      'If 3 feet isn\'t possible, slow to a safe speed and pass only when it is safe to do so',
      'Never open your car door into a cyclist\'s path — "dooring" is a violation and can be fatal',
      'Cyclists may take the full lane if it is too narrow for a car and bicycle to travel safely side by side',
      'Yield to cyclists as you would any other vehicle — they have equal road rights',
    ]} />
  ),

  'J.2 Pedestrian Laws — What Pedestrians Are Required to Do': (
    <RuleCard
      icon="🚶"
      title="Pedestrian legal obligations — what you can expect from them"
      text="Pedestrians must use crosswalks where available, obey walk/don't-walk signals, and walk on sidewalks when provided. However, California law still requires drivers to exercise due care to avoid hitting any pedestrian, regardless of whether the pedestrian is following the rules. A pedestrian's mistake does not remove your duty of care."
    />
  ),

  'K.2 The Relationship Between Driving and Character': (
    <RuleCard
      icon="🪞"
      title="How you drive reflects how you treat other people"
      text="Driving strips away many social controls — anonymity, speed, and separation reduce accountability. A driver who ignores traffic laws when no officer is present, who tailgates when frustrated, or who treats other road users as obstacles, is revealing something genuine about how they navigate the world. Consistent, patient, law-abiding driving is an expression of respect for the equal value of every other life on the road."
    />
  ),

  'K.3 Teaching Safe Driving — Your Responsibility as an Experienced Driver': (
    <RuleCard
      icon="👨‍👧"
      title="Parental modeling is the most powerful influence on teen driving behavior"
      text="Research consistently shows that teens whose parents model law-abiding, calm, phone-free driving are significantly more likely to drive the same way. Driver education classes and peer influence are secondary. Every time a young person rides in your car, your behavior is teaching them. Using your phone in traffic while a teenager is watching is a driving lesson — just not the one you intend."
    />
  ),

  '2.11 Defensive Driving in Urban Environments': (
    <RuleCard
      icon="🏙️"
      title="The 2-second pause: a simple habit that prevents intersection crashes"
      text="When a traffic light turns green, count two seconds before proceeding. This brief pause allows any vehicle running the red from the cross direction to clear the intersection. Intersection collisions are one of the most common causes of serious urban traffic injuries. The two-second pause costs almost nothing in travel time and provides a meaningful safety margin every time you use it."
    />
  ),

  // ── Chapter 3 ──────────────────────────────────────────────────────────────

  '3.3 Recognizing Road Rage in Other Drivers': (
    <TagRow items={[
      { label: '🚗 Tailgating', color: '#ef4444', sub: 'Following dangerously close as an intimidation tactic' },
      { label: '📢 Excessive honking', color: '#ef4444', sub: 'Prolonged or repeated use of horn beyond warning' },
      { label: '✋ Gestures', color: '#f59e0b', sub: 'Obscene or threatening hand signals directed at other drivers' },
      { label: '🔄 Blocking', color: '#f59e0b', sub: 'Intentionally cutting off or preventing a vehicle from moving' },
      { label: '⬆️ Escalation', color: '#ef4444', sub: 'Following another vehicle, getting out, or using the vehicle as a weapon' },
    ]} />
  ),

  '3.4 Managing Your Own Anger Behind the Wheel': (
    <Steps label="When you feel anger rising behind the wheel" steps={[
      'Name it — recognize "I am feeling angry" as a state that impairs your judgment',
      'Separate the emotion from the situation — the other driver\'s action was not personal',
      'Create distance — ease off the accelerator and put more space between you and the trigger',
      'Redirect your attention — focus on your destination, your passengers, or the road conditions',
    ]} />
  ),

  '3.6 Special Situations That Escalate Road Rage': (
    <StatCard
      value="60%+"
      unit="of road rage incidents"
      label="Triggered by merging, lane changes, and parking disputes"
      sub="These are the highest-friction moments in driving — when space is limited and drivers compete for the same resource. Slowing down and yielding in these situations, even when you have the legal right-of-way, eliminates the trigger before an incident can escalate."
    />
  ),

  '3.7 Road Rage Involving Pedestrians and Cyclists': (
    <RuleCard
      icon="🚴"
      title="A vehicle used as a threat or weapon is a felony — not a traffic violation"
      text="Using your vehicle to intimidate, cut off, or threaten a pedestrian or cyclist is not road rage — it is assault with a deadly weapon under California law. This applies even if no physical contact is made. Cyclists and pedestrians are especially vulnerable, and aggressive driving toward them regularly results in felony charges and prison time."
    />
  ),

  '3.10 High-Risk Profiles — Who Is Most Likely to Exhibit Road Rage?': (
    <Comparison
      leftLabel="Highest risk factors" leftColor="#ef4444"
      rightLabel="Protective factors" rightColor="#10b981"
      rows={[
        ['Young male, ages 18–26', 'Older, experienced drivers'],
        ['High daily stress or life pressures', 'Regular mindfulness or stress management'],
        ['Running late or time pressure', 'Planning ahead, leaving early'],
        ['History of aggressive behavior', 'High emotional intelligence'],
        ['Anonymity — driving alone', 'Passenger present (social accountability)'],
      ]}
    />
  ),

  '3.11 Bystander Situations — What to Do When You Witness Road Rage': (
    <Steps label="If you witness a road rage incident escalating" steps={[
      'Do not intervene physically — you could be injured or become a target yourself',
      'Put distance between yourself and the incident — your safety comes first',
      'Call 911 when it is safe to do so — provide location, vehicle descriptions, and direction of travel',
      'Do not follow either vehicle to "help" — emergency responders are trained for this',
    ]} horizontal />
  ),

  '3.6 The Psychology of Anonymity Behind the Wheel': (
    <RuleCard
      icon="🎭"
      title="Deindividuation: why drivers behave worse than people"
      text="Psychological research shows that anonymity reduces self-awareness and personal accountability — a phenomenon called deindividuation. Inside a vehicle, drivers feel anonymous, separated from others, and shielded from social consequences. This is why people honk, gesture, and make aggressive maneuvers that they would never attempt face-to-face. Recognizing this dynamic can help you consciously counteract it in yourself."
    />
  ),

  '3.7 Environmental Triggers and High-Risk Driving Contexts': (
    <DataTable
      headers={['Environmental Factor', 'Effect on Drivers', 'Mitigation']}
      rows={[
        ['High ambient temperature', 'Increased irritability and aggression', 'Run A/C; stay hydrated; leave earlier'],
        ['Traffic congestion', 'Elevated frustration and helplessness', 'Use navigation to route around; accept delays'],
        ['Running late', 'Urgency overrides judgment', 'Leave 10–15 min early; departures are not emergencies'],
        ['Loud music', 'Emotional amplification; reduced awareness', 'Lower volume; keep attention on road'],
      ]}
    />
  ),

  '3.8 De-escalation Techniques — What to Do in the Moment': (
    <Steps label="When another driver is aggressive toward you" steps={[
      'Do not make eye contact — eye contact is often read as a challenge or provocation',
      'Do not respond with gestures, horn, or brake-checking',
      'Create distance — change lanes, slow down, or take a different route',
      'If followed: drive to a public place (police station, fire station, busy lot) — do not go home',
      'Call 911 if you feel genuinely threatened — this is a legitimate emergency',
    ]} />
  ),

  '3.9 Road Rage and California Law': (
    <DataTable
      headers={['Offense', 'Classification', 'Maximum Penalty']}
      rows={[
        ['Reckless driving', 'Misdemeanor', '90 days jail + $1,000 fine'],
        ['Assault with a vehicle', 'Felony', '4 years state prison'],
        ['Battery on a driver/pedestrian', 'Misdemeanor or Felony', 'Up to 4 years prison'],
        ['Brandishing a weapon from a vehicle', 'Felony', '3 years state prison'],
        ['Road rage causing injury', 'Felony', 'Up to 7 years prison'],
      ]}
      caption="Road rage incidents that escalate to physical contact are prosecuted as serious violent crimes, not traffic violations."
    />
  ),

  '3.10 Building Long-Term Emotional Resilience as a Driver': (
    <Steps label="Habits that reduce road rage susceptibility over time" steps={[
      'Plan your route before you drive — uncertainty creates stress that transfers to the road',
      'Leave 10–15 minutes earlier than necessary — time pressure is the most common road rage trigger',
      'Maintain your vehicle — discomfort (heat, noise, poor A/C) amplifies emotional reactions',
      'Practice the assumption of goodwill — most bad driving is inattention, not malice',
    ]} />
  ),

  '3.11 Organizational and Community Approaches to Reducing Road Rage': (
    <RuleCard
      icon="🏛️"
      title="Road rage is a public health issue, not just a personal failure"
      text="The California Office of Traffic Safety funds community awareness campaigns targeting aggressive driving. Research shows that public campaigns reduce aggressive driving when they focus on realistic scenarios and social norms rather than legal threats alone. Highway design — adequate lane widths, clear signage, and well-engineered merges — also significantly reduces the friction that triggers road rage."
    />
  ),

  // ── Chapter 4 ──────────────────────────────────────────────────────────────

  '4.4 Passengers as a Source of Distraction': (
    <DataTable
      headers={['Driver Age', 'Passenger Count', 'Change in Crash Risk']}
      rows={[
        ['Teen driver', '1 peer passenger', '+44% crash risk'],
        ['Teen driver', '2 peer passengers', '+86% crash risk'],
        ['Teen driver', '3+ peer passengers', 'Risk triples'],
        ['Adult driver', 'Any passengers', 'Minimal increase — experience compensates'],
      ]}
      caption="California's provisional license restricts teen drivers from transporting passengers under 20 for the first 12 months for exactly this reason."
    />
  ),

  '4.8 Distraction Management: Building Better Habits': (
    <Steps label="Pre-drive setup — do these before you move" steps={[
      'Set your navigation destination before you put the car in gear',
      'Connect your phone via Bluetooth or place it face-down, out of reach',
      'Adjust mirrors, seat, and climate control before starting',
      'Tell passengers your ground rules for the trip',
      'If you need to use your phone for any reason, pull over completely first',
    ]} />
  ),

  '5.1 The Core Principle: Right-of-Way Is Yielded, Not Taken': (
    <RuleCard
      icon="🤝"
      title="Right-of-way is granted to you by others — you cannot claim it"
      text="No law gives you the right-of-way. Laws only state who must yield. This distinction matters enormously: even if you legally have priority, you are still required to exercise reasonable care to avoid a collision. Insisting on your right-of-way when another driver is about to violate it is legally risky and potentially fatal. Yielding when you don't have to is always safer than demanding the right-of-way you have."
    />
  ),

  '5.2 Intersections Without Traffic Controls': (
    <Steps label="Uncontrolled intersection — who yields?" steps={[
      'At a T-intersection: the driver on the terminating road yields to drivers on the through road',
      'At an uncontrolled cross intersection: yield to vehicles already in the intersection',
      'Same-time arrival: yield to the vehicle on your right',
      'Major vs. minor road: vehicles on the minor road yield to vehicles on the major road',
      'When in doubt, yield — never assume the other driver knows the rule',
    ]} />
  ),

  '4.10 The Science of Attention — Why Multitasking Does Not Work While Driving': (
    <StatCard
      value="2.5%"
      unit="of drivers"
      label="Can safely multitask while driving without significant performance degradation"
      sub="University of Utah research found that only 2.5% of people — called 'supertaskers' — can effectively divide attention between driving and a secondary task. For the remaining 97.5%, multitasking while driving produces measurable impairment equivalent to driving at 0.08% BAC."
    />
  ),

  '4.11 Specific Distraction Scenarios and How to Handle Them': (
    <DataTable
      headers={['Situation', 'Correct Response']}
      rows={[
        ['Phone rings or buzzes', 'Ignore it — it can wait. If urgent, pull over safely first.'],
        ['Navigation needs reprogramming', 'Pull over completely before adjusting GPS.'],
        ['Child is upset in back seat', 'Pull over to attend — never turn around while moving.'],
        ['You drop something', 'Leave it — a dropped item is not worth a collision.'],
        ['Something interesting outside', 'Brief glance only; do not slow down or stare.'],
      ]}
    />
  ),

  '4.12 Distraction in Commercial and Ride-Share Drivers': (
    <RuleCard
      icon="🚐"
      title="Federal law bans ALL handheld device use for commercial drivers"
      text="The Federal Motor Carrier Safety Administration (FMCSA) prohibits commercial vehicle drivers from using any handheld device while operating a vehicle in commerce. Penalties include fines up to $2,750 per offense for drivers and up to $11,000 for carriers who allow it. Ride-share drivers operating under commercial permits are subject to similar restrictions under California PUC regulations."
    />
  ),

  '4.13 Technology Solutions to Distracted Driving': (
    <Comparison
      leftLabel="More effective" leftColor="#10b981"
      rightLabel="Less effective" rightColor="#ef4444"
      rows={[
        ['Phone locked in glovebox or bag', 'Phone face-down on seat or console'],
        ['Do Not Disturb While Driving enabled', 'Intending to ignore notifications'],
        ['Bluetooth audio (no interaction required)', 'Hands-free calls (cognitive distraction remains)'],
        ['Pre-set navigation before driving', 'Glancing at phone for directions'],
        ['Asking a passenger to manage your phone', 'Using voice commands while driving'],
      ]}
    />
  ),

  '4.9 The Neuroscience of Distraction — Why Our Brains Fail Us Behind the Wheel': (
    <StatCard
      value="27 sec"
      unit="of impaired attention"
      label="Duration of cognitive distraction after ending a hands-free phone call"
      sub="University of Utah research found that your attention is impaired for up to 27 seconds after you finish a hands-free call — enough time to travel hundreds of feet at highway speeds while your brain is still processing the conversation. Voice commands produce similar impairment even after the command is completed."
    />
  ),

  '4.10 Visual Distraction — The Science of Looking Without Seeing': (
    <RuleCard
      icon="👁️"
      title="Looking at the road is not the same as seeing the road"
      text="Inattentional blindness is the failure to perceive something in plain sight because your attention is directed elsewhere. Drivers who are cognitively distracted by a phone conversation look at the road but fail to register hazards — they 'look but fail to see.' Studies show that drivers talking on the phone miss 50% of the visual information they look at directly. Eye tracking is not sufficient; cognitive attention is what actually registers hazards."
    />
  ),

  '4.11 Managing Technology in the Modern Vehicle': (
    <RuleCard
      icon="🎛️"
      title="Voice commands still cause dangerous cognitive distraction"
      text="Many drivers believe that voice-controlled infotainment systems are safe to use while driving because they are 'hands-free.' Research by AAA found that voice-command systems produce mental workloads similar to, or exceeding, handheld phone use — and that some factory-installed systems require more than 40 seconds of sustained attention to complete a task. Use voice commands only when stopped, or avoid them entirely while driving."
    />
  ),

  '4.12 Teen Drivers and Distraction — A Critical Safety Issue': (
    <StatCard
      value="23×"
      unit="increase in crash risk"
      label="Relative crash risk when composing a text message while driving"
      sub="Virginia Tech Transportation Institute data. Teens are both more likely to use phones while driving and more severely impaired by distraction than experienced adult drivers — a compounding vulnerability. Reading a text at 55 mph means traveling the length of a football field with no visual input."
    />
  ),

  // ── Chapter 5 ──────────────────────────────────────────────────────────────

  '5.13 Right-of-Way Disputes and Collision Liability': (
    <RuleCard
      icon="⚖️"
      title="Having the legal right-of-way does not absolve you of fault"
      text="California courts apply comparative fault in traffic collisions. If you had the right-of-way but could have safely avoided the collision by braking or steering, and you chose instead to assert your priority, you may bear partial fault even though the other driver violated the rule. The law's expectation is that drivers act reasonably, not that they exercise their rights to the limit."
    />
  ),

  '5.14 Right-of-Way in Complex Traffic Situations': (
    <Steps label="Priority hierarchy — who moves first in complex scenarios" steps={[
      'Emergency vehicles with lights/sirens active — always have absolute priority',
      'School buses with red lights flashing — all traffic in all lanes must stop',
      'Flagger in construction zone — same authority as a red traffic signal',
      'Pedestrians in crosswalks — drivers must stop and remain stopped until they clear',
      'Cyclists proceeding straight — yield when turning across their path',
    ]} />
  ),

  '5.6 Right-of-Way at Uncontrolled Intersections — Advanced Scenarios': (
    <DataTable
      headers={['Scenario', 'Who Yields']}
      rows={[
        ['Two vehicles arrive simultaneously at a 4-way stop', 'Vehicle on the left yields to vehicle on the right'],
        ['Turning left vs. oncoming traffic going straight', 'Left-turning vehicle always yields'],
        ['Vehicle entering from a driveway', 'Driveway vehicle yields to all road traffic'],
        ['Two vehicles on perpendicular roads — one a highway', 'Driver on secondary road yields to highway traffic'],
        ['Emergency vehicle approaching from any direction', 'All drivers pull right and stop immediately'],
      ]}
    />
  ),

  '5.7 Right-of-Way and Pedestrian Safety — A Deeper Analysis': (
    <RuleCard
      icon="🚶"
      title="California law: yield to pedestrians in ALL crosswalks — marked or unmarked"
      text="Under CVC §21950, drivers must yield to pedestrians crossing in any crosswalk — not just painted ones. Any intersection of a street with another street or with a vehicle path creates a legal crosswalk at the corners, whether or not it is marked. This means pedestrian priority exists at virtually every corner in California. The practical implication: before turning at any intersection, scan fully for pedestrians."
    />
  ),

  '5.8 Right-of-Way and Cyclists — California\'s Legal Framework': (
    <Steps label="Key cyclist rights every driver must know" steps={[
      'Cyclists have the same rights as motor vehicle operators on California roads',
      'A cyclist may occupy the full travel lane if the lane is too narrow for safe side-by-side travel',
      'You must give at least 3 feet of clearance when passing — more at higher speeds',
      'Right turn after passing a cyclist: yield to the cyclist before cutting across their path (the right-hook collision)',
      'Dooring: opening your door into a cyclist\'s path is a moving violation — check your mirror before opening',
    ]} />
  ),

  '5.9 Right-of-Way in Work Zones': (
    <RuleCard
      icon="🚧"
      title="Work zone flaggers have the same legal authority as a red traffic signal"
      text="A flagger holding a STOP paddle is not a suggestion. Failing to obey a work zone flagger is the same violation as running a red light. Fines for moving violations in work zones are doubled under California law. Workers in construction zones face the highest occupational fatality rate of any work environment. Treat every work zone as if your own family member is working in it."
    />
  ),

  '5.10 Right-of-Way and the Move Over Law': (
    <RuleCard
      icon="🚨"
      title="Move Over Law: move one lane away — or slow to 20 mph below the speed limit"
      text="When you see an emergency vehicle, tow truck, or Caltrans vehicle stopped on the side of the road with lights activated, California law requires you to: (1) move over at least one lane away from the stopped vehicle, or (2) if a lane change is not safely possible, slow to at least 20 mph below the posted speed limit. The Move Over Law has been extended to include tow trucks, utility vehicles, and garbage trucks."
    />
  ),

  '5.11 Right-of-Way Disputes and Collision Fault': (
    <RuleCard
      icon="📋"
      title="California uses pure comparative fault — both drivers may share liability"
      text="California's pure comparative fault system means that fault for a collision can be split between drivers in any proportion. A driver who was 80% at fault can still recover 20% of their damages. More importantly, the driver with right-of-way who could have avoided the collision but chose not to may share fault. Insurance adjusters and courts look at what each driver could reasonably have done to prevent the crash."
    />
  ),

  '5.12 Teaching Right-of-Way — Common Misunderstandings': (
    <DataTable
      headers={['Common Misconception', 'Correct Rule']}
      rows={[
        ['The bigger vehicle has right-of-way', 'Size has no legal bearing on right-of-way'],
        ['First to the intersection goes first', 'True at 4-way stops; not true at other situations'],
        ['Green light means it\'s safe to go', 'Green means you may proceed — not that it\'s safe. Scan first.'],
        ['Pedestrians must wait for cars', 'Pedestrians have priority in crosswalks, always'],
        ['Turning vehicles have priority', 'Vehicles going straight always have priority over turning vehicles'],
      ]}
    />
  ),

  '5.13 Right-of-Way and Courtesy — Beyond the Law': (
    <RuleCard
      icon="🤲"
      title="Yielding when you don't have to is always the right choice"
      text="The law establishes minimum behavior. The safest driver goes further: yielding graciously even when they have priority, creating space for merging vehicles even when they aren't required to, and treating every potential conflict as an opportunity to prevent a crash rather than a contest to win. Traffic flows better when drivers are generous, and generous drivers have far fewer collisions."
    />
  ),

  // ── Chapter 6 ──────────────────────────────────────────────────────────────

  '6.2 Financial Responsibility — Insurance Requirements': (
    <DataTable
      headers={['Coverage Type', 'California Minimum', 'Typical Real-World Recommendation']}
      rows={[
        ['Bodily injury per person', '$15,000', '$100,000+'],
        ['Bodily injury per accident', '$30,000', '$300,000+'],
        ['Property damage per accident', '$5,000', '$50,000+'],
        ['Uninsured motorist', 'Not required', 'Strongly recommended'],
        ['Collision coverage', 'Not required', 'Required if car financed/leased'],
      ]}
      caption="Minimum coverage often leaves drivers personally liable for amounts exceeding their policy limits. Serious injury claims routinely exceed $100,000."
    />
  ),

  '6.4 Vehicle Maintenance as a Legal Obligation': (
    <Steps label="Basic maintenance required under California law" steps={[
      'All lights functional: headlights, brake lights, turn signals, reverse lights',
      'Brakes capable of stopping the vehicle within required distances',
      'Tires with at least 1/32 inch of tread (steering axle: 4/32 inch)',
      'Windshield free of cracks that obstruct the driver\'s view',
      'Horn audible from 200 feet',
      'All required equipment installed and operational',
    ]} />
  ),

  '6.5 Seat Belts — The Law and Why It Matters': (
    <DataTable
      headers={['Crash Type', 'Seat Belt Effect on Fatality Risk']}
      rows={[
        ['Frontal collision', 'Reduces fatality risk by ~45%'],
        ['Side collision', 'Reduces fatality risk by ~60%'],
        ['Rollover', 'Reduces fatality risk by ~74% (NHTSA)'],
        ['Being ejected from vehicle', 'Seat belt reduces ejection risk by ~90%'],
        ['Overall — all crash types', 'Single most effective safety device in the vehicle'],
      ]}
      caption="~50% of vehicle occupants killed in crashes in California are unbelted. A seat belt takes 2 seconds to fasten."
    />
  ),

  '6.8 Sharing the Road Responsibly — Obligations Beyond the Law': (
    <RuleCard
      icon="🛡️"
      title="The law sets a floor — safe, responsible driving goes further"
      text="California traffic law establishes minimum standards. The safe driver asks not 'what am I legally required to do?' but 'what would a prudent person do?' This means giving more space to cyclists than the 3-foot minimum when road conditions allow, yielding to pedestrians who aren't technically in a crosswalk, and treating other road users with the consideration you would want extended to yourself."
    />
  ),

  '6.10 What to Do After a Collision — Full Obligations': (
    <Steps label="Post-collision legal obligations — in order" steps={[
      'Stop immediately. Leaving the scene is a crime even if you believe you weren\'t at fault.',
      'Check for injuries. Call 911 immediately if anyone is injured.',
      'Move vehicles out of traffic if they are drivable and it is safe to do so.',
      'Exchange: name, address, driver\'s license number, license plate, and insurance information.',
      'Document: photograph damage, positions of vehicles, and any injuries.',
      'File SR-1 with DMV within 10 days if injuries occurred or damage exceeds $1,000.',
    ]} />
  ),

  '6.12 Child Passenger Safety — A Detailed Guide': (
    <DataTable
      headers={['Child Age / Size', 'Required Seat Type', 'Position']}
      rows={[
        ['Birth to 2 years (or until outgrown)', 'Rear-facing car seat', 'Back seat — never front with active airbag'],
        ['2 years to forward-facing seat limit', 'Forward-facing with harness', 'Back seat preferred'],
        ['40–80 lbs, up to 4\'9"', 'Belt-positioning booster seat', 'Back seat'],
        ['Over 4\'9" and 8+ years', 'Seat belt (lap + shoulder)', 'Any seat, but back preferred'],
        ['Under 8 years', 'Child seat always required', 'Rear seat unless no rear seat exists'],
      ]}
      caption="Use the child's current weight and height — not age alone — to determine correct restraint type."
    />
  ),

  '6.13 Driving Under the Influence of Prescription Medications — Operator Responsibility': (
    <RuleCard
      icon="💊"
      title="Legal ≠ safe to drive — always check with your doctor or pharmacist"
      text="A prescription is not a defense against DUID charges. If a prescribed medication impairs your ability to drive safely, driving while taking it is a crime — regardless of whether you followed dosage instructions. Many common medications, including antihistamines, sleep aids, anxiety medications, and even some blood pressure drugs, cause sedation, blurred vision, or slowed reaction time. Check with your pharmacist before driving on any new medication."
    />
  ),

  '6.14 Towing and Carrying Loads Responsibly': (
    <DataTable
      headers={['Load Situation', 'California Requirement']}
      rows={[
        ['Trailer exceeds 1,500 lbs loaded', 'Trailer brakes required (CVC §26311)'],
        ['Any load on vehicle', 'Must be secured so nothing can fall or fly off'],
        ['Load drops from vehicle — injury results', '$1,000+ fine for first offense (CVC §23114)'],
        ['Overhanging load — rear more than 4 ft', 'Red flag or light required at end of load'],
        ['Towing speed limit', '55 mph maximum when towing a trailer in California'],
      ]}
      caption="An unsecured load that falls from your vehicle and causes injury or property damage creates both criminal liability and civil liability."
    />
  ),

  '6.9 California\'s Cell Phone and Electronic Device Laws for Drivers': (
    <Comparison
      leftLabel="Drivers under 18" leftColor="#ef4444"
      rightLabel="Adult drivers" rightColor="#f59e0b"
      rows={[
        ['No device use of any kind while driving', 'Hands-free use is permitted (mount required)'],
        ['Includes hands-free and Bluetooth', 'All handheld use prohibited'],
        ['No exceptions for emergencies (pull over)', 'Emergency 911 calls permitted while driving'],
        ['Violation adds 1 point to record', 'Violation adds 1 point to record'],
        ['First offense: $162 fine', 'First offense: $162 fine'],
      ]}
    />
  ),

  '6.10 Financial Responsibility — Beyond the Minimum': (
    <StatCard
      value="$100,000+"
      unit="typical serious injury claim"
      label="The gap between California's minimum coverage and real-world liability"
      sub="California's minimum property damage coverage is $5,000 — but replacing most vehicles costs $20,000–$80,000. A single hospitalization after a collision can exceed $150,000. When your insurance coverage is exhausted, you are personally liable for the difference. Courts can garnish wages and place liens on property to recover judgments against underinsured drivers."
    />
  ),

  // ── Chapter 7 ──────────────────────────────────────────────────────────────

  '8.1 Why Vehicle Maintenance Is a Safety Issue': (
    <StatCard
      value="~12%"
      unit="of crashes"
      label="Involve a vehicle component failure as a contributing factor"
      sub="Tire failures, brake failures, and lighting defects are the most common equipment contributors to collisions. Most equipment failures are predictable and preventable with regular inspection. A collision caused by a known defect you failed to repair can significantly increase your civil liability."
    />
  ),

  '8.3 Brakes — Your Most Important Safety System': (
    <Steps label="Warning signs of brake wear — don't ignore these" steps={[
      'Squealing or squeaking when braking — brake pads worn to the wear indicator',
      'Grinding or metal-on-metal sound — pads fully worn; rotors may be damaged',
      'Pedal that feels soft or spongy — possible air in the brake lines or fluid leak',
      'Vehicle pulling to one side when braking — uneven pad wear or stuck caliper',
      'Brake warning light illuminated on the dashboard',
    ]} />
  ),

  '8.8 What to Do When Your Vehicle Has a Problem on the Road': (
    <Steps label="Roadside emergency — the correct sequence" steps={[
      'Signal and steer to the right shoulder or breakdown lane — avoid stopping in traffic',
      'Turn on hazard lights immediately',
      'Exit the vehicle and move well away from traffic — stay behind a guardrail if available',
      'Call for assistance — do not attempt repairs in the travel lane or active shoulder',
    ]} horizontal />
  ),

  '7.8 The Social Context of DUI — Peer Pressure and Designated Drivers': (
    <RuleCard
      icon="🤝"
      title="Commit to a plan before you drink — not during"
      text="Alcohol impairs your judgment about your own impairment. Research consistently shows that intoxicated people substantially underestimate how drunk they are — which is exactly why 'I feel fine to drive' is unreliable. The only effective strategy is a commitment made before drinking: a designated driver, a rideshare app, or a plan to stay where you are. The plan must be made before alcohol enters the picture."
    />
  ),

  '7.9 DUI Checkpoints — Your Rights and Responsibilities': (
    <Steps label="At a DUI checkpoint — what to expect and your rights" steps={[
      'Checkpoints must be publicly announced in advance — this is a constitutional requirement',
      'You must stop and briefly speak with the officer — you cannot turn around to avoid a legal checkpoint',
      'You are required to provide your license, registration, and insurance',
      'You may politely decline to answer questions beyond what is legally required',
      'If asked to take a field sobriety test: you may decline with no automatic penalty',
      'If arrested: implied consent law applies — chemical testing refusal carries automatic license suspension',
    ]} />
  ),

  '7.11 Marijuana and Driving — California\'s New Legal Landscape': (
    <Comparison
      leftLabel="Legal to do in California" leftColor="#10b981"
      rightLabel="Still illegal — DUID" rightColor="#ef4444"
      rows={[
        ['Possess up to 1 oz of marijuana (adults 21+)', 'Drive with ANY detectable impairment from THC'],
        ['Consume in private, non-public settings', 'Drive with marijuana in an open container'],
        ['Purchase from licensed dispensaries', 'Give marijuana to anyone under 21'],
        ['Grow up to 6 plants at home', 'Use marijuana in any moving vehicle'],
        ['Be impaired in your own home', 'Claim "but it\'s legal" as a DUID defense'],
      ]}
    />
  ),

  '7.12 Prescription Medications and Driving Impairment': (
    <DataTable
      headers={['Medication Category', 'Common Examples', 'Driving Risks']}
      rows={[
        ['Antihistamines', 'Benadryl, Zyrtec, NyQuil', 'Sedation, slowed reaction, blurred vision'],
        ['Opioids / Pain', 'Vicodin, OxyContin, codeine', 'Heavy sedation, impaired judgment'],
        ['Benzodiazepines', 'Xanax, Valium, Klonopin', 'Sedation, memory impairment, slow reflexes'],
        ['Sleep aids', 'Ambien, Lunesta, Trazodone', 'Morning "hangover" impairment for hours after waking'],
        ['Muscle relaxants', 'Flexeril, Soma, Robaxin', 'Sedation, dizziness, impaired coordination'],
      ]}
      caption="Studies show diphenhydramine (Benadryl) produces impairment equivalent to 0.10% BAC — above the legal DUI limit."
    />
  ),

  // ── Chapter 8 ──────────────────────────────────────────────────────────────

  '9.3 Pedestrian Collision Scenarios — The Most Common Causes': (
    <DataTable
      headers={['Collision Pattern', 'How It Happens', 'Prevention']}
      rows={[
        ['Driver turns, pedestrian crosses', 'Driver checks for cars but not pedestrians on their path', 'Complete separate scan for pedestrians before turning'],
        ['Pedestrian emerges from between parked cars', 'No warning; sudden appearance', 'Slow when passing parked vehicles; watch for feet below cars'],
        ['Backing out of a driveway', 'Driver looks for vehicles, misses pedestrian on sidewalk', 'Full stop, check both directions for pedestrians before reversing'],
        ['Looked-but-failed-to-see', 'Driver\'s eyes pointed correctly but attention elsewhere', 'Put the phone away; full cognitive attention on the road'],
      ]}
    />
  ),

  '9.5 Vulnerable Road Users in Specific Settings': (
    <TagRow items={[
      { label: '🏫 School zones', color: '#f59e0b', sub: '25 mph when children present — regardless of posted limit' },
      { label: '🏥 Hospital areas', color: '#3b82f6', sub: 'Watch for patients, elderly, and wheelchair users at crossings' },
      { label: '🛒 Parking lots', color: '#10b981', sub: 'Most dangerous for pedestrians per square foot of road — slow to 10 mph' },
      { label: '🏘️ Residential streets', color: '#94a3b8', sub: 'Children play unexpectedly — expect the unexpected at driveways and between parked cars' },
    ]} />
  ),

  '9.6 Cyclist Safety Equipment and California Law': (
    <Steps label="Cyclist equipment required or recommended under California law" steps={[
      'Helmet required for all cyclists under 18 (CVC §21212) — strongly recommended for all ages',
      'White headlight visible from 300 feet when riding at night (CVC §21201)',
      'Red rear reflector or red rear light visible from 500 feet at night',
      'Reflectors on pedals or shoes visible from 200 feet',
      'Brakes capable of stopping on dry, level, clean pavement',
    ]} />
  ),

  '8.10 Airbag Safety — What You Need to Know': (
    <DataTable
      headers={['Airbag Safety Rule', 'Why It Matters']}
      rows={[
        ['Sit at least 10 inches from the steering wheel', 'Airbag deploys at 200 mph — too close = injury from bag, not crash'],
        ['Never disable an airbag without DMV authorization', 'Airbags save ~50,000 lives per year in the U.S.'],
        ['Rear-facing car seats: never in front seat with active airbag', 'Deploying airbag can be fatal to a rear-facing infant'],
        ['Keep hands at 9 and 3 o\'clock (not 10 and 2)', '10-and-2 puts arms in airbag deployment path'],
        ['After any airbag deployment: replace immediately', 'Single-use device — a deployed airbag provides no protection'],
      ]}
      caption="Modern vehicles have 6–12 airbags. Front, side, and curtain airbags all have specific clearance requirements."
    />
  ),

  '8.11 Electronic Safety Systems — How Modern Technology Protects You': (
    <DataTable
      headers={['System', 'Abbreviation', 'What It Does']}
      rows={[
        ['Electronic Stability Control', 'ESC', 'Detects skidding; applies individual wheel brakes to correct'],
        ['Automatic Emergency Braking', 'AEB', 'Brakes automatically when collision is imminent'],
        ['Lane Departure Warning', 'LDW', 'Alerts when vehicle drifts out of lane'],
        ['Lane Keeping Assist', 'LKA', 'Applies gentle steering to return vehicle to lane'],
        ['Blind Spot Monitoring', 'BSM', 'Alerts when a vehicle is in your blind spot'],
        ['Backup Camera', '—', 'Required on all new vehicles sold in U.S. since 2018'],
      ]}
      caption="ADAS systems supplement — not replace — driver attention. No current system is fully autonomous."
    />
  ),

  '8.12 Preparing Your Vehicle for Specific Driving Conditions': (
    <Steps label="Seasonal vehicle preparation checklist" steps={[
      'Summer/heat: check tire pressure (rises ~1 PSI per 10°F), coolant level, and A/C system',
      'Rainy season: check wiper blades, tire tread depth, and brake function',
      'Mountain/winter: carry chains if traveling to elevations above 3,000 ft in winter months',
      'Long trips: inspect all fluid levels, tire condition, belts, and battery charge before departing',
    ]} />
  ),

  '8.10 Advanced Vehicle Safety Systems — Understanding and Using Modern Technology': (
    <Comparison
      leftLabel="Warning systems (LDW, FCW, BSM)" leftColor="#f59e0b"
      rightLabel="Assist systems (LKA, AEB, ACC)" rightColor="#3b82f6"
      rows={[
        ['Alert the driver — you still act', 'Intervene automatically — system acts'],
        ['No steering or braking input', 'Apply steering, braking, or throttle'],
        ['Always active — no engagement needed', 'May require activation by the driver'],
        ['No liability shift — driver remains responsible', 'No liability shift — driver still responsible'],
        ['Examples: lane drift alert, blind spot alert', 'Examples: auto-brake, lane steering correction'],
      ]}
    />
  ),

  '8.11 Tire Safety — A Comprehensive Guide': (
    <DataTable
      headers={['Tire Condition', 'Effect', 'Action Required']}
      rows={[
        ['Under-inflated (>10 PSI low)', 'Increased heat, poor handling, higher blowout risk', 'Inflate to spec — check monthly'],
        ['Over-inflated (>10 PSI high)', 'Reduced contact patch, harsh ride, center wear', 'Release to spec pressure'],
        ['Tread below 2/32 inch', 'Hydroplaning in rain, severely reduced braking', 'Replace immediately'],
        ['Tread below 4/32 inch', 'Reduced wet-weather performance', 'Plan for replacement soon'],
        ['Tires over 6 years old', 'Rubber degradation even with adequate tread', 'Replace regardless of tread depth'],
        ['One tire worn significantly different', 'Alignment or suspension problem', 'Inspect alignment and suspension'],
      ]}
    />
  ),

  '8.12 Vehicle Inspections and California Smog Requirements': (
    <Steps label="California smog inspection — who needs it and when" steps={[
      'Most vehicles 1975 and newer require biennial (every 2 years) smog inspection',
      'Required at registration renewal in most California counties',
      'Also required when a vehicle is sold — seller must provide a current certificate',
      'Vehicles 8 years old or newer are exempt in their first years — check DMV for your vehicle',
      'If your vehicle fails: repairs must be made before registration renews — financial assistance programs exist',
    ]} />
  ),

  // ── Chapter 9 ──────────────────────────────────────────────────────────────

  '10.8 Work Zones — A Special Environmental Hazard': (
    <DataTable
      headers={['Work Zone Violation', 'Standard Fine', 'Work Zone Fine']}
      rows={[
        ['Speeding', 'Up to $490', 'Up to $1,000 (doubled)'],
        ['Failure to obey flagger', 'Up to $490', 'Up to $1,000 (doubled)'],
        ['Passing in no-passing zone', 'Up to $490', 'Up to $1,000 (doubled)'],
        ['Work zone fatality caused by driver', 'Standard penalties', 'Felony potential — prison time'],
      ]}
      caption="Construction workers face the highest occupational fatality rate in California. Doubled fines reflect the severity of risk."
    />
  ),

  '9.9 Urban Pedestrian Safety — Specific City Environments': (
    <Steps label="Urban environments where pedestrian crashes are most common" steps={[
      'Parking lots and garages — expect pedestrians behind every vehicle; reverse slowly',
      'Bus stops — passengers may step into traffic unexpectedly when running for a bus',
      'Between parked cars — children and cyclists can emerge with no warning',
      'Commercial delivery areas — pedestrians distracted by phones while walking',
      'Intersections after a long red — pedestrians may be mid-crossing when your light turns green',
    ]} />
  ),

  '9.10 Cyclist Safety in California\'s Evolving Infrastructure': (
    <RuleCard
      icon="🚲"
      title="Bike lanes: do not enter, block, or park in them"
      text="Bicycle lanes are legally designated traffic lanes, not shoulder space or a convenient place to briefly stop. Driving, stopping, or parking in a bike lane forces cyclists into traffic and is a moving violation. California is expanding its bike lane network significantly — expect more separated bike infrastructure in coming years, with stricter enforcement of lane protections."
    />
  ),

  '9.11 School Transportation Safety — Buses, Drop-offs, and Walking Routes': (
    <Steps label="School bus and school zone rules" steps={[
      'Flashing red lights + stop arm extended: STOP — all lanes in both directions, unless divided highway',
      'Divided highway (physical barrier): only lanes on the same side as the bus must stop',
      'Remain stopped until red lights stop flashing AND stop arm retracts AND bus moves',
      'School zone (25 mph): applies when children are present, even if school is not in session',
      'Never pass a vehicle stopped for a school crossing guard',
    ]} />
  ),

  '9.12 The Future of Pedestrian and Cyclist Safety in California': (
    <RuleCard
      icon="🎯"
      title="Vision Zero: no traffic death is acceptable — not even one"
      text="Vision Zero is a road safety philosophy adopted by dozens of California cities including Los Angeles, San Francisco, and San Jose. Its core premise is that traffic fatalities are not accidents — they are predictable and preventable outcomes of road design and driver behavior choices. The program combines road redesign (lower speed limits, protected bike lanes, improved lighting) with enforcement and education. It originated in Sweden, where traffic fatalities per capita are among the lowest in the world."
    />
  ),

  '9.11 Pedestrian Safety — A Public Health Perspective': (
    <StatCard
      value="25%"
      unit="of CA traffic deaths"
      label="Pedestrians — despite walking much less than driving"
      sub="Pedestrians are among the most vulnerable road users because they have no physical protection in a vehicle collision. The risk is disproportionate: pedestrians account for roughly 1% of vehicle miles of travel but 25% of traffic fatalities in California. Every mph above 20 significantly increases the probability that a struck pedestrian dies."
    />
  ),

  '9.12 The Human Factors of Pedestrian-Vehicle Collisions': (
    <Comparison
      leftLabel="Driver factors" leftColor="#ef4444"
      rightLabel="Pedestrian factors" rightColor="#f59e0b"
      rows={[
        ['Distraction (phone, infotainment)', 'Distraction (phone while walking)'],
        ['Failure to yield at crosswalks', 'Crossing mid-block outside crosswalk'],
        ['Turning without scanning for pedestrians', 'Stepping off curb without checking traffic'],
        ['Impaired driving', 'Impaired walking (alcohol)'],
        ['Speeding in pedestrian areas', 'Dark clothing at night'],
      ]}
    />
  ),

  '9.13 Cyclist Safety — Road Sharing as a Cultural Practice': (
    <RuleCard
      icon="🤝"
      title="Sharing the road with cyclists requires patience, not just compliance"
      text="California law sets minimum standards for how drivers must treat cyclists. But the safe driver goes beyond legal minimums: giving more than 3 feet of clearance when space allows, waiting patiently when passing safely requires slowing down, treating a cyclist's lane position as their legal right rather than an inconvenience, and recognizing that cyclists are exposed road users without any physical protection. The legal minimum is the floor — not the standard."
    />
  ),

  // ── Chapter 10 ──────────────────────────────────────────────────────────────

  '10.12 Earthquakes and Driving in California': (
    <Steps label="If an earthquake strikes while you are driving" steps={[
      'Pull over to the right as quickly as safely possible — do not stop on overpasses, bridges, or under power lines',
      'Stay in the vehicle until the shaking stops',
      'After shaking: check for road damage and debris before proceeding',
      'Avoid overpasses, bridges, and tunnels — inspect for damage before using',
      'Use caution approaching intersections — traffic signals may be out',
      'Tune to KCBS or local emergency radio for road closure information',
    ]} />
  ),

  '10.13 Wildfires and Driving in California': (
    <Steps label="Driving during wildfire evacuations" steps={[
      'Leave immediately when an evacuation order is issued — do not wait for mandatory order',
      'Follow designated evacuation routes — do not shortcut through fire zones',
      'Turn on headlights — smoke dramatically reduces visibility',
      'If smoke is heavy: close windows and set A/C to recirculate',
      'If surrounded by fire with no escape: pull off the road, turn off the engine, lie on the floor below window level',
    ]} />
  ),

  '10.14 Seasonal Driving Tips for California\'s Diverse Geography': (
    <DataTable
      headers={['Season / Condition', 'Key Preparation', 'Key Driving Adjustment']}
      rows={[
        ['Rainy season (Oct–Apr)', 'Check wipers, tires, brakes', 'Increase following distance; allow 2× stopping distance'],
        ['Summer heat (June–Sept)', 'Check tire pressure, coolant, A/C', 'Check tires before long desert drives; watch for tire blowouts'],
        ['Mountain winter', 'Carry chains; check battery', 'Shift to low gear for descents; watch for black ice'],
        ['Wildfire season (Aug–Nov)', 'Know your evacuation route', 'Reduce speed in smoke; turn on headlights'],
        ['Tule fog season (Nov–Feb)', 'Ensure fog lights work', 'Low beams only; pull over if below 200 ft visibility'],
      ]}
    />
  ),

  '10.15 How to Stay Informed About Road and Weather Conditions': (
    <TagRow items={[
      { label: '📱 Caltrans 511', color: '#f59e0b', sub: 'Call or visit 511.org for real-time traffic, incidents, road closures' },
      { label: '📻 CHP Radio', color: '#3b82f6', sub: 'Local AM stations carry CHP emergency broadcasts during major events' },
      { label: '⛈️ NWS Alerts', color: '#10b981', sub: 'weather.gov or the FEMA emergency alert app for severe weather warnings' },
      { label: '🔥 CalFire', color: '#ef4444', sub: 'fire.ca.gov and ReadyForWildfire.org for fire conditions and evacuation maps' },
    ]} />
  ),

  '10.5 Night Driving and Low-Light Conditions': (
    <StatCard
      value="3×"
      unit="higher crash risk per mile"
      label="Night driving vs. daytime driving"
      sub="Despite only 25% of driving occurring at night, approximately 50% of traffic deaths occur at night. Factors: reduced visibility, increased likelihood of impaired drivers, fatigue, and reduced pedestrian visibility. Use high beams on unlit roads (switch off for oncoming traffic at 500 feet or following traffic at 300 feet)."
    />
  ),

  '10.6 Driving in Rain and Wet Conditions': (
    <Steps label="What to do if your vehicle begins to hydroplane" steps={[
      'Do not brake suddenly — it can cause a spin',
      'Do not turn the steering wheel sharply',
      'Ease off the accelerator smoothly and gradually',
      'Hold the steering wheel straight and let the vehicle slow naturally',
      'Wait until you feel the tires make contact with the road surface again',
    ]} horizontal />
  ),

  '10.7 Fog and Reduced Visibility Conditions': (
    <DataTable
      headers={['Fog Driving Rule', 'Reason']}
      rows={[
        ['Use low beams — not high beams', 'High beams reflect off fog and reduce visibility further'],
        ['Never use hazard lights while moving', 'Illegal in California; confuses other drivers about your direction'],
        ['Pull completely off the road if visibility drops below 200 feet', 'At freeway speeds, 200 feet is less than 2 seconds of stopping distance'],
        ['Turn off lights when parked off road', 'Other drivers may follow your tail lights off the road'],
        ['Tune to traffic radio before entering known fog areas', 'Pile-ups in tule fog can involve dozens of vehicles'],
      ]}
      caption="Tule fog in California's Central Valley is among the most dangerous weather conditions in North America."
    />
  ),

  '10.8 Wind and High-Profile Vehicle Hazards': (
    <RuleCard
      icon="💨"
      title="Crosswinds affect large trucks and RVs 50% more than passenger cars"
      text="High-profile vehicles — trucks, RVs, buses, vans, and vehicles towing trailers — have significantly larger surface areas and are far more affected by crosswinds than passenger cars. When you see a wind advisory or observe a high-profile vehicle drifting, give them extra lateral clearance. On bridges, overpasses, and open stretches of freeway, sudden gusts can push a truck partially or fully out of its lane with little warning to the driver."
    />
  ),

  '10.9 Driving in Extreme Heat and California\'s Desert Environments': (
    <Steps label="Desert and extreme heat driving preparation" steps={[
      'Check tire pressure before departure — tires can gain 5+ PSI in extreme heat, causing blowout risk',
      'Check coolant level and ensure your cooling system is in good condition',
      'Carry at least 2 gallons of water per person for emergencies',
      'Fill the tank — gas stations are far apart in desert areas',
      'If your vehicle overheats: pull over immediately, turn off the engine, never remove the radiator cap while hot',
      'If stranded: stay with the vehicle — it is easier to spot than a person on foot',
    ]} />
  ),

  '10.10 Fire, Smoke, and Wildfire Evacuation Driving': (
    <RuleCard
      icon="🔥"
      title="Dense wildfire smoke: treat it like heavy fog"
      text="Wildfire smoke can reduce visibility to near zero in minutes. When driving in heavy smoke: slow down significantly, turn on headlights, increase following distance to at least 6 seconds, and set your A/C to recirculate (to keep smoke out of the cabin). If smoke becomes so thick that you cannot see, pull completely off the road, turn on hazard lights, and wait — do not attempt to drive through zero-visibility smoke."
    />
  ),

  '10.11 Mountain and High-Altitude Driving in California': (
    <Steps label="Mountain descent — the correct technique" steps={[
      'Before descending: shift to a lower gear (2nd or Low, or use engine braking mode on hybrids/EVs)',
      'Use the engine to control speed — apply brakes only as needed for additional slowing',
      'Never ride the brake pedal continuously — brake fade can occur within minutes',
      'If brake fade occurs: pull off the road immediately and allow brakes to cool for 20+ minutes',
      'On two-lane mountain roads: use turnouts to let following traffic pass safely',
    ]} />
  ),

  '10.12 Driving in Earthquake Country — California-Specific Preparedness': (
    <RuleCard
      icon="🌍"
      title="California averages 10,000 earthquakes per year — most are imperceptible"
      text="California sits on the Pacific Ring of Fire and has over 15,000 known earthquake faults. The San Andreas Fault alone is capable of a magnitude 8.0+ earthquake. Every California driver should have an earthquake emergency kit in their vehicle (water, first aid, flashlight, blanket, cash), know their local evacuation routes, and understand that roads, bridges, and overpasses may be damaged or impassable after a major earthquake."
    />
  ),

}

// ─── Public API ────────────────────────────────────────────────────────────

export function getSectionDiagram(headerText: string): JSX.Element | null {
  return diagrams[headerText] ?? null
}

export function isSectionHeader(paragraph: string): boolean {
  return (
    /^\d+\.\d+\s/.test(paragraph) ||
    /^[A-K]\.\d+\s/.test(paragraph)
  )
}
