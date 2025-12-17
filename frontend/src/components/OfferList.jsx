import { useEffect, useState } from "react";
import { api } from "../../api";
import EnergyChart from "./EnergyChart";

export default function OfferList({ user, userProfile, onBuy }) {
  const [offers, setOffers] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [error, setError] = useState("");

  const loadOffers = async () => {
    try {
      setError("");
      // Backend should return ALL active offers here, not only for this specific user
      const res = await api.getOffers();
      setOffers(res.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadRecommendations = async () => {
    if (!user) return;
    try {
      const res = await api.getRecommendations(user.uid);
      setRecommended(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // This helps Reload offers whenever user changes (example : when you log in as consumer)
  useEffect(() => {
    if (user) {
      loadOffers();
    }
  }, [user]);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  return (
    <section aria-label="Energy offers">
      <h2>Energy Offers</h2>
      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {user && recommended.length > 0 && (
        <>
          <h3>Recommended for you</h3>
          <ul className="offer-list">
            {recommended.map((o) => (
              <li key={o.id} className="offer-item">
                <div className="offer-row">
                  <span className="offer-text">
                    <strong>{o.kwh} kWh</strong> at £{o.price} in {o.location} from{" "}
                    {o.email}
                  </span>

                  {userProfile?.role === "consumer" && (
                    <button
                      type="button"
                      className="buy-button"
                      onClick={() => onBuy?.(o)}
                    >
                      Buy
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>All offers</h3>
      <EnergyChart offers={offers} />
      <ul className="offer-list">
        {offers.map((o) => (
          <li key={o.id} className="offer-item">
            <div className="offer-row">
              <span className="offer-text">
                {o.kwh} kWh at £{o.price} in {o.location} from {o.email}
              </span>

              {userProfile?.role === "consumer" && (
                <button
                  type="button"
                  className="buy-button"
                  onClick={() => onBuy?.(o)}
                >
                  Buy
                </button>
              )}
            </div>
          </li>
        ))}
        {offers.length === 0 && (
          <li>No offers available yet.</li>
        )}
      </ul>
    </section>
  );
}
