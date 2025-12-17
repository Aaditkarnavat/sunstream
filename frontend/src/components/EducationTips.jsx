export default function EducationTips() {
  const tips = [
    "Shift heavy appliance usage to sunny hours to maximise solar usage.",
    "Monitoring your daily solar output helps optimise battery and consumption.",
    "Buying local solar energy reduces transmission losses and supports neighbours."
  ];

  return (
    <section aria-label="Educational tips about solar energy">
      <h2>Learn About Solar</h2>
      <ul>
        {tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
