export interface FacialAnalysis {
  symmetryPercentage: number;
  symmetryAnalysis: string;
  correctionMethods: string[];
  facialExercises: { name: string; instructions: string }[];
  faceFatPercentage: number;
  fatReductionTips: string[];
  faceShape: string;
  hairstyles: { name: string; description: string; imageUrl: string }[];
}

export interface SkinAnalysis {
  skinType: string;
  concerns: string[];
  infections?: string;
  severity: 'low' | 'medium' | 'high';
  analysis: {
    color: string;
    symmetry: string;
    texture: string;
    pimples_acne: string;
    allergies: string;
  };
  recommendations: {
    treatment: string;
    dos: string[];
    donts: string[];
    medications: string[];
    products: string[];
    brandedProducts: { brand: string; name: string; purpose: string }[];
    naturalAlternatives: string[];
    dietaryChanges: string[];
    routine: string[];
  };
  isSerious: boolean;
  facialAnalysis?: FacialAnalysis;
}

export interface Doctor {
  name: string;
  address: string;
  rating?: number;
  url?: string;
}
