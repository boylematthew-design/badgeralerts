// Account pages are kept out of search results, so their metadata lives here.
export const metadata = {
  title: "Sign up | Compounding Wins",
  robots: { index: false, follow: true },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
