import blocks from "../../../../content/blocks.en.json";
import faqFile from "../../../../content/faq.json";

type FaqItem = { id: string; question: string; source_ids: string[] };

const faq = faqFile as FaqItem[];

export function mockWebsiteAssistant(message: string): {
  text: string;
  sources: { title: string; url: string; excerpt: string }[];
  route: "grounded" | "declined" | "fallback";
} {
  const lower = message.toLowerCase();
  if (!/\b(rafeeq|genetic|carrier|screening|counsell|counsel|privacy|consent|inherit|partner|sharing|faq|risk)\b/i.test(lower)) {
    return {
      text: "I can only help with questions about Rafeeq and the information on this website.",
      sources: [],
      route: "declined",
    };
  }

  const match = faq.find((item) => item.question.toLowerCase().includes(lower.slice(0, 24)));
  const item = match ?? faq.find((faqEntry) => lower.includes("carrier") || faqEntry.id.includes("carrier"));
  if (item) {
    const blockId = item.source_ids[0];
    const block = blocks[blockId as keyof typeof blocks];
    if (block && typeof block === "object" && "text" in block) {
      return {
        text: String(block.text),
        sources: [
          {
            title: item.question,
            url: "https://rafeeq-health.vercel.app/faq",
            excerpt: String(block.text).slice(0, 180),
          },
        ],
        route: "grounded",
      };
    }
  }

  return {
    text: "I do not have a specific entry for that in the demo knowledge base. Browse the FAQ or contact page for more.",
    sources: [],
    route: "fallback",
  };
}
