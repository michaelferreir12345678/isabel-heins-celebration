import { useState, type FormEvent } from "react";
import { Check, Heart, Search, X } from "lucide-react";

import { Section } from "@/components/Section";
import type { Invite } from "@/data/guests";
import { searchInvites, submitRsvp } from "@/services/guests";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

type Status = "idle" | "searching" | "results" | "empty" | "form" | "sending" | "done" | "error";

export function Rsvp() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<Invite[]>([]);
  const [invite, setInvite] = useState<Invite | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setStatus("searching");
    setInvite(null);
    const found = await searchInvites(query);
    setResults(found);
    setStatus(found.length ? "results" : "empty");
  }

  function pickInvite(next: Invite) {
    setInvite(next);
    setAnswers(Object.fromEntries(next.members.map((m) => [m.id, true])));
    setStatus("form");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!invite) return;
    setStatus("sending");
    try {
      const trimmedMessage = message.trim();
      await submitRsvp({
        inviteId: invite.id,
        inviteTitle: invite.title,
        answers: invite.members.map((m) => ({
          memberId: m.id,
          name: m.name,
          attending: answers[m.id] ?? false,
        })),
        ...(trimmedMessage ? { message: trimmedMessage } : {}),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setQuery("");
    setResults([]);
    setInvite(null);
    setAnswers({});
    setMessage("");
    setStatus("idle");
  }

  return (
    <Section id="presenca" kicker={t.rsvp.kicker} title={t.rsvp.title} subtitle={t.rsvp.subtitle}>
      <div className="mx-auto max-w-2xl rounded-sm border border-terracotta/20 bg-card p-6 sm:p-10">
        {status === "done" ? (
          <div className="text-center">
            <Heart className="mx-auto size-7 text-terracotta" aria-hidden />
            <h3 className="font-display mt-4 text-3xl text-ink">{t.rsvp.successTitle}</h3>
            <p className="mt-3 text-muted-foreground">{t.rsvp.successBody}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 min-h-11 rounded-full border border-terracotta/40 px-6 text-sm tracking-[0.18em] text-terracotta uppercase"
            >
              {t.rsvp.again}
            </button>
          </div>
        ) : invite && (status === "form" || status === "sending" || status === "error") ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <p className="kicker">{invite.title}</p>
              <h3 className="font-display mt-2 text-2xl text-ink">{t.rsvp.membersTitle}</h3>
            </div>

            <ul className="space-y-3">
              {invite.members.map((member) => {
                const attending = answers[member.id] ?? false;
                return (
                  <li
                    key={member.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-terracotta/15 bg-paper/70 px-4 py-3"
                  >
                    <span className="min-w-0 truncate font-display text-xl text-ink">{member.name}</span>
                    <div className="flex shrink-0 gap-2" role="group" aria-label={member.name}>
                      <button
                        type="button"
                        aria-pressed={attending}
                        onClick={() => setAnswers((a) => ({ ...a, [member.id]: true }))}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs tracking-[0.12em] uppercase transition-colors",
                          attending
                            ? "bg-terracotta text-primary-foreground"
                            : "border border-terracotta/30 text-muted-foreground",
                        )}
                      >
                        <Check className="size-3.5" aria-hidden />
                        {t.rsvp.attending}
                      </button>
                      <button
                        type="button"
                        aria-pressed={!attending}
                        onClick={() => setAnswers((a) => ({ ...a, [member.id]: false }))}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs tracking-[0.12em] uppercase transition-colors",
                          !attending
                            ? "bg-ink text-paper"
                            : "border border-terracotta/30 text-muted-foreground",
                        )}
                      >
                        <X className="size-3.5" aria-hidden />
                        {t.rsvp.notAttending}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div>
              <label htmlFor="rsvp-message" className="kicker block">
                {t.rsvp.messageLabel}
              </label>
              <textarea
                id="rsvp-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder={t.rsvp.messagePlaceholder}
                className="mt-2 w-full resize-none rounded-sm border border-terracotta/25 bg-paper/70 px-4 py-3 text-base text-ink placeholder:text-muted-foreground"
              />
            </div>

            {status === "error" && (
              <p role="alert" className="text-center text-sm text-destructive">
                {t.rsvp.error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="submit"
                disabled={status === "sending"}
                className="min-h-11 flex-1 rounded-full bg-terracotta px-6 text-sm tracking-[0.18em] text-primary-foreground uppercase disabled:opacity-60"
              >
                {status === "sending" ? t.rsvp.sending : t.rsvp.confirm}
              </button>
              <button
                type="button"
                onClick={() => setStatus(results.length ? "results" : "idle")}
                className="min-h-11 rounded-full border border-terracotta/30 px-6 text-sm tracking-[0.18em] text-muted-foreground uppercase"
              >
                {t.rsvp.back}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSearch} className="space-y-3">
              <label htmlFor="rsvp-search" className="kicker block">
                {t.rsvp.searchLabel}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="rsvp-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.rsvp.searchPlaceholder}
                  className="min-h-11 flex-1 rounded-sm border border-terracotta/25 bg-paper/70 px-4 text-base text-ink placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={status === "searching"}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-terracotta px-6 text-sm tracking-[0.18em] text-primary-foreground uppercase disabled:opacity-60"
                >
                  <Search className="size-4" aria-hidden />
                  {status === "searching" ? t.rsvp.searching : t.rsvp.searchButton}
                </button>
              </div>
            </form>

            {status === "empty" && (
              <p role="status" className="text-center text-sm text-muted-foreground">
                {t.rsvp.noResults}
              </p>
            )}

            {status === "results" && (
              <div>
                <p className="kicker text-center">{t.rsvp.resultsTitle}</p>
                <ul className="mt-4 space-y-3">
                  {results.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => pickInvite(item)}
                        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-terracotta/20 bg-paper/70 px-4 py-4 text-left transition-colors hover:border-terracotta/50"
                      >
                        <span className="min-w-0">
                          <span className="font-display block truncate text-xl text-ink">{item.title}</span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {item.members.map((m) => m.name).join(" · ")}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs tracking-[0.14em] text-terracotta uppercase">
                          {t.rsvp.guestsCount(item.members.length)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
