// ============================================
// src/utils/mapaUtils.ts
// ============================================

/**
 * Abre o Google Maps com a localização
 */
export const abrirGoogleMaps = (latitude: number, longitude: number): void => {
  if (!latitude || !longitude) return;
  
  const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  window.open(url, '_blank');
};

/**
 * Abre o Google Earth com a localização
 */
export const abrirGoogleEarth = (latitude: number, longitude: number): void => {
  if (!latitude || !longitude) return;
  
  const url = `https://earth.google.com/web/@${latitude},${longitude},0a,222.51700277d,35y,0h,45t,0r`;
  window.open(url, '_blank');
};

/**
 * Verifica se as coordenadas são válidas
 */
export const temCoordenadas = (latitude?: number | null, longitude?: number | null): boolean => {
  return !!latitude && !!longitude && latitude !== 0 && longitude !== 0;
};

/**
 * Formata coordenadas para exibição
 */
export const formatarCoordenadas = (latitude?: number | null, longitude?: number | null): string => {
  if (!latitude || !longitude) return 'Não informado';
  
  // ✅ CONVERTER PARA NÚMERO ANTES DE USAR toFixed
  const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lng = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  
  if (isNaN(lat) || isNaN(lng)) return 'Coordenadas inválidas';
  
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};