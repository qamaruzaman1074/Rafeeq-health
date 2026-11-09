import faqFile from "../../../../../content/faq.json";

type FaqItem = { id: string; question: string };

export function suggestedWebsiteQuestions(): string[] {
  const faq = faqFile as FaqItem[];
  return faq.slice(0, 4).map((item) => item.question);
}
