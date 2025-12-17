import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseClient";

export default function AuthForm({ onAuth }) {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("prosumer");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("low");
  const [error, setError] = useState("");

  // This path both creates a Firebase Auth user and writes an associated profile document in Firestore with role, location, and budget
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = cred.user.uid;
        await setDoc(doc(db, "users", uid), {
          uid,
          email,
          role,
          location,
          budget,
        });
        onAuth(cred.user);
        //On first login without a profile, it creates a default consumer profile document.
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;
        const snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) {
          await setDoc(doc(db, "users", uid), {
            uid,
            email: cred.user.email,
            role: "consumer",
            location: "",
            budget: "medium",
          });
        }
        onAuth(cred.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section aria-label="Authentication form">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            aria-label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            aria-label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {isRegister && (
          <> 
            <fieldset className="role-fieldset">
              <legend>Role</legend>
              <div className="role-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="prosumer"
                    checked={role === "prosumer"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Prosumer
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="consumer"
                    checked={role === "consumer"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Consumer
                </label>
              </div>
            </fieldset>

            <label>
              Location (e.g. postcode)
              <input
                aria-label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </label>

            <label>
              Budget preference
              <select
                aria-label="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="low">Low cost</option>
                <option value="medium">Balanced</option>
                <option value="high">Premium</option>
              </select>
            </label>
          </>
        )}

        {error && (
          <p role="alert" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>

      <button
        type="button"
        onClick={() => setIsRegister((prev) => !prev)}
        style={{ marginTop: "1rem" }}
      >
        {isRegister ? "Already have an account? Login" : "New user? Register"}
      </button>
    </section>
  );
}
