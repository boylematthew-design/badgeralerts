// Account pages are kept out of search results, so their metadata lives here.
export const metadata = {
  title: "Log in | Compounding Wins",
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
