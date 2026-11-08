export const SALON_NAME = 'Blossom Family Salon';
export const SALON_PHONE = '+91 96380 55173';
export const SALON_TEL = 'tel:+919638055173';
export const SALON_ADDRESS = '2nd Floor, Karunanidhan Complex, above Fitness 5 Gym, Kotecha Circle, near University Road, Jala Ram Nagar, Rajkot';
export const SALON_MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Karunanidhan Complex Fitness 5 Gym Kotecha Circle Rajkot')}`;

export function whatsappEnquiry(message = 'Hello Blossom Family Salon, I would like to enquire about an appointment. Please let me know your availability.') {
  return `https://wa.me/919638055173?text=${encodeURIComponent(message)}`;
}
