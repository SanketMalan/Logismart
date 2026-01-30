
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizedRoute, ShipmentStatus } from "../types";

export const getSmartLogisticAdvice = async (origin: string, destination: string, cargoType: string): Promise<OptimizedRoute[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Recommend 3 logistics options for shipping ${cargoType} within India from ${origin} to ${destination}. 
               Include specific Indian carriers like BlueDart, Delhivery, XpressBees, Ecom Express, or DTDC. 
               Include estimated cost in INR (range), estimated delivery time, and efficiency score. 
               Mention factors like RTO risk or COD availability if relevant to the route.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            carrier: { type: Type.STRING },
            cost: { type: Type.STRING },
            estimatedDelivery: { type: Type.STRING },
            efficiencyScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ["carrier", "cost", "estimatedDelivery", "efficiencyScore", "reasoning"]
        }
      }
    }
  });

  const text = response.text;
  return text ? JSON.parse(text.trim()) : [];
};

export const calculateShippingRates = async (originPincode: string, destinationPincode: string, weight: number): Promise<any[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Calculate estimated shipping rates for an Indian domestic shipment from Pincode ${originPincode} to ${destinationPincode} for a weight of ${weight}kg. 
               Provide 3 options: Surface, Express, and Premium Air.
               Use realistic Indian courier pricing (e.g. ₹40-100 per kg base).
               Include carrier names like Delhivery, BlueDart, DTDC.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            serviceName: { type: Type.STRING },
            carrier: { type: Type.STRING },
            estimatedCost: { type: Type.NUMBER },
            deliveryDays: { type: Type.STRING },
            features: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["serviceName", "carrier", "estimatedCost", "deliveryDays", "features"]
        }
      }
    }
  });

  const text = response.text;
  return text ? JSON.parse(text.trim()) : [];
};

export const trackShipment = async (trackingId: string): Promise<ShipmentStatus> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a realistic Indian domestic shipment tracking status for ID: ${trackingId}. 
               Use Indian cities (e.g., Mumbai, Delhi, Bangalore, Kolkata) and local hubs like 'Bhiwandi Sorting Facility' or 'Gurgaon Hub'. 
               Create a 4-step history leading to the current status.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          currentStatus: { type: Type.STRING },
          origin: { type: Type.STRING },
          destination: { type: Type.STRING },
          estimatedArrival: { type: Type.STRING },
          history: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                location: { type: Type.STRING },
                status: { type: Type.STRING },
                details: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const text = response.text;
  return text ? JSON.parse(text.trim()) : {} as ShipmentStatus;
};

export const getLogiBotResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'Namaste! You are LogiBot, the expert Indian logistics AI assistant for LogiSmart. You help Indian eCommerce sellers (D2C, Marketplace) optimize their shipping across 29,000+ pincodes. You know about GST, COD reconciliation, and top Indian carriers like Delhivery and BlueDart. Be professional, helpful, and energetic.',
    },
    history: history
  });

  return await chat.sendMessageStream({ message });
};
