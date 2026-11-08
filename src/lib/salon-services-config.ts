export interface UnisexServiceLook {
  index: number;
  numberLabel: string;
  shortTab: string;
  title: string;
  audienceTag: string;
  description: string;
  cropBox: [number, number]; // [x0, x1] aspect ratio box
  accentColor: string;
}

export interface UnisexServiceCardItem {
  id: string;
  serviceIndex: number;
  name: string;
  genderLabel: 'Boys & Men' | 'Girls & Women' | 'Unisex Formula';
  duration: string; // Volume / Net Wt
  price: string;
  cropBox: [number, number, number, number];
}

export const DEPTH_KX = [1.2, 0.744, 0.496, 0.346, 0.235, 0.15, 0.085] as const;
export const DEPTH_KF = [1.14, 0.89, 0.777, 0.704, 0.651, 0.616, 0.59] as const;
export const DEPTH_KH = [1.18, 0.832, 0.574, 0.436, 0.334, 0.258, 0.19] as const;
export const DEPTH_KB = [0, 0, 1.5, 4, 8, 12, 17] as const;
export const DEPTH_KO = [1, 1, 1, 1, 0.86, 0.5, 0] as const;

export const UNISEX_SERVICES: UnisexServiceLook[] = [
  { index: 0, numberLabel: '01', shortTab: 'Hair Care', title: 'Hair care', audienceTag: 'Hair care concept', description: 'Illustrative hair care packaging concept. Ask the salon about the products it uses.', cropBox: [0, 220], accentColor: '#c89d54' },
  { index: 1, numberLabel: '02', shortTab: 'Colour Care', title: 'Colour care', audienceTag: 'Colour care concept', description: 'Illustrative colour care packaging concept. Current products can be confirmed with the salon.', cropBox: [0, 220], accentColor: '#b98179' },
  { index: 2, numberLabel: '03', shortTab: 'Styling', title: 'Styling', audienceTag: 'Styling concept', description: 'Illustrative styling product concept; availability is not confirmed.', cropBox: [0, 220], accentColor: '#7a9a8b' },
  { index: 3, numberLabel: '04', shortTab: 'Skin Care', title: 'Skin care', audienceTag: 'Skin care concept', description: 'Illustrative skin care product concept. Ask the salon for current details.', cropBox: [0, 220], accentColor: '#d4a373' },
  { index: 4, numberLabel: '05', shortTab: 'Wash Care', title: 'Wash care', audienceTag: 'Wash care concept', description: 'Illustrative wash care concept, shown for design demonstration.', cropBox: [0, 220], accentColor: '#9b87d4' },
  { index: 5, numberLabel: '06', shortTab: 'Finishing', title: 'Finishing', audienceTag: 'Finishing concept', description: 'Illustrative finishing product concept; details are to be confirmed.', cropBox: [0, 220], accentColor: '#d98da1' },
  { index: 6, numberLabel: '07', shortTab: 'Grooming', title: 'Grooming', audienceTag: 'Grooming concept', description: 'Illustrative grooming product concept. Contact the salon for its current range.', cropBox: [0, 220], accentColor: '#4ea885' },
  { index: 7, numberLabel: '08', shortTab: 'Scalp Care', title: 'Scalp care', audienceTag: 'Scalp care concept', description: 'Illustrative scalp care concept, not a listing of available products.', cropBox: [0, 220], accentColor: '#c98856' },
];

export const UNISEX_SERVICE_ITEMS: UnisexServiceCardItem[] = [
  { id: 'concept-1-1', serviceIndex: 0, name: 'Hair Care Concept 01', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-1-2', serviceIndex: 0, name: 'Hair Care Concept 02', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-2-1', serviceIndex: 1, name: 'Colour Care Concept 01', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-2-2', serviceIndex: 1, name: 'Colour Care Concept 02', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-3-1', serviceIndex: 2, name: 'Styling Concept 01', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-3-2', serviceIndex: 2, name: 'Styling Concept 02', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-4-1', serviceIndex: 3, name: 'Skin Care Concept 01', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-4-2', serviceIndex: 3, name: 'Skin Care Concept 02', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-5-1', serviceIndex: 4, name: 'Wash Care Concept 01', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-5-2', serviceIndex: 4, name: 'Wash Care Concept 02', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-6-1', serviceIndex: 5, name: 'Finishing Concept 01', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-6-2', serviceIndex: 5, name: 'Finishing Concept 02', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-7-1', serviceIndex: 6, name: 'Grooming Concept 01', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-7-2', serviceIndex: 6, name: 'Grooming Concept 02', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-8-1', serviceIndex: 7, name: 'Scalp Care Concept 01', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
  { id: 'concept-8-2', serviceIndex: 7, name: 'Scalp Care Concept 02', genderLabel: 'Unisex Formula', duration: 'Visual mockup', price: 'Illustrative', cropBox: [0, 240, 0, 220] },
];

export function wrapMod(x: number, n: number): number {
  return ((x % n) + n) % n;
}

export function clampVal(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x));
}

export function computeModelDepth(index: number, p: number, totalModels: number): number {
  let d = wrapMod(index - p, totalModels);
  if (d > totalModels - 1) {
    d -= totalModels;
  }
  return d;
}

export function interpolateDepthTable(d: number, table: readonly number[]): number {
  const k = clampVal(d + 1, 0, 6);
  const a = Math.floor(k);
  const b = Math.min(6, a + 1);
  const t = k - a;
  return table[a] + (table[b] - table[a]) * t;
}

export function computeRailCardOffset(
  cardIndex: number,
  p: number,
  cardSize: number,
  totalCards: number
): number {
  const all = cardSize * totalCards;
  if (all <= 0) return 0;
  let y = wrapMod(cardIndex * cardSize - p * 2 * cardSize, all);
  if (y > all - cardSize) {
    y -= all;
  }
  return y;
}
