'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
// Locale-aware router (D-2.01). Used ONLY for router.refresh() at T-0 — no user-facing routing
// bypasses the localised helpers.
import {useRouter} from '@/i18n/navigation';
import {Countdown} from '@/components/drop/Countdown';
import type {DropState} from '@/types/drop';

// The T-0 handover, and nothing else (D-2.25-8).
//
// This module exists so that HomeExperience can be a SERVER component. Before, one `useState`, one
// `useEffect` and one `router.refresh()` — all three of which only exist to survive the moment the
// countdown reaches zero — made the whole Home hero client code: the photograph, the scrim, the
// tagline, both CTAs, all three drop banners and the entire live-drop product grid. Everything
// visual now renders on the server and is handed to these three components as `children` / slots,
// so it stays server-rendered even inside the countdown branch.
//
// The server is still the only authority on drop state (D-1.04-9, CLAUDE.md). Nothing here decides
// that a drop is open: at T-0 it flips to a local "opening" flag and ASKS the server again, on an
// interval, until the server itself reports live or ended. `state` comes in as a prop, straight from
// the server-computed view.

interface OpeningValue {
  opening: boolean;
  open: () => void;
}

// Default is the resting state: no opening, and `open` a no-op. A slot rendered outside the provider
// therefore shows its idle content rather than throwing — the failure mode is "the T-0 swap does not
// happen", never a crash on the front door.
const OpeningContext = createContext<OpeningValue>({opening: false, open: () => {}});

/**
 * Holds the T-0 flag for one Home hero and keeps asking the server while it is set.
 *
 * `children` is server-rendered content passed down from HomeExperience — putting it here does not
 * pull it into the client bundle.
 */
export function CountdownOpening({
  state,
  children,
}: {
  state: DropState;
  children: ReactNode;
}) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);

  const open = useCallback(() => setOpening(true), []);

  // While opening and the server still says "countdown" (clock skew, or it opens exactly at T-0),
  // keep asking. Stops as soon as the server flips the drop to live or ended.
  useEffect(() => {
    if (!opening || state !== 'countdown') return;
    const id = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(id);
  }, [opening, state, router]);

  const value = useMemo(() => ({opening, open}), [opening, open]);

  return <OpeningContext.Provider value={value}>{children}</OpeningContext.Provider>;
}

/**
 * The countdown itself, wired to the flag. The only reason this is a separate component from the
 * provider is position: it renders inside `<Hero>`, while the provider has to wrap the about link
 * that sits outside it.
 */
export function CountdownTicker({
  target,
  serverNowMs,
}: {
  target: number;
  serverNowMs: number;
}) {
  const {open} = useContext(OpeningContext);
  const router = useRouter();
  return (
    <Countdown
      target={target}
      serverNowMs={serverNowMs}
      onComplete={() => {
        open();
        router.refresh();
      }}
    />
  );
}

/**
 * Shows `idle` until T-0 and `opening` after it. Both slots are server-rendered nodes handed in from
 * the parent, so the tagline, the CTAs and the about link never become client code.
 */
export function OpeningSwitch({
  idle,
  opening,
}: {
  idle?: ReactNode;
  opening?: ReactNode;
}) {
  const state = useContext(OpeningContext);
  return <>{state.opening ? (opening ?? null) : (idle ?? null)}</>;
}
