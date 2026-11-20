import ToolLayout, { faq } from "@/components/tools/ToolLayout";
import QuestionFinder from "@/components/tools/question-finder/QuestionFinder";

export const metadata = {
  title: "Free question & keyword finder (Google and YouTube UK) | Compounding Wins",
  description:
    "Type a problem or product and find the questions and long, specific searches people type into Google and YouTube in the UK. Free alternative to paid keyword and fan-out tools.",
  alternates: { canonical: "/tools/question-finder" },
};

export default function Page() {
  return (
    <ToolLayout
      slug="question-finder"
      wide
      title={<>Question &amp; topic <em>finder</em></>}
      intro={<>Type a problem or product and see the questions and long, specific searches people actually type into Google and YouTube in the UK, grouped and ready to export.</>}
      privacyNote={null}
      steps={[
        { title: "Type what your customers need", body: "A problem ('boiler losing pressure'), a product ('oval engagement ring') or a service ('end of tenancy clean')." },
        { title: "Pick Google or YouTube", body: "YouTube searches are often more 'how to' and comparison-led, which makes them good video and guide ideas." },
        { title: "Use the questions", body: "Answer the best questions on your service pages and FAQs, and turn the long, specific searches into guides, videos and product page sections." },
        { title: "Check demand", body: "Autocomplete shows what people type, not how many. Check the promising ones in Search Console or Keyword Planner." },
      ]}
      faqs={[
        faq("Where do the questions come from?", "Google's autocomplete suggestions for the UK, the same ones you see as you type in the search box. Each search expands your topic with question words and common endings to find more."),
        faq("Why do long, specific searches matter?", "They're easier to rank for, the person knows exactly what they want, and AI tools break broad questions into specific ones like these when they research an answer."),
        faq("Does it show search volume?", "No. Google doesn't share volumes through autocomplete. Use Google Search Console, which is free, or Google Ads Keyword Planner to check how often they're searched."),
        faq("Why did I get no results?", "Google sometimes limits how often its autocomplete can be used. Wait a few minutes and try again, or try a shorter topic."),
      ]}
    >
      <QuestionFinder />
    </ToolLayout>
  );
}
