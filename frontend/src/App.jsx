console.log("Sunstream App loaded");
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseClient";
import AuthForm from "./components/AuthForm";
import OfferForm from "./components/OfferForm";
import OfferList from "./components/OfferList";
import Dashboard from "./components/Dashboard";
import EducationTips from "./components/EducationTips";
import EnergyFact from "./components/EnergyFact";

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [themeHighContrast, setThemeHighContrast] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [view, setView] = useState("main"); 
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showOfferSuccess, setShowOfferSuccess] = useState(false); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          setUserProfile(snap.data());
        }
      } else {
        setUserProfile(null);
        setView("main");
        setSelectedOffer(null);
      }
    });
    return () => unsub();
  }, []);

  const toggleTheme = () => setThemeHighContrast((prev) => !prev);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleBuy = (offer) => {
    setSelectedOffer(offer);
    setView("billing");
  };

  const handlePurchaseComplete = () => {
    alert("Purchase complete!");
    setView("main");
    setSelectedOffer(null);
  };

  // Handler for when prosumer creates an offer
  const handleOfferCreated = () => {
    setShowOfferSuccess(true);
  };

  return (
    <div className={themeHighContrast ? "app app-high-contrast" : "app"}>
      <div className="app-bg" />

      <div className="app-overlay">
        <header className="app-header">
          <div className="title-wrapper">
            <h1 className="app-title">Sunstream</h1>
            <p className="app-tagline">Share your sun, power your community.</p>
          </div>

          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {themeHighContrast ? "Light mode" : "Dark mode"}
            </button>

            {user && (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </header>

        <main className="app-main">
          <section className="auth-card">
            {!user && <AuthForm onAuth={setUser} />}

            {user && userProfile && view === "main" && (
              <>
                
                <p className="logged-in">
                  Logged in as {user.email} ({userProfile.role})
                </p>

                {userProfile.role === "prosumer" && (
                  <OfferForm
                    user={user}
                    userProfile={userProfile}
                    onCreated={handleOfferCreated}
                  />
                )}

                <OfferList
                  user={user}
                  userProfile={userProfile}
                  onBuy={handleBuy}
                />

                <Dashboard user={user} />
              </>
            )}

            {user && userProfile && view === "billing" && selectedOffer && (
              <section className="billing-card">
                <h2>Billing</h2>
                <p>You are buying:</p>
                <p>
                  {selectedOffer.kwh} kWh at £{selectedOffer.price} in{" "}
                  {selectedOffer.location} from {selectedOffer.email}
                </p>

                <label>
                  Card number
                  <input type="text" placeholder="1111 2222 3333 4444" />
                </label>
                <label>
                  Name on card
                  <input type="text" />
                </label>

                <button
                  type="button"
                  className="confirm-button"
                  onClick={handlePurchaseComplete}
                >
                  Confirm purchase
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setView("main");
                    setSelectedOffer(null);
                  }}
                >
                  Cancel
                </button>
              </section>
            )}
          </section>

          {user && userProfile && (
            <section className="info-card">
              <h2>What is Sunstream?</h2>
              <p>
                Sunstream lets homes with solar panels share extra renewable
                energy with nearby users through local offers and requests.
              </p>

              <EnergyFact />

              <button
                type="button"
                className="tips-button"
                onClick={() => setShowTips(true)}
              >
                Additional tips
              </button>
            </section>
          )}
        </main>

       
        {showTips && (
          <div className="modal-backdrop" onClick={() => setShowTips(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Energy-saving tips</h3>
              <EducationTips />
              <button
                type="button"
                className="close-modal"
                onClick={() => setShowTips(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

    
        {showOfferSuccess && (
          <div className="modal-backdrop" onClick={() => setShowOfferSuccess(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>✓ Offer Created!</h3>
              <p>Your energy offer has been successfully listed.</p>
              <button
                type="button"
                className="close-modal"
                onClick={() => setShowOfferSuccess(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
