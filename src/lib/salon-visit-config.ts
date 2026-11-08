import { SALON_ADDRESS, SALON_MAPS, SALON_NAME, SALON_PHONE } from './salon-contact';

export type VisitLandmarkId =
  | 'salon-flagship'
  | 'kotecha-circle'
  | 'university-road'
  | 'race-course';

export type MapStyleMode = 'road' | 'satellite' | 'dark-atelier';

export interface VisitLandmark {
  id: VisitLandmarkId;
  indexLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  travelTime: string;
  description: string;
  coordinates: [number, number]; // [lng, lat]
  zoom: number;
  googleMapsQuery: string;
  isPrimarySalon?: boolean;
}

export const SALON_COORDINATES: [number, number] = [70.7766, 22.2916];

export const VISIT_LANDMARKS: VisitLandmark[] = [
  {
    id: 'salon-flagship',
    indexLabel: '01',
    title: 'Blossom Family Salon',
    subtitle: '2nd Floor · Karunanidhan Complex',
    badge: 'Flagship Studio',
    travelTime: 'Destination · Above Fitness 5 Gym',
    description:
      'Located on the 2nd Floor of Karunanidhan Complex, directly above Fitness 5 Gym at Kotecha Circle, Jala Ram Nagar, Rajkot 360007.',
    coordinates: [70.7766, 22.2916],
    zoom: 17,
    googleMapsQuery: 'Fitness 5 gym, Kotecha Cir, Jala Ram Nagar, Rajkot, Gujarat 360007',
    isPrimarySalon: true,
  },
  {
    id: 'kotecha-circle',
    indexLabel: '02',
    title: 'Kotecha Circle Junction',
    subtitle: 'Kalawad Road · Primary Landmark',
    badge: '45 m away',
    travelTime: '1 min walk from circle',
    description:
      'Main Kotecha Chowk roundabout connecting Kalawad Road and University Road — spot Karunanidhan Complex right at the circle.',
    coordinates: [70.7761, 22.2913],
    zoom: 17,
    googleMapsQuery: 'Kotecha Chowk, Kotecha Circle, Rajkot, Gujarat 360007',
  },
  {
    id: 'university-road',
    indexLabel: '03',
    title: 'University Road Approach',
    subtitle: 'Jala Ram Nagar Corridor',
    badge: '300 m away',
    travelTime: '2 min drive East',
    description:
      'Direct approach from Saurashtra University Road heading toward Kotecha Circle with convenient two-wheeler and car access.',
    coordinates: [70.7738, 22.2902],
    zoom: 16,
    googleMapsQuery: 'University Road, Kotecha Circle, Rajkot, Gujarat 360007',
  },
  {
    id: 'race-course',
    indexLabel: '04',
    title: 'Race Course Ring Road',
    subtitle: 'Central Rajkot Connection',
    badge: '1.4 km away',
    travelTime: '5 min drive via Kalawad Rd',
    description:
      'Straight west-bound drive along Kalawad Road from Race Course Ring Road directly to Kotecha Circle.',
    coordinates: [70.7885, 22.2968],
    zoom: 15,
    googleMapsQuery: 'Race Course Ring Road, Rajkot, Gujarat',
  },
];

export const STUDIO_VISIT_FACTS = [
  {
    label: 'Floor & Building',
    value: '2nd Floor, Karunanidhan Complex',
    detail: 'Directly above Fitness 5 Gym',
  },
  {
    label: 'Studio Hours',
    value: '10:00 AM – 09:00 PM',
    detail: 'Open daily · Monday to Sunday',
  },
  {
    label: 'Direct Desk',
    value: SALON_PHONE,
    detail: 'Walk-ins & prior reservations',
  },
] as const;

export function getVisitLandmark(id: VisitLandmarkId): VisitLandmark {
  const found = VISIT_LANDMARKS.find((item) => item.id === id);
  return found ?? VISIT_LANDMARKS[0];
}

export function getNextVisitLandmark(currentId: VisitLandmarkId, direction: 1 | -1 = 1): VisitLandmark {
  const currentIndex = VISIT_LANDMARKS.findIndex((item) => item.id === currentId);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const nextIndex = (safeIndex + direction + VISIT_LANDMARKS.length) % VISIT_LANDMARKS.length;
  return VISIT_LANDMARKS[nextIndex];
}

export function clampMapZoom(zoom: number): number {
  return Math.max(13, Math.min(19, Math.round(zoom)));
}

export function buildGoogleMapsEmbedUrl(
  landmark: VisitLandmark,
  mode: MapStyleMode = 'road',
  zoomOverride?: number
): string {
  const query = encodeURIComponent(landmark.googleMapsQuery);
  const zoom = clampMapZoom(zoomOverride ?? landmark.zoom);
  const mapType = mode === 'satellite' ? 'h' : 'm';
  return `https://maps.google.com/maps?q=${query}&t=${mapType}&z=${zoom}&output=embed&iwloc=near`;
}

export function formatCoordinatesLabel(coords: [number, number]): string {
  const [lng, lat] = coords;
  return `${lat.toFixed(4)}° N · ${lng.toFixed(4)}° E`;
}

export function getSalonSummaryCard() {
  return {
    name: SALON_NAME,
    address: SALON_ADDRESS,
    phone: SALON_PHONE,
    mapsUrl: SALON_MAPS,
    pincode: '360007',
  };
}
