import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  text: z.string().min(1).max(5000),
  source: z.string(),
  target: z.string(),
});

export const translateText = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const { text, source, target } = data;
    // MyMemory free translation API — no key required.
    const langPair = `${source}|${target}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text,
    )}&langpair=${encodeURIComponent(langPair)}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Translation service is unavailable");
    const json = (await res.json()) as {
      responseStatus: number;
      responseData?: { translatedText?: string };
      matches?: Array<{ translation?: string }>;
    };

    const translated =
      json.responseData?.translatedText ??
      json.matches?.find((m) => m.translation)?.translation;
    if (!translated) throw new Error("No translation returned");

    // MyMemory HTML-escapes some characters.
    const decoded = translated
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    return { translatedText: decoded };
  });
