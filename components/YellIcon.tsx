// Yell's "walking fingers" mark, simplified to one colour (currentColor) so it matches the
// YouTube, LinkedIn and X icons: a hand coming down from the top, two fingers walking, and the
// line they walk along. Traced from Yell's own favicon.
export default function YellIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.8 0h5.3c.1 2.5 1.3 4.3 3.7 5.4 1.1.5 1.6 1.7 1.1 2.8-.5 1.1-1.8 1.5-2.9 1C10.2 7.6 7.4 4.6 6.8 0Z" />
      <path
        d="M11.4 9 5.1 17.6M11.4 9l5.7 7.7c.4.6 1 .9 1.9 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="4.4" y="19.2" width="15.2" height="2" rx="1" />
    </svg>
  );
}
