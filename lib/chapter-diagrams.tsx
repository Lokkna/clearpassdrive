// Billboard-style educational diagrams — one per chapter
// Each diagram conveys ONE clear message at a glance

export const ChapterDiagram = ({ chapterId }: { chapterId: number }) => {
  const diagrams: Record<number, JSX.Element> = {

    1: ( // California Traffic Laws — Speed Limits
      <svg width="100%" viewBox="0 0 680 220" role="img" aria-label="California speed limit zones">
        <rect width="680" height="220" fill="#0f2040" rx="12"/>
        <text x="340" y="30" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">CALIFORNIA SPEED LIMITS AT A GLANCE</text>
        {[
          { x: 60, label: 'School Zone', speed: '25', color: '#f59e0b', sub: 'when children present' },
          { x: 210, label: 'Residential', speed: '25', color: '#f59e0b', sub: 'unless posted' },
          { x: 360, label: 'Highway', speed: '65', color: '#3b82f6', sub: 'unless posted 70' },
          { x: 510, label: 'Freeway', speed: '70', color: '#10b981', sub: 'maximum posted' },
        ].map(({ x, label, speed, color, sub }) => (
          <g key={label} transform={`translate(${x}, 50)`}>
            <rect x="0" y="0" width="110" height="130" rx="8" fill="#1e3a6e"/>
            <rect x="10" y="10" width="90" height="90" rx="6" fill="white"/>
            <text x="55" y="36" textAnchor="middle" fontSize="10" fill="#374151" fontFamily="Outfit, sans-serif" fontWeight="600">SPEED</text>
            <text x="55" y="48" textAnchor="middle" fontSize="10" fill="#374151" fontFamily="Outfit, sans-serif" fontWeight="600">LIMIT</text>
            <text x="55" y="82" textAnchor="middle" fontSize="38" fill="#0f2040" fontFamily="Sora, sans-serif" fontWeight="800">{speed}</text>
            <text x="55" y="108" textAnchor="middle" fontSize="11" fill={color} fontFamily="Outfit, sans-serif" fontWeight="700">{label}</text>
            <text x="55" y="125" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Outfit, sans-serif">{sub}</text>
          </g>
        ))}
        <text x="340" y="205" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="Outfit, sans-serif">The Basic Speed Law: never drive faster than is safe for conditions, regardless of posted limit.</text>
      </svg>
    ),

    2: ( // Defensive Driving — Following Distance
      <svg width="100%" viewBox="0 0 680 200" role="img" aria-label="3-second following distance rule">
        <rect width="680" height="200" fill="#0f2040" rx="12"/>
        <text x="340" y="28" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">THE 3-SECOND FOLLOWING DISTANCE RULE</text>
        {/* Road */}
        <rect x="0" y="80" width="680" height="70" fill="#1e3a6e" rx="4"/>
        <line x1="0" y1="115" x2="680" y2="115" stroke="#f59e0b" strokeWidth="2" strokeDasharray="30 20"/>
        {/* Car 1 */}
        <g transform="translate(80, 83)">
          <rect x="0" y="0" width="100" height="50" rx="8" fill="#3b82f6"/>
          <rect x="10" y="8" width="35" height="20" rx="4" fill="#93c5fd" opacity="0.6"/>
          <rect x="55" y="8" width="35" height="20" rx="4" fill="#93c5fd" opacity="0.6"/>
          <circle cx="20" cy="50" r="8" fill="#1e293b"/>
          <circle cx="80" cy="50" r="8" fill="#1e293b"/>
          <text x="50" y="38" textAnchor="middle" fontSize="9" fill="white" fontFamily="Outfit, sans-serif" fontWeight="600">AHEAD</text>
        </g>
        {/* 3 second brace */}
        <line x1="185" y1="70" x2="430" y2="70" stroke="#f59e0b" strokeWidth="2"/>
        <line x1="185" y1="65" x2="185" y2="75" stroke="#f59e0b" strokeWidth="2"/>
        <line x1="430" y1="65" x2="430" y2="75" stroke="#f59e0b" strokeWidth="2"/>
        <text x="307" y="62" textAnchor="middle" fontSize="16" fill="#f59e0b" fontFamily="Sora, sans-serif" fontWeight="700">3 seconds</text>
        {/* Car 2 */}
        <g transform="translate(430, 83)">
          <rect x="0" y="0" width="100" height="50" rx="8" fill="#10b981"/>
          <rect x="10" y="8" width="35" height="20" rx="4" fill="#6ee7b7" opacity="0.6"/>
          <rect x="55" y="8" width="35" height="20" rx="4" fill="#6ee7b7" opacity="0.6"/>
          <circle cx="20" cy="50" r="8" fill="#1e293b"/>
          <circle cx="80" cy="50" r="8" fill="#1e293b"/>
          <text x="50" y="38" textAnchor="middle" fontSize="9" fill="white" fontFamily="Outfit, sans-serif" fontWeight="600">YOU</text>
        </g>
        <text x="340" y="180" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="Outfit, sans-serif">Pick a landmark. When the car ahead passes it, count: one-thousand-one, one-thousand-two, one-thousand-three.</text>
      </svg>
    ),

    3: ( // Road Rage — De-escalation
      <svg width="100%" viewBox="0 0 680 200" role="img" aria-label="Road rage de-escalation: don't engage">
        <rect width="680" height="200" fill="#0f2040" rx="12"/>
        <text x="340" y="28" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">WHEN ANOTHER DRIVER IS AGGRESSIVE</text>
        {[
          { x: 60, icon: '👁️', label: "Don't make\neye contact", color: '#ef4444' },
          { x: 220, icon: '🤐', label: "Don't\nrespond", color: '#ef4444' },
          { x: 380, icon: '↔️', label: 'Create\ndistance', color: '#10b981' },
          { x: 540, icon: '🚔', label: 'Drive to\nsafety', color: '#10b981' },
        ].map(({ x, icon, label, color }) => (
          <g key={label} transform={`translate(${x}, 45)`}>
            <rect x="0" y="0" width="120" height="110" rx="10" fill="#1e3a6e"/>
            <text x="60" y="45" textAnchor="middle" fontSize="32">{icon}</text>
            <rect x="10" y="60" width="100" height="2" fill={color} rx="1"/>
            {label.split('\n').map((line, i) => (
              <text key={i} x="60" y={82 + i * 16} textAnchor="middle" fontSize="12" fill={color} fontFamily="Outfit, sans-serif" fontWeight="700">{line}</text>
            ))}
          </g>
        ))}
        <text x="340" y="185" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="Outfit, sans-serif">No road conflict is worth a collision, a physical altercation, or your safety.</text>
      </svg>
    ),

    4: ( // Distracted Driving — Football Field
      <svg width="100%" viewBox="0 0 680 230" role="img" aria-label="Texting at 55mph covers a football field blind">
        <rect width="680" height="230" fill="#0f2040" rx="12"/>
        <text x="340" y="28" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">TEXTING AT 55 MPH FOR 5 SECONDS =</text>
        {/* Football field */}
        <rect x="40" y="50" width="600" height="80" rx="6" fill="#166534"/>
        <line x1="40" y1="90" x2="640" y2="90" stroke="white" strokeWidth="1" strokeDasharray="5 5" opacity="0.3"/>
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
          <line key={i} x1={40 + i * 60} y1="50" x2={40 + i * 60} y2="130" stroke="white" strokeWidth="1" opacity="0.4"/>
        ))}
        <text x="40" y="148" fontSize="10" fill="#64748b" fontFamily="Outfit, sans-serif">0</text>
        <text x="340" y="148" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="Outfit, sans-serif">50 yds</text>
        <text x="635" y="148" textAnchor="end" fontSize="10" fill="#64748b" fontFamily="Outfit, sans-serif">100 yds</text>
        {/* Car */}
        <g transform="translate(40, 63)">
          <rect x="0" y="0" width="60" height="34" rx="6" fill="#f59e0b"/>
          <rect x="6" y="6" width="20" height="14" rx="3" fill="#fef9c3" opacity="0.7"/>
          <rect x="34" y="6" width="20" height="14" rx="3" fill="#fef9c3" opacity="0.7"/>
        </g>
        {/* Dotted path */}
        <line x1="100" y1="80" x2="640" y2="80" stroke="#ef4444" strokeWidth="3" strokeDasharray="12 8"/>
        <text x="340" y="80" textAnchor="middle" fontSize="28" fill="#ef4444">⚠</text>
        <text x="340" y="172" textAnchor="middle" fontSize="24" fill="#ef4444" fontFamily="Sora, sans-serif" fontWeight="800">THE LENGTH OF A FOOTBALL FIELD</text>
        <text x="340" y="200" textAnchor="middle" fontSize="24" fill="#ef4444" fontFamily="Sora, sans-serif" fontWeight="800">— EYES OFF THE ROAD</text>
        <text x="340" y="220" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif">Hands-free calls still impair driving for up to 27 seconds after the call ends.</text>
      </svg>
    ),

    5: ( // Right of Way — Four Way Stop
      <svg width="100%" viewBox="0 0 680 240" role="img" aria-label="Four-way stop right of way rule">
        <rect width="680" height="240" fill="#0f2040" rx="12"/>
        <text x="340" y="22" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">FOUR-WAY STOP: WHO GOES FIRST?</text>
        {/* Roads */}
        <rect x="280" y="55" width="120" height="170" fill="#1e3a6e" rx="4"/>
        <rect x="60" y="115" width="560" height="50" fill="#1e3a6e" rx="4"/>
        <line x1="340" y1="55" x2="340" y2="115" stroke="#64748b" strokeWidth="1" strokeDasharray="8 6"/>
        <line x1="340" y1="165" x2="340" y2="225" stroke="#64748b" strokeWidth="1" strokeDasharray="8 6"/>
        <line x1="60" y1="140" x2="280" y2="140" stroke="#64748b" strokeWidth="1" strokeDasharray="8 6"/>
        <line x1="400" y1="140" x2="620" y2="140" stroke="#64748b" strokeWidth="1" strokeDasharray="8 6"/>
        {/* Green car going */}
        <g transform="translate(308, 165)">
          <rect x="0" y="0" width="40" height="60" rx="6" fill="#10b981"/>
          <rect x="6" y="6" width="28" height="18" rx="3" fill="#6ee7b7" opacity="0.6"/>
          <text x="20" y="45" textAnchor="middle" fontSize="8" fill="white" fontFamily="Outfit, sans-serif" fontWeight="700">1st</text>
        </g>
        <circle cx="328" cy="178" r="14" fill="#10b981" stroke="white" strokeWidth="2"/>
        <text x="328" y="183" textAnchor="middle" fontSize="10" fill="white" fontFamily="Outfit, sans-serif" fontWeight="700">GO</text>
        {/* Gray waiting cars */}
        <g transform="translate(308, 60)">
          <rect x="0" y="0" width="40" height="50" rx="6" fill="#475569"/>
          <circle cx="20" cy="-12" r="12" fill="#475569" stroke="#64748b" strokeWidth="1.5"/>
          <text x="20" y="-7" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Outfit, sans-serif">wait</text>
        </g>
        <g transform="translate(80, 120)">
          <rect x="0" y="0" width="50" height="38" rx="6" fill="#475569"/>
          <circle cx="-12" cy="19" r="12" fill="#475569" stroke="#64748b" strokeWidth="1.5"/>
          <text x="-12" y="24" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Outfit, sans-serif">wait</text>
        </g>
        <g transform="translate(490, 120)">
          <rect x="0" y="0" width="50" height="38" rx="6" fill="#475569"/>
          <circle cx="62" cy="19" r="12" fill="#475569" stroke="#64748b" strokeWidth="1.5"/>
          <text x="62" y="24" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Outfit, sans-serif">wait</text>
        </g>
        <text x="340" y="228" textAnchor="middle" fontSize="12" fill="#64748b" fontFamily="Outfit, sans-serif">First to arrive = first to go. Tie? Yield to the driver on your right.</text>
      </svg>
    ),

    6: ( // Operator Responsibility — Insurance Minimums
      <svg width="100%" viewBox="0 0 680 200" role="img" aria-label="California minimum insurance requirements">
        <rect width="680" height="200" fill="#0f2040" rx="12"/>
        <text x="340" y="28" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">CALIFORNIA MINIMUM LIABILITY INSURANCE</text>
        {[
          { x: 80, amount: '$15,000', label: 'Per person\ninjury', color: '#f59e0b' },
          { x: 280, amount: '$30,000', label: 'Per accident\ninjury', color: '#3b82f6' },
          { x: 480, amount: '$5,000', label: 'Property\ndamage', color: '#10b981' },
        ].map(({ x, amount, label, color }) => (
          <g key={amount} transform={`translate(${x}, 45)`}>
            <rect x="0" y="0" width="150" height="110" rx="10" fill="#1e3a6e"/>
            <text x="75" y="45" textAnchor="middle" fontSize="26" fill={color} fontFamily="Sora, sans-serif" fontWeight="800">{amount}</text>
            <rect x="20" y="55" width="110" height="2" fill={color} rx="1" opacity="0.4"/>
            {label.split('\n').map((line, i) => (
              <text key={i} x="75" y={75 + i * 16} textAnchor="middle" fontSize="12" fill="#94a3b8" fontFamily="Outfit, sans-serif">{line}</text>
            ))}
          </g>
        ))}
        <text x="340" y="180" textAnchor="middle" fontSize="11" fill="#ef4444" fontFamily="Outfit, sans-serif" fontWeight="600">⚠ These minimums may not cover the full cost of a serious accident. Experts recommend higher coverage.</text>
      </svg>
    ),

    7: ( // DUI — BAC Chart
      <svg width="100%" viewBox="0 0 680 230" role="img" aria-label="BAC legal limits by driver type">
        <rect width="680" height="230" fill="#0f2040" rx="12"/>
        <text x="340" y="28" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">CALIFORNIA DUI BLOOD ALCOHOL LIMITS</text>
        {[
          { x: 60, type: 'Standard\nDriver', bac: '0.08%', color: '#f59e0b', bar: 0.6 },
          { x: 230, type: 'Commercial\nDriver', bac: '0.04%', color: '#ef4444', bar: 0.3 },
          { x: 400, type: 'Under 21\n(Zero Tolerance)', bac: '0.01%', color: '#dc2626', bar: 0.08 },
          { x: 540, type: 'Any Driver\n(DUI per se)', bac: '0.08%+', color: '#ef4444', bar: 0.6 },
        ].map(({ x, type, bac, color, bar }) => (
          <g key={type} transform={`translate(${x}, 45)`}>
            <rect x="0" y="0" width="130" height="130" rx="10" fill="#1e3a6e"/>
            <rect x="25" y={100 - bar * 80} width="80" height={bar * 80} rx="4" fill={color} opacity="0.85"/>
            <rect x="25" y="20" width="80" height="80" rx="4" fill="none" stroke="#374151" strokeWidth="1"/>
            <text x="65" y="115" textAnchor="middle" fontSize="18" fill={color} fontFamily="Sora, sans-serif" fontWeight="800">{bac}</text>
            {type.split('\n').map((line, i) => (
              <text key={i} x="65" y={130 + i * 14} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Outfit, sans-serif">{line}</text>
            ))}
          </g>
        ))}
        <text x="340" y="222" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif">Impairment begins well below legal limits. The safest choice is zero alcohol before driving.</text>
      </svg>
    ),

    8: ( // Vehicle Safety — Tire Tread Test
      <svg width="100%" viewBox="0 0 680 210" role="img" aria-label="Tire tread penny test">
        <rect width="680" height="210" fill="#0f2040" rx="12"/>
        <text x="340" y="28" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">THE TIRE TREAD TEST</text>
        {/* Good tire */}
        <g transform="translate(80, 45)">
          <rect x="0" y="0" width="220" height="130" rx="10" fill="#1e3a6e"/>
          <rect x="20" y="20" width="80" height="90" rx="8" fill="#374151"/>
          {[0,1,2,3,4].map(i => <rect key={i} x="20" y={20 + i*18} width="80" height="8" rx="2" fill="#1e293b"/>)}
          {/* Penny */}
          <circle cx="60" cy="65" r="18" fill="#b45309"/>
          <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#fef3c7" fontFamily="Outfit, sans-serif">LINCOLN</text>
          <text x="60" y="58" textAnchor="middle" fontSize="8" fill="#fef3c7">👤</text>
          <rect x="55" y="47" width="10" height="10" fill="#1e3a6e"/>
          <text x="150" y="45" fontSize="14" fill="#10b981" fontFamily="Sora, sans-serif" fontWeight="700">SAFE ✓</text>
          <text x="150" y="65" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif">Lincoln's head</text>
          <text x="150" y="80" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif">is hidden by</text>
          <text x="150" y="95" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif">the tread</text>
          <text x="110" y="120" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif">Tread depth &gt; 2/32"</text>
        </g>
        {/* Bad tire */}
        <g transform="translate(360, 45)">
          <rect x="0" y="0" width="220" height="130" rx="10" fill="#1e3a6e"/>
          <rect x="20" y="20" width="80" height="90" rx="8" fill="#374151"/>
          {[0,1,2].map(i => <rect key={i} x="20" y={20 + i*10} width="80" height="4" rx="2" fill="#1e293b"/>)}
          <circle cx="60" cy="65" r="18" fill="#b45309"/>
          <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#fef3c7" fontFamily="Outfit, sans-serif">LINCOLN</text>
          <text x="60" y="58" textAnchor="middle" fontSize="8" fill="#fef3c7">👤</text>
          <text x="150" y="45" fontSize="14" fill="#ef4444" fontFamily="Sora, sans-serif" fontWeight="700">REPLACE ✗</text>
          <text x="150" y="65" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif">Lincoln's head</text>
          <text x="150" y="80" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif">is fully visible</text>
          <text x="150" y="95" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif">above tread</text>
          <text x="110" y="120" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif">Tread depth ≤ 2/32"</text>
        </g>
        <text x="340" y="198" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif">Worn tires hydroplane at lower speeds and take longer to stop. Check monthly.</text>
      </svg>
    ),

    9: ( // Pedestrian Safety — Speed vs Fatality
      <svg width="100%" viewBox="0 0 680 260" role="img" aria-label="Vehicle speed vs pedestrian fatality risk">
        <rect width="680" height="260" fill="#0f2040" rx="12"/>
        <text x="340" y="28" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">SPEED VS. PEDESTRIAN FATALITY RISK</text>
        {[
          { x: 80, mph: '20 mph', risk: '10%', height: 20, color: '#10b981' },
          { x: 230, mph: '30 mph', risk: '40%', height: 60, color: '#f59e0b' },
          { x: 380, mph: '40 mph', risk: '85%', height: 100, color: '#f97316' },
          { x: 530, mph: '50 mph', risk: '99%', height: 130, color: '#ef4444' },
        ].map(({ x, mph, risk, height, color }) => (
          <g key={mph} transform={`translate(${x}, 40)`}>
            <rect x="0" y="0" width="120" height="140" rx="10" fill="#1e3a6e"/>
            <rect x="20" y={130 - height} width="80" height={height} rx="4" fill={color}/>
            <rect x="20" y="20" width="80" height="110" rx="4" fill="none" stroke="#374151" strokeWidth="1"/>
            <text x="60" y="148" textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="Outfit, sans-serif">{mph}</text>
            <text x="60" y="170" textAnchor="middle" fontSize="18" fill={color} fontFamily="Sora, sans-serif" fontWeight="800">{risk}</text>
            <text x="60" y="188" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="Outfit, sans-serif">fatal risk</text>
          </g>
        ))}
        <text x="340" y="250" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif">The difference between 25 and 35 mph can mean the difference between life and death for a pedestrian.</text>
      </svg>
    ),

    10: ( // Environmental Factors — Weather Conditions
      <svg width="100%" viewBox="0 0 680 210" role="img" aria-label="Weather driving adaptations">
        <rect width="680" height="210" fill="#0f2040" rx="12"/>
        <text x="340" y="28" textAnchor="middle" fontSize="13" fill="#94a3b8" fontFamily="Outfit, sans-serif">ADAPT YOUR DRIVING TO CONDITIONS</text>
        {[
          { x: 40, icon: '🌧️', condition: 'Rain', action: 'Reduce speed\nIncrease following distance\nHeadlights on', color: '#3b82f6' },
          { x: 210, icon: '🌫️', condition: 'Fog', action: 'Low beams only\nDo not stop on freeway\nDrive to nearest exit', color: '#94a3b8' },
          { x: 380, icon: '💨', condition: 'Wind', action: 'Grip wheel firmly\nSlow before bridges\nWatch for debris', color: '#f59e0b' },
          { x: 550, icon: '🔥', condition: 'Extreme Heat', action: 'Check tire pressure\nMonitor engine temp\nCarry water', color: '#ef4444' },
        ].map(({ x, icon, condition, action, color }) => (
          <g key={condition} transform={`translate(${x}, 40)`}>
            <rect x="0" y="0" width="120" height="145" rx="10" fill="#1e3a6e"/>
            <text x="60" y="38" textAnchor="middle" fontSize="28">{icon}</text>
            <text x="60" y="58" textAnchor="middle" fontSize="13" fill={color} fontFamily="Sora, sans-serif" fontWeight="700">{condition}</text>
            <rect x="10" y="64" width="100" height="1.5" fill={color} rx="1" opacity="0.4"/>
            {action.split('\n').map((line, i) => (
              <text key={i} x="60" y={82 + i * 18} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Outfit, sans-serif">{line}</text>
            ))}
          </g>
        ))}
        <text x="340" y="200" textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Outfit, sans-serif">California's varied climate — fog, heat, wind, rain — demands constant environmental awareness.</text>
      </svg>
    ),
  }

  const diagram = diagrams[chapterId]
  if (!diagram) return null

  return (
    <div style={{ marginBottom: '32px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e3a6e' }}>
      {diagram}
    </div>
  )
}
