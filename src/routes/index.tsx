import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  ArrowLeftRight,
  Copy,
  Check,
  Volume2,
  Languages,
  Loader2,
} from "lucide-react";
import { translateText } from "@/lib/translate.functions";
import { LANGUAGES, speechCode } from "@/lib/languages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lingua — Free Language Translator" },
      {
        name: "description",
        content:
          "Translate text between 25+ languages instantly. Free translator with copy and text-to-speech support.",
      },
      { property: "og:title", content: "Lingua — Free Language Translator" },
      {
        property: "og:description",
        content:
          "Translate text between 25+ languages instantly. Free translator with copy and text-to-speech support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TranslatorPage,
});

function speak(text: string, langCode: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechCode(langCode);
  window.speechSynthesis.speak(utterance);
}

function TranslatorPage() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const runTranslate = useServerFn(translateText);

  async function handleTranslate(text = input, from = sourceLang, to = targetLang) {
    if (!text.trim()) {
      setOutput("");
      return;
    }
    setIsTranslating(true);
    setError(null);
    try {
      const result = await runTranslate({
        data: { text, source: from, target: to },
      });
      setOutput(result.translatedText);
    } catch {
      setError("Translation failed. Please try again.");
      setOutput("");
    } finally {
      setIsTranslating(false);
    }
  }

  function handleSwap() {
    const newSource = targetLang;
    const newTarget = sourceLang;
    setSourceLang(newSource);
    setTargetLang(newTarget);
    setInput(output);
    setOutput(input);
    if (output.trim()) void handleTranslate(output, newSource, newTarget);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-10 sm:py-16">
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Languages className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lingua Translator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Translate text between 28 languages — free, instant, no sign-up.
          </p>
        </header>

        {/* Language selectors */}
        <div className="flex items-center gap-2 sm:gap-4">
          <label className="flex-1">
            <span className="sr-only">Source language</span>
            <select
              value={sourceLang}
              onChange={(e) => {
                setSourceLang(e.target.value);
                void handleTranslate(input, e.target.value, targetLang);
              }}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm font-medium text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap languages"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-input bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden />
          </button>

          <label className="flex-1">
            <span className="sr-only">Target language</span>
            <select
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                void handleTranslate(input, sourceLang, e.target.value);
              }}
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm font-medium text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Panels */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <section
            aria-label="Text to translate"
            className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 5000))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                  void handleTranslate();
              }}
              placeholder="Type or paste text to translate…"
              rows={7}
              className="w-full flex-1 resize-none bg-transparent text-base text-card-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {input.length}/5000
              </span>
              <div className="flex items-center gap-2">
                {input && (
                  <button
                    type="button"
                    onClick={() => speak(input, sourceLang)}
                    aria-label="Listen to source text"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Volume2 className="h-4 w-4" aria-hidden />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void handleTranslate()}
                  disabled={!input.trim() || isTranslating}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isTranslating && (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  )}
                  Translate
                </button>
              </div>
            </div>
          </section>

          <section
            aria-label="Translated text"
            className="flex flex-col rounded-2xl border border-border bg-secondary p-4 shadow-sm"
          >
            <div
              aria-live="polite"
              className="w-full flex-1 whitespace-pre-wrap text-base text-secondary-foreground"
            >
              {isTranslating ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Translating…
                </span>
              ) : output ? (
                output
              ) : (
                <span className="text-muted-foreground">
                  Translation will appear here…
                </span>
              )}
            </div>
            {output && (
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => speak(output, targetLang)}
                  aria-label="Listen to translation"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Volume2 className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium text-card-foreground transition-colors hover:bg-accent"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" aria-hidden /> Copy
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Tip: press Ctrl+Enter (⌘+Enter on Mac) to translate quickly.
        </p>
      </div>
    </main>
  );
}
