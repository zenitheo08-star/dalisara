import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Gemini AI
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", express.json(), async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
      }

      const { history, message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const contents = history ? [...history] : [];
      contents.push({ role: "user", parts: [{ text: message }] });

      const bookService = {
        name: "bookService",
        description: "Arrange a simulated reservation for dining at The Shore Kitchen or a restorative body treatment at Wellness House.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            serviceType: {
              type: Type.STRING,
              description: "The type of service to book ('dining' for The Shore Kitchen or 'wellness' for Wellness House)",
            },
            date: {
              type: Type.STRING,
              description: "The date for the reservation (e.g., '2026-11-15')",
            },
            time: {
              type: Type.STRING,
              description: "The preferred time (e.g., '19:00' or '10:00 AM')",
            },
            partySize: {
              type: Type.INTEGER,
              description: "Number of guests",
            },
            notes: {
              type: Type.STRING,
              description: "Special preferences or dietary notes",
            }
          },
          required: ["serviceType", "date", "time"],
        },
      };

      const systemInstruction = `You are the Digital Concierge for Dalisara, a quiet, architectural coastal resort located along the western coast of San Vicente, Palawan, Philippines.

IDENTITY & PHILOSOPHY:
- Embody "The Slower Measure" — an absence of urgency, architectural restraint, calm observation, and deep respect for the coastal forest and Sulu Sea.
- Tone: Unrushed, graceful, precise, hospitable, and composed.
- Strictly avoid forbidden promotional clichés: never use words like "paradise", "untouched", "exclusive", "world-class", "hidden gem", "transformative", "eco-luxe", "magical", "best kept secret", or "healing". Do not refer to the property as a "wellness resort" or "eco-resort".
- Strict Fictional Boundary: Dalisara is a fictional resort concept and portfolio demonstration. If asked about real reservations, clarify gracefully that this is an interactive portfolio simulation and no real credit card or reservation system is connected.

KEY RESORT DETAILS:
- 32 Accommodations across 5 categories:
  • 12 Grove Pavilions (56 m², 1 King + 1 child daybed, garden/forest view, base ₱25,000/night)
  • 10 Shore Pavilions (64 m², 1 King + 1 child daybed, coastal garden & filtered sea view, base ₱32,000/night)
  • 6 Pool Villas (86 m², 1 King, private plunge pool, adults only, base ₱43,000/night)
  • 3 Family Pool Villas (118 m², 1 King, 2 Twins + 1 built-in child daybed, private family pool, base ₱57,000/night)
  • 1 Dalisara House (186 m², 2 Kings + 2 built-in child daybeds, private pool & veranda, base ₱78,000/night)
- 5 Internal Property Zones: Arrival Grove, Grove Quarter, Social Heart, Quiet North, Shore Line.
- Dining: The Shore Kitchen (open kitchen, coastal seafood, breakfast included) and Canopy Bar (shaded timber pavilion, low-ABV infusions, aperitifs).
- Wellness House & Movement Pavilion: Restorative body care, massage, river stones, warm botanical oils, and morning mobility sessions. (No unverified claims of ancestral lineage or shamanism).
- 6 Signature Experiences: First Light Paddle, Reef Morning, Island Day, Long Beach Cycle, Kitchen Session, Shore Picnic.
- Transportation:
  • Puerto Princesa International Airport (PPS): 2.5–4 hrs overland private transfer (₱9,500 one-way up to 4 guests; ₱13,500 one-way 5–8 guests).
  • San Vicente Airport (SWL): Subject to flight schedules. Local pickup is ₱2,500 one-way per vehicle.
- Seasonal Rules & Minimum Stays:
  • Green Season (1 June – 31 October): 2-night minimum, base rates.
  • High Season (1 November – 19 December & 6 January – 31 May): 3-night minimum, +25% seasonal rate.
  • Festive Season (20 December – 5 January): 5-night minimum, +40% seasonal rate.
- Rate Plans:
  • Flexible: 50% simulated deposit, refundable up to 14 days before arrival.
  • Advance Purchase: 15% discount, 100% non-refundable prepayment.
  • Stay Longer: 10% discount for stays of 5 nights or more.

If a guest asks to book dining or wellness, use the bookService function to confirm their simulated reservation seamlessly.`;

      // Resilient model calling with valid Gemini model names
      const modelsToTry = ["gemini-3.7-flash", "gemini-3.5-flash-lite"];
      let response: any = null;
      let lastError: any = null;

      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
              tools: [{ functionDeclarations: [bookService] }],
            }
          });
          if (response) break;
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${modelName} encountered: ${err?.message || err}. Attempting next tier...`);
        }
      }

      if (!response && lastError) {
        throw lastError;
      }

      if (response?.functionCalls && response.functionCalls.length > 0) {
        const call = response.functionCalls[0];
        if (call.name === 'bookService') {
          const args = call.args as any;
          const serviceName = args.serviceType?.toLowerCase() === 'wellness' ? 'the Wellness House' : 'The Shore Kitchen';
          const sizeText = args.partySize ? ` for a party of ${args.partySize}` : '';
          const notesText = args.notes ? ` (Note: "${args.notes}")` : '';
          const reply = `I have arranged your simulated reservation at ${serviceName} on ${args.date} at ${args.time}${sizeText}${notesText}. A notification has been added to your stay itinerary. How else may I assist you with your time at Dalisara?`;
          return res.json({ text: reply });
        }
      }

      res.json({ text: response?.text || "I am at your service. Please let me know how else I may assist with your inquiries about Dalisara." });
    } catch (error: any) {
      console.error("Chat API handled exception:", error?.message || error?.toString());
      
      // Return a graceful, high-character response on demand spikes or temporary service interruptions
      return res.json({ 
        text: "Good day. Our digital host desk is currently experiencing a brief moment of high volume. I am at your service — please feel free to inquire again shortly, or explore our Stays, Dining, and Experiences in the meantime." 
      });
    }
  });

  const DEFAULT_WEATHER = {
    temperature: 29,
    condition: "Tropical Sun & Light Breeze",
    forecast: "Pleasantly warm along Long Beach with clear skies and a soothing offshore Amihan breeze."
  };

  let weatherCache: { data: any, lastFetch: number } = { 
    data: DEFAULT_WEATHER, 
    lastFetch: Date.now() 
  };
  const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
  const ERROR_COOLDOWN_MS = 30 * 60 * 1000; // 30 mins cooldown on error to prevent quota hammering

  app.get("/api/weather", async (req, res) => {
    try {
      const now = Date.now();
      
      // Return cached data if within the cache window
      if (weatherCache.data && (now - weatherCache.lastFetch < CACHE_DURATION_MS)) {
        return res.json(weatherCache.data);
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json(weatherCache.data || DEFAULT_WEATHER);
      }

      // Fetch live data from Gemini if cache expired
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: "What is the current weather in San Vicente, Palawan, Philippines today? Please provide the temperature in Celsius, the general weather condition (e.g., sunny, rainy, cloudy), and a very brief 1-sentence forecast for the day. Respond with JSON strictly.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              temperature: {
                type: Type.NUMBER,
                description: "Current temperature in Celsius",
              },
              condition: {
                type: Type.STRING,
                description: "Current weather condition (e.g. Sunny, Partly Cloudy, Light Rain)",
              },
              forecast: {
                type: Type.STRING,
                description: "A short 1-sentence description of the day's forecast",
              }
            },
            required: ["temperature", "condition", "forecast"],
          },
        },
      });

      const jsonStr = response.text?.trim() || "{}";
      const weatherData = JSON.parse(jsonStr);

      if (weatherData && typeof weatherData.temperature === "number") {
        weatherCache = {
          data: weatherData,
          lastFetch: now
        };
        return res.json(weatherData);
      } else {
        throw new Error("Invalid weather data format received");
      }
    } catch (error: any) {
      // Set cooldown timestamp so subsequent page loads don't hammer the API when rate-limited
      weatherCache.lastFetch = Date.now() - (CACHE_DURATION_MS - ERROR_COOLDOWN_MS);
      
      // Return current cached or default weather seamlessly
      return res.json(weatherCache.data || DEFAULT_WEATHER);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
