import Image from "next/image";

export default function AuthorByline() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/matthew-boyle.png"
        alt="Matthew Boyle"
        width={36}
        height={36}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
      <span className="text-[14px] text-mid font-light">Matthew Boyle</span>
    </div>
  );
}
