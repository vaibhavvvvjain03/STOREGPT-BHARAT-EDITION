# 🇮🇳 StoreGPT: Bharat Edition
### Democratizing E-Commerce for the Next Billion Users via Voice AI

**StoreGPT** is an offline-first, voice-controlled Progressive Web App (PWA) designed for India's 6.3 crore micro-MSMEs (Kirana, Chai Walas, Tailors) who cannot type in English or navigate complex interfaces.

---

## 🎤 For Judges: How to Demo (Sample Prompts)
To see the **Context-Aware AI Engine** in action, try these specific voice or text prompts. The app adapts the **Theme, Images, and Product Catalog** instantly based on your input.

### 🍵 Scenario 1: The Chai Wala (Food & Beverage)
> **Prompt:** "Raju's Chai Shop in Mumbai"
> **What happens:** > * **Theme:** Cafe/Food
> * **Images:** Fetches high-quality Tea/Snack images.
> * **Products:** Masala Chai, Bun Maska, Samosa.

### 🥻 Scenario 2: The Boutique Owner (Fashion)
> **Prompt:** "Lakshmi Saree Center and Fashion"
> **What happens:** > * **Theme:** Fashion/Boutique
> * **Images:** Fetches Saree, Dress, and Fabric images.
> * **Products:** Silk Sarees, Kurtis, Cotton Fabrics.

### 📱 Scenario 3: The Electronics Shop (Tech)
> **Prompt:** "TechZone Mobile Repair and Laptop"
> **What happens:** > * **Theme:** Electronics
> * **Images:** Fetches Gadgets, Phones, Accessories.
> * **Products:** Screen Guards, Headphones, Chargers.

### 🛍️ Scenario 4: The Kirana Store (General)
> **Prompt:** "Gupta General Store"
> **What happens:** > * **Theme:** Retail/General
> * **Products:** Rice, Dal, Daily Essentials.

---

## 🧠 AI & Technical Implementation Strategy

StoreGPT uses a unique **"Hybrid AI Architecture"** designed specifically for rural India's intermittent internet connectivity.

### 1. 🗣️ Voice-First Interface (Speech AI)
* **Technology:** Native `webkitSpeechRecognition` API (Browser Standard).
* **Innovation:** We bypassed heavy server-side Whisper APIs to ensure **zero-latency** voice input even on 2G networks. It supports Indian English and Hindi accents natively.

### 2. ⚡ The "Traffic Cop" Intelligence (NLP)
* **The Problem:** Traditional AI generation takes 10-15 seconds and requires stable internet.
* **Our Solution:** We built a **Client-Side Deterministic NLP Engine**.
* **How it works:** * The engine analyzes the input string for 50+ semantic keywords (e.g., "repair", "tea", "fabric").
    * It instantly maps these intents to pre-optimized Industry Schemas.
    * **Result:** The store is generated in **100ms**, not 10s.

### 3. 🔊 "Bolne Wala Catalog" (Accessibility AI)
* **Feature:** Audio-enabled products for illiterate customers.
* **Technology:** `window.speechSynthesis` (Text-to-Speech).
* **Implementation:** Every generated product card is tagged with a dynamic speech utterance object, allowing the app to "read out" prices and details to the user.

### 4. 🤖 Generative AI Integration (Gemini Ready)
* **Architecture:** The codebase is structured with a modular `AI_Service`.
* **Pro Mode:** When an API Key is detected (Online Mode), the app switches from the "Local NLP Engine" to **Google Gemini 1.5 Flash**.
* **Capabilities:** Gemini is used to rewrite simple inputs ("Good tea") into professional marketing copy ("Premium Cardamom-Infused Masala Chai") and generate social media captions.

---

## 🛠️ Tech Stack
* **Frontend:** React 18, Vite, TypeScript
* **Styling:** Tailwind CSS, Framer Motion (Glassmorphism & 3D Effects)
* **Voice:** Web Speech API
* **Charts:** Recharts
* **Deployment:** Netlify (CI/CD)

---

## 🚀 Key Features Checklist
- [x] **Zero-Typing Setup:** Build a store using only voice.
- [x] **Offline Resilience:** Works perfectly without backend dependencies.
- [x] **Voice Khata:** Ledger management via voice commands.
- [x] **Vernacular Support:** UI simulation for 22 Indian languages.
- [x] **QR Standee Generator:** Instant printable assets for the counter.

---

### 🏆 Why This Matters
We didn't just build a website builder. We built a **Digital Identity Creator** for the 90% of India that Silicon Valley forgot.