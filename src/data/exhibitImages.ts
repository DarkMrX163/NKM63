// Direct Vite asset imports for 100% reliable bundling and rendering across all environments
import windmillImg from '../assets/exhibits/windmill.jpg';
import ironImg from '../assets/exhibits/iron.jpg';
import oilpumpImg from '../assets/exhibits/oilpump.jpg';
import iconImg from '../assets/exhibits/icon.jpg';
import samovarImg from '../assets/exhibits/samovar.jpg';
import spinningWheelImg from '../assets/exhibits/spinning_wheel.jpg';
import arrowheadImg from '../assets/exhibits/arrowhead.jpg';
import ammoniteImg from '../assets/exhibits/ammonite.jpg';
import potteryImg from '../assets/exhibits/pottery.jpg';
import lampImg from '../assets/exhibits/lamp.jpg';

export const EXHIBIT_IMAGES: Record<string, string> = {
  windmill: windmillImg,
  iron: ironImg,
  oilpump: oilpumpImg,
  icon: iconImg,
  samovar: samovarImg,
  spinning_wheel: spinningWheelImg,
  arrowhead: arrowheadImg,
  ammonite: ammoniteImg,
  pottery: potteryImg,
  lamp: lampImg,
};

// Fallback public URLs if needed
export const getExhibitImageUrl = (type: string, directUrl?: string): string => {
  if (EXHIBIT_IMAGES[type]) {
    return EXHIBIT_IMAGES[type];
  }
  if (directUrl) {
    return directUrl;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}images/exhibits/${type}.jpg`;
};
