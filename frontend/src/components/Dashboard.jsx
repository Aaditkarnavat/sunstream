import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseClient";

const GRID_CO2_KG_PER_KWH = 0.233;

export default function Dashboard({ user }) {
  const [totalKwh, setTotalKwh] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [savedCo2, setSavedCo2] = useState(0);

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      const q = query(
        collection(db, "energyOffers"),
        where("uid", "==", user.uid)
      );
      const snap = await getDocs(q);
      let sumKwh = 0;
      let sumPrice = 0;
      snap.forEach((doc) => {
        const d = doc.data();
        sumKwh += d.kwh || 0;
        sumPrice += d.price || 0;
      });
      setTotalKwh(sumKwh);
      setTotalPrice(sumPrice);
      setSavedCo2(sumKwh * GRID_CO2_KG_PER_KWH);
    };

    run();
  }, [user]);

  if (!user) return null;

  return (
    <section aria-label="Dashboard and analytics">
      <h2>Dashboard</h2>
      <p>Total energy listed: {totalKwh.toFixed(1)} kWh</p>
      <p>Total price of offers: £{totalPrice.toFixed(2)}</p>
      <p>Estimated CO₂ saved: {savedCo2.toFixed(2)} kg</p>
    </section>
  );
}
