import React from 'react';
import { GateType, LogicLevel } from '../../types/vlsi';

interface LogicGateSvgProps {
  gate: GateType;
  inputs: LogicLevel[];
  output: LogicLevel;
  className?: string;
}

export const LogicGateSvg: React.FC<LogicGateSvgProps> = ({
  gate,
  inputs,
  output,
  className = 'w-full h-48',
}) => {
  const inA = inputs[0] ?? 0;
  const inB = inputs[1] ?? 0;

  const wireColorA = inA === 1 ? '#06b6d4' : '#475569';
  const wireColorB = inB === 1 ? '#06b6d4' : '#475569';
  const wireColorOut = output === 1 ? '#06b6d4' : '#475569';

  const isNot = gate === 'NOT';

  return (
    <svg
      viewBox="0 0 320 180"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${gate} gate schematic`}
    >
      {/* Background grid markings for schematic feel */}
      <defs>
        <pattern id="schematicGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.8" fill="#334155" opacity="0.4" />
        </pattern>
        <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="320" height="180" fill="url(#schematicGrid)" />

      {/* Input Pins and Labels */}
      {isNot ? (
        <g>
          {/* Single input A line */}
          <line
            x1="30"
            y1="90"
            x2="110"
            y2="90"
            stroke={wireColorA}
            strokeWidth="3.5"
            strokeLinecap="round"
            filter={inA === 1 ? 'url(#glowCyan)' : undefined}
          />
          <circle cx="30" cy="90" r="4.5" fill={wireColorA} />
          <text x="24" y="75" fill="#94a3b8" fontSize="12" fontWeight="600" textAnchor="middle" className="font-mono">
            A
          </text>
          <text x="50" y="82" fill={wireColorA} fontSize="11" fontWeight="700" className="font-mono">
            [{inA}]
          </text>
        </g>
      ) : (
        <g>
          {/* Input A line */}
          <line
            x1="30"
            y1="60"
            x2="105"
            y2="60"
            stroke={wireColorA}
            strokeWidth="3.5"
            strokeLinecap="round"
            filter={inA === 1 ? 'url(#glowCyan)' : undefined}
          />
          <circle cx="30" cy="60" r="4.5" fill={wireColorA} />
          <text x="24" y="48" fill="#94a3b8" fontSize="12" fontWeight="600" textAnchor="middle" className="font-mono">
            A
          </text>
          <text x="50" y="52" fill={wireColorA} fontSize="11" fontWeight="700" className="font-mono">
            [{inA}]
          </text>

          {/* Input B line */}
          <line
            x1="30"
            y1="120"
            x2="105"
            y2="120"
            stroke={wireColorB}
            strokeWidth="3.5"
            strokeLinecap="round"
            filter={inB === 1 ? 'url(#glowCyan)' : undefined}
          />
          <circle cx="30" cy="120" r="4.5" fill={wireColorB} />
          <text x="24" y="142" fill="#94a3b8" fontSize="12" fontWeight="600" textAnchor="middle" className="font-mono">
            B
          </text>
          <text x="50" y="136" fill={wireColorB} fontSize="11" fontWeight="700" className="font-mono">
            [{inB}]
          </text>
        </g>
      )}

      {/* Gate Geometry Body */}
      {gate === 'AND' && (
        <g>
          <path
            d="M 105 45 L 155 45 C 190 45 205 65 205 90 C 205 115 190 135 155 135 L 105 135 Z"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      )}

      {gate === 'NAND' && (
        <g>
          <path
            d="M 105 45 L 155 45 C 190 45 200 65 200 90 C 200 115 190 135 155 135 L 105 135 Z"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inversion Bubble */}
          <circle cx="210" cy="90" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {gate === 'OR' && (
        <g>
          <path
            d="M 100 45 Q 125 90 100 135 Q 165 135 205 90 Q 165 45 100 45 Z"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      )}

      {gate === 'NOR' && (
        <g>
          <path
            d="M 100 45 Q 125 90 100 135 Q 165 135 200 90 Q 165 45 100 45 Z"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inversion Bubble */}
          <circle cx="210" cy="90" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {gate === 'NOT' && (
        <g>
          <polygon
            points="110,50 110,130 185,90"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inversion Bubble */}
          <circle cx="195" cy="90" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {gate === 'XOR' && (
        <g>
          {/* Back input offset arc */}
          <path
            d="M 90 45 Q 115 90 90 135"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Main body with concave back */}
          <path
            d="M 104 45 Q 129 90 104 135 Q 165 135 205 90 Q 165 45 104 45 Z"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </g>
      )}

      {gate === 'XNOR' && (
        <g>
          {/* Back input offset arc */}
          <path
            d="M 90 45 Q 115 90 90 135"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Main body */}
          <path
            d="M 104 45 Q 129 90 104 135 Q 165 135 200 90 Q 165 45 104 45 Z"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inversion Bubble */}
          <circle cx="210" cy="90" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
        </g>
      )}

      {/* Output Wire and Pin */}
      {(() => {
        let outXStart = 205;
        if (gate === 'NOT') outXStart = 201;
        if (gate === 'NAND' || gate === 'NOR' || gate === 'XNOR') outXStart = 216;

        return (
          <g>
            <line
              x1={outXStart}
              y1="90"
              x2="290"
              y2="90"
              stroke={wireColorOut}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter={output === 1 ? 'url(#glowCyan)' : undefined}
            />
            <circle cx="290" cy="90" r="4.5" fill={wireColorOut} />
            <text x="296" y="75" fill="#94a3b8" fontSize="12" fontWeight="600" textAnchor="middle" className="font-mono">
              Y
            </text>
            <text x="248" y="82" fill={wireColorOut} fontSize="11" fontWeight="700" className="font-mono">
              [{output}]
            </text>
          </g>
        );
      })()}

      {/* Standard Gate Symbol Marker */}
      <text
        x="146"
        y="95"
        fill="#38bdf8"
        fontSize="12"
        fontWeight="600"
        opacity="0.85"
        textAnchor="middle"
        className="font-mono"
      >
        {gate}
      </text>
    </svg>
  );
};
