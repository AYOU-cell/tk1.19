import { useEffect, useState } from 'react';

const ROUTING_URL = 'https://offer-b3.ezecomclass.com/api/wa?site=tk1-19';
const FALLBACK_URL = 'https://wa.me/85255945272';

let pending: Promise<string> | null = null;

function loadUrl(): Promise<string> {
  if (!pending) {
    pending = fetch(ROUTING_URL, { cache: 'no-store' })
      .then((res) => res.json() as Promise<{ url?: unknown }>)
      .then((data) => (typeof data.url === 'string' ? data.url : FALLBACK_URL))
      .catch(() => FALLBACK_URL);
  }
  return pending;
}

export function useWhatsAppUrl(): string {
  const [url, setUrl] = useState(FALLBACK_URL);
  useEffect(() => {
    let active = true;
    loadUrl().then((next) => {
      if (active) setUrl(next);
    });
    return () => {
      active = false;
    };
  }, []);
  return url;
}
