import { useState } from "react";
import { api } from "../../api";

export default function OfferForm({ user, userProfile, onCreated }) {
  const [kwh, setKwh] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  // This creates a new energy offer document tied to the logged-in prosumer
  try {
    const token = await user.getIdToken(); // Gets Firebase auth token
    
    await api.addOffer(
      {
        uid: user.uid,
        email: userProfile.email,
        kwh: Number(kwh),
        price: Number(price),
        location: userProfile.location,
      },
      token // Passes token as second parameter
    );

    // Clears form after successful submission
    setKwh("");
    setPrice("");

    // Triggers success popup in parent component
    onCreated();
  } catch (err) {
    setError("Error adding offer: " + err.message);
  } finally {
    setLoading(false);
  }
};

  // Only shows this form if user is a prosumer
  if (!user || userProfile.role !== "prosumer") return null;

  return (
    <section aria-label="Add energy offer">
      <h2>Add Energy Offer</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount (kWh)
          <input
            type="number"
            min="0"
            step="0.1"
            value={kwh}
            onChange={(e) => setKwh(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label>
          Price (£)
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={loading}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Offer"}
        </button>
      </form>
      {error && (
        <p role="alert" style={{ color: "#ef4444", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
    </section>
  );
}
