'use client';

import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';

// Real Cloudflare Turnstile widget in EXECUTE mode: it mints a token only when execute() is called, at
// SUBMIT time — never at page load (D-1.04-8). A customer who opens checkout at 19:50 for a 20:00 drop
// and submits at 20:01 must not be holding an 11-minute-old (expired, single-use) token. The parent
// (CheckoutForm) calls execute() on submit and awaits a fresh token; on error/expiry it can retry.

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
  remove: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('turnstile-script-failed'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export interface TurnstileHandle {
  /** Mint a fresh token (single-use, ≤300s). Rejects on error/expiry so the caller can re-challenge. */
  execute: () => Promise<string>;
  reset: () => void;
}

export const Turnstile = forwardRef<TurnstileHandle, {siteKey: string; className?: string}>(
  function Turnstile({siteKey, className}, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const pending = useRef<{resolve: (t: string) => void; reject: (e: Error) => void} | null>(null);

    useEffect(() => {
      let cancelled = false;
      loadTurnstileScript()
        .then(() => {
          if (cancelled || !containerRef.current || !window.turnstile) return;
          widgetId.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            execution: 'execute', // do NOT run at render — only on execute() at submit
            appearance: 'interaction-only',
            callback: (token: string) => {
              pending.current?.resolve(token);
              pending.current = null;
            },
            'error-callback': () => {
              pending.current?.reject(new Error('turnstile-error'));
              pending.current = null;
            },
            'expired-callback': () => {
              pending.current?.reject(new Error('turnstile-expired'));
              pending.current = null;
            },
          });
        })
        .catch(() => {
          /* left un-rendered; execute() will reject and the form re-challenges */
        });
      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetId.current);
          } catch {
            /* ignore */
          }
        }
        widgetId.current = null;
      };
    }, [siteKey]);

    useImperativeHandle(
      ref,
      () => ({
        execute: () =>
          new Promise<string>((resolve, reject) => {
            if (!widgetId.current || !window.turnstile) {
              reject(new Error('turnstile-not-ready'));
              return;
            }
            pending.current = {resolve, reject};
            try {
              window.turnstile.reset(widgetId.current); // guarantee a fresh, unused token
              window.turnstile.execute(widgetId.current);
            } catch (e) {
              pending.current = null;
              reject(e instanceof Error ? e : new Error('turnstile-execute-failed'));
            }
          }),
        reset: () => {
          if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
        },
      }),
      [],
    );

    return <div ref={containerRef} className={className} aria-hidden />;
  },
);
