import React from "react";

/**
 * Simple SVG bar chart showing kWh per offer.
 * Expects offers to have a numeric `kwh` field.
 */
export default function EnergyChart({ offers }) {
  if (!offers || offers.length === 0) {
    return <p>No energy data available yet.</p>;
  }

  const values = offers.map((o) => Number(o.kwh) || 0);
  const max = Math.max(...values) || 1;

  const height = 120;
  const barWidth = 24;
  const gap = 8;
  const width = values.length * (barWidth + gap);

  return (
    <div aria-label="Energy shared chart">
      <h3>Energy shared per offer</h3>
      <svg width={width} height={height} role="img">
        {values.map((v, i) => {
          const barHeight = (v / max) * (height - 20);
          const x = i * (barWidth + gap);
          const y = height - barHeight;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#22c55e"
              rx="4"
            />
          );
        })}
      </svg>
      <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>
        Each bar represents the kWh value of one offer.
      </p>
    </div>
  );
}
