import Image from "next/image";
import Link from "next/link";

// Links through to the author's profile page so readers (and Google) can see who wrote the guide.
// variant="dark" when it sits on an Ink background.
export default function AuthorByline({ variant = "light" }: { variant?: "light" | "dark" }) {
  const text =
    variant === "dark" ? "text-paper group-hover:text-lime" : "text-mid group-hover:text-accent-dark";
  return (
    <Link href="/author/matthew-boyle" rel="author" className="group flex items-center gap-2">
      <Image
        src="/matthew-boyle.png"
        alt="Matthew Boyle"
        width={36}
        height={36}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
      <span className={`text-[14px] ${text} underline-offset-2 group-hover:underline transition-colors`}>
        Matthew Boyle
      </span>
    </Link>
  );
}
