//  This component fetches live GB grid carbon intensity from https://api.carbonintensity.org.uk/intensity and shows a single summarized line
import { useEffect, useState } from "react";
export default function EnergyFact() {
  const [fact, setFact] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        // We take either the actual or forecast value and the qualitative index (example : “moderate”) from the API response.Sss
        const res = await fetch("https://api.carbonintensity.org.uk/intensity");
        const data = await res.json();
        const current = data.data?.[0];
        const intensity = current?.intensity?.actual ?? current?.intensity?.forecast;
        setFact({
          carbon: intensity,
          index: current?.intensity?.index,
        });
      } catch (err) {
        setError("Could not load live energy data.");
      }
    };
    load();
  }, []);

  if (error) return <p>{error}</p>;
  if (!fact) return <p>Loading live energy data…</p>;

  return (
    <p>
      Live GB grid: {fact.carbon} gCO₂/kWh ({fact.index}).
    </p>
  );
}
