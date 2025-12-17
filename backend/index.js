// backend/index.js
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { firebaseConfig } = require("../shared/firebaseConfig");
const serviceAccount = require("./serviceAccountKey.json");

// This Initializes Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: firebaseConfig.projectId
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();
app.use(cors());
app.use(express.json());


async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
  } catch (err) {
    console.log("Token verification failed:", err.message);
    req.user = null;
  }
  next();
}
app.use(verifyToken);


app.get("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const snap = await db.collection("users").doc(uid).get();
    if (!snap.exists) return res.status(404).json({ error: "Not found" });
    res.json(snap.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    await db.collection("users").doc(uid).set(req.body, { merge: true });
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/offers", async (req, res) => {
  try {
    const snapshot = await db.collection("energyOffers").get();
    const offers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/offers", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { uid, email, kwh, price, location } = req.body;
    const ref = await db.collection("energyOffers").add({
      uid,
      email,
      kwh,
      price,
      location,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/offers/recommendations", async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "uid required" });

    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) return res.status(404).json({ error: "User not found" });

    const user = userSnap.data();

    const snapshot = await db.collection("energyOffers").get();
    let offers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Simple personalisation feature set : same location + budget
    offers = offers.filter((o) => o.location === user.location);

    if (user.budget === "low") {
      offers.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (user.budget === "high") {
      offers.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    res.json(offers.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Sunstream backend listening on port", PORT);
});
