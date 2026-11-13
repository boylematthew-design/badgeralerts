// Yell logo mark, simplified to one colour (currentColor) so it matches the YouTube and LinkedIn icons:
// a speech bubble with a "y" cut out of it.
export default function YellIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <mask id="yell-y-cutout">
          <rect width="24" height="24" fill="white" />
          <path
            d="M8.5 7.5 12 13.5M15.5 7.5 10.5 17"
            stroke="black"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </mask>
      </defs>
      <path
        fill="currentColor"
        mask="url(#yell-y-cutout)"
        d="M12 1.5C6.2 1.5 1.5 5.6 1.5 10.75c0 2.9 1.5 5.5 3.85 7.2L4.5 22.5l4.6-2.6c.93.23 1.9.35 2.9.35 5.8 0 10.5-4.1 10.5-9.5S17.8 1.5 12 1.5Z"
      />
    </svg>
  );
}
