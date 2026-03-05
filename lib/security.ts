// Utilitarios de seguranca para sanitizacao e validacao

/**
 * Remove caracteres potencialmente perigosos de strings
 */
export function sanitizeString(input: string | undefined | null, maxLength: number = 500): string {
  if (!input) return '';

  return input
    .toString()
    .trim()
    // Remove tags HTML/script
    .replace(/<[^>]*>/g, '')
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Limita o tamanho
    .substring(0, maxLength);
}

/**
 * Sanitiza um objeto inteiro recursivamente
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T, maxLength: number = 500): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value, maxLength);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>, maxLength);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Valida formato de telefone brasileiro
 */
export function isValidBrazilianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Aceita 10 ou 11 digitos (com ou sem 9 no inicio)
  return cleaned.length >= 10 && cleaned.length <= 11;
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  if (!email) return true; // Email e opcional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se uma string nao esta vazia apos sanitizacao
 */
export function isNotEmpty(value: string | undefined | null, minLength: number = 1): boolean {
  if (!value) return false;
  return sanitizeString(value).length >= minLength;
}

/**
 * Rate limiter simples em memoria (para protecao basica)
 * Em producao, use Redis ou similar
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minuto
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Limpa entradas antigas periodicamente
  if (rateLimitMap.size > 10000) {
    const entries = Array.from(rateLimitMap.entries());
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // Nova janela de tempo
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetIn: record.resetTime - now
  };
}

/**
 * Obtem o IP do cliente de forma segura
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Valida se os dados do formulario de musica estao corretos
 */
export function validateMusicFormData(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isNotEmpty(data.honoreeName as string, 2)) {
    errors.push('Nome do homenageado e obrigatorio');
  }

  if (!data.relationship) {
    errors.push('Relacionamento e obrigatorio');
  }

  if (!data.occasion) {
    errors.push('Ocasiao e obrigatoria');
  }

  if (!data.musicStyle) {
    errors.push('Estilo musical e obrigatorio');
  }

  if (!isNotEmpty(data.userName as string)) {
    errors.push('Seu nome e obrigatorio');
  }

  if (!isValidEmail(data.email as string || '')) {
    errors.push('Email invalido');
  }

  return { valid: errors.length === 0, errors };
}
