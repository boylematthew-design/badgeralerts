import Image from "next/image";

export default function AuthorByline() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/matthew-boyle.png"
        alt="Matthew Boyle"
        width={24}
        height={24}
        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
      />
      <span className="text-[13px] text-mid font-light">Matthew Boyle</span>
    </div>
  );
}
