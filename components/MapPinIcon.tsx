// Map pin for the Google Maps (Google Business Profile) link. A generic pin, not Google's logo.
export default function MapPinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C7.31 0 3.5 3.73 3.5 8.33 3.5 14.58 12 24 12 24s8.5-9.42 8.5-15.67C20.5 3.73 16.69 0 12 0Zm0 11.75a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    </svg>
  );
}
