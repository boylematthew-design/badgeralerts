// Account pages are kept out of search results, so their metadata lives here.
export const metadata = {
  title: "Forgot password | Compounding Wins",
  robots: { index: false, follow: true },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
