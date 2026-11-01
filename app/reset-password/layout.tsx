// Account pages are kept out of search results, so their metadata lives here.
export const metadata = {
  title: "Reset password | Compounding Wins",
  robots: { index: false, follow: true },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
