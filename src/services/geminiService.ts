import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SkinAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeSkin(base64Image: string): Promise<SkinAnalysis> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this facial image and provide a detailed dermatological and aesthetic assessment.
    Include:
    1. Skin type (oily, dry, combination, sensitive, normal).
    2. Any visible infections or conditions.
    3. Assessment of pimples, acne, color, symmetry, and texture.
    4. Severity level (low, medium, high).
    5. Detailed recommendations:
       - Treatment steps.
       - Dos and Don'ts.
       - Temporary over-the-counter medications (with a disclaimer).
       - Generic product suggestions.
       - Specific branded product suggestions from well-known brands (e.g., CeraVe, La Roche-Posay, Neutrogena, The Ordinary, etc.).
       - Natural/Alternative product suggestions.
       - Dietary changes.
       - Daily skincare routine.
    6. Determine if it's serious.
    7. Facial Analysis:
       - Calculate a facial symmetry percentage (0-100).
       - Provide a detailed symmetry analysis and correction methods (e.g., posture, chewing habits).
       - Suggest 3 specific facial exercises with instructions.
       - Estimate facial fat percentage.
       - Provide 3 tips to reduce facial fat.
       - Identify the face shape (Oval, Round, Square, Heart, Diamond, Oblong).
       - Suggest 3 suitable hairstyles with descriptions and placeholder image URLs from picsum.photos (e.g., https://picsum.photos/seed/{faceShape}_{style}/400/300).
    
    Return the data in a structured JSON format matching the SkinAnalysis interface.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skinType: { type: Type.STRING },
          concerns: { type: Type.ARRAY, items: { type: Type.STRING } },
          infections: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
          analysis: {
            type: Type.OBJECT,
            properties: {
              color: { type: Type.STRING },
              symmetry: { type: Type.STRING },
              texture: { type: Type.STRING },
              pimples_acne: { type: Type.STRING },
              allergies: { type: Type.STRING },
            },
            required: ["color", "symmetry", "texture", "pimples_acne", "allergies"],
          },
          recommendations: {
            type: Type.OBJECT,
            properties: {
              treatment: { type: Type.STRING },
              dos: { type: Type.ARRAY, items: { type: Type.STRING } },
              donts: { type: Type.ARRAY, items: { type: Type.STRING } },
              medications: { type: Type.ARRAY, items: { type: Type.STRING } },
              products: { type: Type.ARRAY, items: { type: Type.STRING } },
              brandedProducts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    brand: { type: Type.STRING },
                    name: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                  },
                  required: ["brand", "name", "purpose"],
                },
              },
              naturalAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
              dietaryChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
              routine: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["treatment", "dos", "donts", "medications", "products", "brandedProducts", "naturalAlternatives", "dietaryChanges", "routine"],
          },
          isSerious: { type: Type.BOOLEAN },
          facialAnalysis: {
            type: Type.OBJECT,
            properties: {
              symmetryPercentage: { type: Type.NUMBER },
              symmetryAnalysis: { type: Type.STRING },
              correctionMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
              facialExercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    instructions: { type: Type.STRING },
                  },
                  required: ["name", "instructions"],
                },
              },
              faceFatPercentage: { type: Type.NUMBER },
              fatReductionTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              faceShape: { type: Type.STRING },
              hairstyles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    imageUrl: { type: Type.STRING },
                  },
                  required: ["name", "description", "imageUrl"],
                },
              },
            },
            required: ["symmetryPercentage", "symmetryAnalysis", "correctionMethods", "facialExercises", "faceFatPercentage", "fatReductionTips", "faceShape", "hairstyles"],
          },
        },
        required: ["skinType", "concerns", "severity", "analysis", "recommendations", "isSerious", "facialAnalysis"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function findNearbyDoctors(lat: number, lng: number) {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: "Find top-rated dermatologists and skin clinics near my location.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng,
          },
        },
      },
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  return groundingChunks || [];
}

export async function generateImage(prompt: string, base64ReferenceImage?: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1"): Promise<string> {
  const model = "gemini-2.5-flash-image";
  
  const parts: any[] = [{ text: prompt }];
  
  if (base64ReferenceImage) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ReferenceImage.split(",")[1] || base64ReferenceImage,
      },
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts }],
    config: {
      imageConfig: {
        aspectRatio,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64Data = part.inlineData.data;
      return `data:image/png;base64,${base64Data}`;
    }
  }
  
  throw new Error("No image generated");
}
