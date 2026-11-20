import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import CustomerSignupKit from "@/components/tools/customer-signup-kit/CustomerSignupKit";

export const metadata = {
  title: "Free birthday club & customer sign-up kit for restaurants | Compounding Wins",
  description:
    "Set up a GDPR-friendly birthday and anniversary sign-up with Google Forms, print QR table cards, and see who to contact this month. Free, your customer data stays yours.",
  alternates: { canonical: "/tools/customer-signup-kit" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="customer-signup-kit"
      title={<>Birthday club <em>sign-up kit</em></>}
      intro={<>Collect customers&apos; birthdays, anniversaries and contact details with consent, using a free Google Form you own, then see who to contact each month.</>}
      privacyNote="Your customers' details stay in your own Google account. Files you drop in here are read in your browser and never uploaded."
      steps={[
        { title: "Choose your offer", body: "A free dessert, a drink or a discount on their birthday gives people a reason to sign up." },
        { title: "Make the form", body: "Copy the description, questions and consent wording into a free Google Form, and link it to a Google Sheet." },
        { title: "Print the QR cards", body: "Put them on tables, receipts, the bill folder and your Wi-Fi landing page." },
        { title: "Check upcoming dates", body: "Each month, download the sheet as a CSV and drop it in to see whose birthday or anniversary is coming up, then contact them yourself." },
      ]}
      faqs={[
        faq("Is a birthday club allowed under GDPR?", "Yes, with clear consent. The tick box must be unticked by default, say who will contact them and how, and make it easy to unsubscribe. You also need a privacy notice explaining what you keep and why."),
        faq("Why use Google Forms instead of a sign-up tool?", "It's free, and the data sits in your own Google account, so you own your customer list and aren't tied to any provider."),
        faq("Do you see my customers' details?", "No. The form and sheet are in your Google account. When you check upcoming dates here, the file is read in your browser and never sent to us."),
        faq("When should I send the birthday message?", "About a week before, so there's time to book a table. Anniversaries work the same way."),
      ]}
    >
      <CustomerSignupKit />
    </ToolLayout>
  );
}
