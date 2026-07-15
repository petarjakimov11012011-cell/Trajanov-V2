import {HomeExperience} from '@/components/home/HomeExperience';

// Home — the countdown is the loudest object; switches to the LIVE drop grid
// when the timer hits zero. Real drop state is server-computed in 1.04; this
// pass drives it client-side with a preview switcher (see the handover).
export default function HomePage() {
  return <HomeExperience />;
}
