import { useEffect, useState } from 'react';

const ROUTING_URL = 'https://offer-b3.ezecomclass.com/api/wa?site=tk1-19';

let pending: Promise<string | null> | null = null;

function loadPhone(): Promise<string | null> {
  if (!pending) {
    pending = fetch(ROUTING_URL, { cache: 'no-store' })
      .then((res) => res.json() as Promise<{ phone?: unknown }>)
      .then((data) => (typeof data.phone === 'string' ? data.phone : null))
      .catch(() => null);
  }
  return pending;
}

export function useWhatsAppLink(fallbackPhone: string): { url: string; phone: string } {
  const [phone, setPhone] = useState(fallbackPhone);
  useEffect(() => {
    let active = true;
    loadPhone().then((next) => {
      if (active && next) setPhone(next);
    });
    return () => {
      active = false;
    };
  }, []);
  return { url: `https://wa.me/${phone}`, phone };
}

export function formatPhone(phone: string): string {
  if (phone.startsWith('852') && phone.length === 11) return `+852 ${phone.slice(3, 7)} ${phone.slice(7)}`;
  if (phone.startsWith('1') && phone.length === 11) return `+1 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`;
  return `+${phone}`;
}
