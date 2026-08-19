// ============================================
// src/utils/coordenadasUtils.ts
// ============================================

/**
 * Verifica se a string é uma coordenada válida no formato decimal
 * Ex: -23.550520, -46.633308
 * 
 * ⚠️ IMPORTANTE: Se tiver ° (graus), NÃO é decimal
 */
export const isCoordenadaDecimal = (valor: string): boolean => {
  if (!valor || valor.trim() === '') return true;
  
  const v = valor.trim();
  
  // ✅ SE TIVER ° (GRAUS), NÃO É DECIMAL
  if (v.includes('°')) return false;
  
  const num = parseFloat(v);
  return !isNaN(num) && isFinite(num);
};

/**
 * Verifica se a coordenada está dentro dos limites válidos
 * Latitude: -90 a 90
 * Longitude: -180 a 180
 */
export const isCoordenadaValida = (valor: string, tipo: 'latitude' | 'longitude'): boolean => {
  if (!valor || valor.trim() === '') return true;
  
  const num = parseFloat(valor);
  if (isNaN(num)) return false;
  
  if (tipo === 'latitude') {
    return num >= -90 && num <= 90;
  } else {
    return num >= -180 && num <= 180;
  }
};

/**
 * Tenta converter coordenada no formato graus, minutos, segundos para decimal
 * Ex: "10°48'4.93\"S" → -10.801369
 * Ex: "46°38'0.91\"W" → -46.633586
 * Ex: "40°22'48.26\"O" → -40.380072
 */
export const converterGrausParaDecimal = (valor: string): number | null => {
  if (!valor || valor.trim() === '') return null;
  
  let v = valor.trim();
  
  // Substituir "O" por "W" (Oeste = West)
  v = v.replace(/O$/i, 'W');
  
  // Expressão regular para capturar graus, minutos, segundos e direção
  // Ex: 10°48'4.93"S ou 10°48'4.93" S
  const regex = /^(\d+)°(\d+)'([\d.]+)"?\s*([NSEW])$/i;
  const match = v.match(regex);
  
  if (!match) {
    return null;
  }
  
  const graus = parseInt(match[1]);
  const minutos = parseInt(match[2]);
  const segundos = parseFloat(match[3]);
  const direcao = match[4].toUpperCase();
  
  
  let decimal = graus + (minutos / 60) + (segundos / 3600);
  
  if (direcao === 'S' || direcao === 'W') {
    decimal = -decimal;
  }
    
  return decimal;
};

/**
 * Mensagem de erro amigável para coordenadas
 */
export const getMensagemErroCoordenada = (tipo: 'latitude' | 'longitude'): string => {
  const nome = tipo === 'latitude' ? 'Latitude' : 'Longitude';
  const limite = tipo === 'latitude' ? '-90 a 90' : '-180 a 180';
  
  return `${nome} deve ser um número decimal (ex: -23.550520) ou no formato graus (ex: 10°48'4.93"S). 
Valores válidos: ${limite}.`;
};