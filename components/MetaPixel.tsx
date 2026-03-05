'use client';

// Meta Pixel event helpers
// Usa o fbq global que ja esta carregado no layout

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

function track(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, data);
  }
}

export function trackViewContent(contentName: string, value?: number) {
  track('ViewContent', {
    content_name: contentName,
    content_category: 'musica_personalizada',
    ...(value ? { value, currency: 'BRL' } : {}),
  });
}

export function trackAddToCart(planId: string, value: number) {
  track('AddToCart', {
    content_name: planId,
    content_type: 'product',
    value,
    currency: 'BRL',
  });
}

export function trackInitiateCheckout(value: number, planId: string) {
  track('InitiateCheckout', {
    value,
    currency: 'BRL',
    content_name: planId,
    num_items: 1,
  });
}

export function trackAddPaymentInfo(paymentMethod: string) {
  track('AddPaymentInfo', {
    content_category: paymentMethod,
  });
}

export function trackPurchase(orderId: string, value: number, planId: string) {
  track('Purchase', {
    value,
    currency: 'BRL',
    content_name: planId,
    content_type: 'product',
    order_id: orderId,
  });
}

export function trackLead(planId: string) {
  track('Lead', {
    content_name: planId,
    content_category: 'formulario_musica',
  });
}
