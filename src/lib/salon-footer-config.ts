import { SALON_ADDRESS, SALON_MAPS, SALON_PHONE, whatsappEnquiry } from './salon-contact';

export interface FooterLinkItem { label: string; href: string }
export interface FooterColumn { id: string; title: string; links: FooterLinkItem[] }
export interface SalonBranch { id: string; name: string; area: string; city: string; address: string; phone: string }

export const SALON_BRANCHES: SalonBranch[] = [{
  id: 'rajkot-kotecha',
  name: 'Blossom Family Salon — Kotecha Circle',
  area: 'Kotecha Circle',
  city: 'Rajkot',
  address: SALON_ADDRESS,
  phone: SALON_PHONE,
}];

export const FOOTER_COLUMNS: FooterColumn[] = [
  { id: 'explore', title: 'Explore', links: [{ label: 'Home', href: '#home' }, { label: 'Services', href: '#our-services' }, { label: 'About', href: '#about' }] },
  { id: 'connect', title: 'Connect', links: [{ label: 'WhatsApp', href: whatsappEnquiry() }, { label: 'Directions', href: SALON_MAPS }] },
];

export function getBranchById(branchId: string): SalonBranch {
  return SALON_BRANCHES.find(branch => branch.id === branchId) ?? SALON_BRANCHES[0];
}
