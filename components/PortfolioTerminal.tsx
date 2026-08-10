"use client";

import { useEffect, useRef, useState } from "react";
import {
  PROMPT,
  TERMINAL_SEQUENCE,
  type TerminalLine,
} from "@/lib/terminal-content";

type HistoryEntry =
  | { kind: "command"; text: string }
  | { kind: "output"; lines: TerminalLine[] };

const CHAR_MS = 28;
const AFTER_COMMAND_MS = 220;
const AFTER_OUTPUT_MS = 420;
const LINE_STAGGER_MS = 18;

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(resolve, ms);
    const onAbort = () => {
      window.clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function OutputLines({ lines }: { lines: TerminalLine[] }) {
  return (
    <>
      {lines.map((line, i) => {
        if (line.type === "blank") {
          return <div key={i} className="h-3" aria-hidden />;
        }
        if (line.type === "link") {
          const isExternal = line.href.startsWith("http");
          return (
            <div key={i} className="whitespace-pre-wrap break-words">
              <span className="text-[#9ae6b4]">{line.prefix}</span>
              <a
                href={line.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-gold underline-offset-2 transition-colors hover:text-warm-white hover:underline"
              >
                {line.label}
              </a>
            </div>
          );
        }
        return (
          <div
            key={i}
            className="whitespace-pre-wrap break-words text-[#9ae6b4]"
          >
            {line.text}
          </div>
        );
      })}
    </>
  );
}

export default function PortfolioTerminal() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const startedRef = useRef(false);

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [typedCommand, setTypedCommand] = useState("");
  const [showPrompt, setShowPrompt] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [history, typedCommand]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
          if (!startedRef.current) {
            startedRef.current = true;
            setReplayKey((k) => k + 1);
          }
        }
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (replayKey === 0) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    let cancelled = false;

    async function runSequence() {
      setHistory([]);
      setTypedCommand("");
      setShowPrompt(true);
      setPlaying(true);
      setDone(false);

      try {
        await sleep(400, signal);

        for (const block of TERMINAL_SEQUENCE) {
          if (cancelled) return;

          setTypedCommand("");
          setShowPrompt(true);

          for (let i = 0; i < block.command.length; i += 1) {
            if (cancelled) return;
            setTypedCommand(block.command.slice(0, i + 1));
            await sleep(CHAR_MS, signal);
          }

          await sleep(AFTER_COMMAND_MS, signal);
          if (cancelled) return;

          setHistory((prev) => [
            ...prev,
            { kind: "command", text: block.command },
          ]);
          setTypedCommand("");
          setShowPrompt(false);

          const revealed: TerminalLine[] = [];
          for (const line of block.lines) {
            if (cancelled) return;
            revealed.push(line);
            setHistory((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.kind === "output") {
                next[next.length - 1] = {
                  kind: "output",
                  lines: [...revealed],
                };
              } else {
                next.push({ kind: "output", lines: [...revealed] });
              }
              return next;
            });
            await sleep(LINE_STAGGER_MS, signal);
          }

          setShowPrompt(true);
          await sleep(AFTER_OUTPUT_MS, signal);
        }

        if (!cancelled) {
          setDone(true);
          setPlaying(false);
          setShowPrompt(true);
          setTypedCommand("");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        throw err;
      }
    }

    void runSequence();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [replayKey]);

  const handleReplay = () => {
    if (playing) return;
    startedRef.current = true;
    setReplayKey((k) => k + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="terminal"
      aria-label="Portfolio terminal"
      className="relative z-10 flex min-h-svh w-full items-center justify-center px-5 py-10 sm:px-8 lg:px-8 xl:px-12"
    >
      <div className="w-full max-w-4xl">
        <div className="overflow-hidden rounded-lg border border-[var(--surface-border)] bg-[#0d0d0d] shadow-[0_0_0_1px_rgba(212,175,55,0.08),0_24px_80px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-3 border-b border-[var(--surface-border)] bg-[#161616] px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <p className="flex-1 truncate font-mono text-[11px] text-chrome-dim sm:text-xs">
              abdalrhmn@portfolio-cli:~ — bash
            </p>
            <button
              type="button"
              onClick={handleReplay}
              disabled={playing || !done}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-chrome transition-colors hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              Replay
            </button>
          </div>

          <div
            ref={scrollerRef}
            data-terminal-scroll
            className="max-h-[min(70svh,36rem)] overflow-y-auto px-4 py-4 font-mono text-[12px] leading-relaxed sm:px-5 sm:text-[13px]"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            <p className="mb-3 text-chrome-dim">
              # Portfolio shell — auto-playing command tour
            </p>

            {history.map((entry, idx) => {
              if (entry.kind === "command") {
                return (
                  <div key={`cmd-${idx}`} className="mt-1">
                    <span className="text-gold">{PROMPT}</span>{" "}
                    <span className="text-warm-white">{entry.text}</span>
                  </div>
                );
              }
              return (
                <div key={`out-${idx}`} className="mt-0.5">
                  <OutputLines lines={entry.lines} />
                </div>
              );
            })}

            {showPrompt ? (
              <div className="mt-1 flex flex-wrap items-baseline">
                <span className="text-gold">{PROMPT}</span>
                <span className="ml-2 text-warm-white">{typedCommand}</span>
                <span
                  aria-hidden
                  className="ml-0.5 inline-block h-[1.05em] w-[0.55ch] translate-y-[0.1em] animate-pulse bg-gold"
                />
              </div>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-center font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-chrome-dim">
          Scroll for ID card &amp; projects
        </p>
      </div>
    </section>
  );
}
