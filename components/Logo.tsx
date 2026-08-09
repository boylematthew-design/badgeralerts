export default function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex-shrink-0 rounded-[9px] bg-ink flex items-center justify-center text-white font-semibold tracking-[-0.02em]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      MB
    </div>
  );
}
