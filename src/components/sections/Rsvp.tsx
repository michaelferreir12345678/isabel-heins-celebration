import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { Check, Heart, Search, X } from "lucide-react";

import { Section } from "@/components/Section";
import { useI18n } from "@/i18n";
import { hasEnoughLetters, type RsvpInvite, type RsvpSuggestion } from "@/lib/rsvp";
import { cn } from "@/lib/utils";
import { getInviteFn, searchInvitesFn, submitRsvpFn, suggestGuestsFn } from "@/services/rsvp";

type Status =
  | "idle"
  | "searching"
  | "results"
  | "empty"
  | "short"
  | "search-error"
  | "opening"
  | "link-missing"
  | "form"
  | "sending"
  | "error"
  | "done";

type Answers = Record<string, boolean | undefined>;

function previousAnswers(invite: RsvpInvite): Answers {
  return Object.fromEntries(
    invite.members.map((member) => [member.id, member.attending ?? undefined]),
  );
}

/** Sugestões de nomes enquanto a pessoa digita (a partir de 3 letras). */
function useSuggestions(query: string) {
  const [state, setState] = useState<{ items: RsvpSuggestion[]; failed: boolean } | null>(null);
  const enough = hasEnoughLetters(query);

  useEffect(() => {
    if (!enough) {
      setState(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      suggestGuestsFn({ data: { query } })
        .then((items) => {
          if (!cancelled) setState({ items, failed: false });
        })
        .catch(() => {
          if (!cancelled) setState({ items: [], failed: true });
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, enough]);

  return enough ? state : null;
}

export function Rsvp() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RsvpInvite[]>([]);
  const [invite, setInvite] = useState<RsvpInvite | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestions = useSuggestions(query);
  const showList = listOpen && suggestions !== null;

  // Quem chega pelo link personalizado (?convite=CODIGO) já vê o próprio convite.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("convite");
    if (!code) return;
    let cancelled = false;
    setStatus("opening");
    getInviteFn({ data: { code } })
      .then((found) => {
        if (cancelled) return;
        if (!found) {
          setStatus("link-missing");
          return;
        }
        setInvite(found);
        setAnswers(previousAnswers(found));
        setStatus("form");
      })
      .catch(() => {
        if (!cancelled) setStatus("search-error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setListOpen(false);
    if (!hasEnoughLetters(query)) {
      setStatus("short");
      return;
    }
    setStatus("searching");
    setInvite(null);
    try {
      const found = await searchInvitesFn({ data: { query } });
      setResults(found);
      setStatus(found.length ? "results" : "empty");
    } catch {
      setStatus("search-error");
    }
  }

  function pickInvite(next: RsvpInvite) {
    setInvite(next);
    setAnswers(previousAnswers(next));
    setMessage("");
    setSubmitted(false);
    setStatus("form");
  }

  function chooseSuggestion(suggestion: RsvpSuggestion) {
    setQuery(suggestion.name);
    setListOpen(false);
    setActiveIndex(-1);
    setResults([]);
    pickInvite(suggestion.invite);
  }

  function handleSearchKeys(e: KeyboardEvent<HTMLInputElement>) {
    const items = suggestions?.items ?? [];
    if (e.key === "ArrowDown" && items.length) {
      e.preventDefault();
      setListOpen(true);
      setActiveIndex((index) => Math.min(items.length - 1, index + 1));
    } else if (e.key === "ArrowUp" && items.length) {
      e.preventDefault();
      setActiveIndex((index) => Math.max(-1, index - 1));
    } else if (e.key === "Enter" && showList && items[activeIndex]) {
      e.preventDefault();
      chooseSuggestion(items[activeIndex]);
    } else if (e.key === "Escape") {
      setListOpen(false);
      setActiveIndex(-1);
    }
  }

  const allAnswered = invite?.members.every((member) => answers[member.id] !== undefined) ?? false;
  const anyAttending = invite?.members.some((member) => answers[member.id] === true) ?? false;
  const alreadyAnswered = submitted || Boolean(invite?.respondedAt);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!invite || !allAnswered) return;
    setStatus("sending");
    try {
      const trimmedMessage = message.trim();
      const result = await submitRsvpFn({
        data: {
          code: invite.code,
          answers: invite.members.map((member) => ({
            memberId: member.id,
            attending: answers[member.id] === true,
          })),
          lang,
          ...(trimmedMessage ? { message: trimmedMessage } : {}),
          ...(website ? { website } : {}),
        },
      });
      if (result.ok) {
        setSubmitted(true);
        setMessage("");
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function backToSearch() {
    setInvite(null);
    setStatus(results.length ? "results" : "idle");
  }

  const choiceButton =
    "inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 text-xs tracking-[0.12em] uppercase transition-colors sm:px-4";

  return (
    <Section id="presenca" kicker={t.rsvp.kicker} title={t.rsvp.title} subtitle={t.rsvp.subtitle}>
      <div className="mx-auto max-w-2xl rounded-sm border border-terracotta/20 bg-card p-6 sm:p-10">
        {status === "done" && invite ? (
          <div className="text-center" role="status">
            <Heart className="mx-auto size-7 text-terracotta" aria-hidden />
            <h3 className="font-display mt-4 text-3xl text-ink">
              {anyAttending ? t.rsvp.successTitle : t.rsvp.declinedTitle}
            </h3>
            <p className="mt-3 text-muted-foreground">
              {anyAttending ? t.rsvp.successBody : t.rsvp.declinedBody}
            </p>
            <button
              type="button"
              onClick={() => setStatus("form")}
              className="mt-8 min-h-11 rounded-full border border-terracotta/40 px-6 text-sm tracking-[0.18em] text-terracotta uppercase"
            >
              {t.rsvp.again}
            </button>
          </div>
        ) : status === "opening" ? (
          <p role="status" className="text-center text-muted-foreground">
            {t.rsvp.loadingInvite}
          </p>
        ) : invite && (status === "form" || status === "sending" || status === "error") ? (
          <form onSubmit={handleSubmit} className="relative space-y-6">
            <div className="text-center">
              <p className="kicker">{invite.title}</p>
              <h3 className="font-display mt-2 text-2xl text-ink">{t.rsvp.membersTitle}</h3>
              {invite.respondedAt && !submitted && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.rsvp.alreadyAnswered(invite.respondedAt)}
                </p>
              )}
            </div>

            <ul className="space-y-3">
              {invite.members.map((member) => {
                const answer = answers[member.id];
                return (
                  <li
                    key={member.id}
                    // No celular o nome fica em cima e os botões embaixo; na mesma linha os
                    // botões ocupavam todo o espaço e o nome sumia.
                    className="flex flex-col gap-3 rounded-sm border border-terracotta/15 bg-paper/70 px-4 py-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  >
                    <span className="font-display text-xl break-words text-ink sm:min-w-0 sm:truncate">
                      {member.name}
                    </span>
                    <div
                      className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0"
                      role="group"
                      aria-label={member.name}
                    >
                      <button
                        type="button"
                        aria-pressed={answer === true}
                        onClick={() => setAnswers((a) => ({ ...a, [member.id]: true }))}
                        className={cn(
                          choiceButton,
                          answer === true
                            ? "bg-terracotta text-primary-foreground"
                            : "border border-terracotta/30 text-muted-foreground",
                        )}
                      >
                        <Check className="size-3.5" aria-hidden />
                        <span className="sm:hidden">{t.rsvp.attendingShort}</span>
                        <span className="hidden sm:inline">{t.rsvp.attending}</span>
                      </button>
                      <button
                        type="button"
                        aria-pressed={answer === false}
                        onClick={() => setAnswers((a) => ({ ...a, [member.id]: false }))}
                        className={cn(
                          choiceButton,
                          answer === false
                            ? "bg-ink text-paper"
                            : "border border-terracotta/30 text-muted-foreground",
                        )}
                      >
                        <X className="size-3.5" aria-hidden />
                        <span className="sm:hidden">{t.rsvp.notAttendingShort}</span>
                        <span className="hidden sm:inline">{t.rsvp.notAttending}</span>
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
                maxLength={1000}
                placeholder={t.rsvp.messagePlaceholder}
                className="mt-2 w-full resize-none rounded-sm border border-terracotta/25 bg-paper/70 px-4 py-3 text-base text-ink placeholder:text-muted-foreground"
              />
            </div>

            {/* Campo invisível contra robôs: pessoas não veem nem preenchem. */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute -left-[9999px] size-px opacity-0"
            />

            {status === "error" && (
              <p role="alert" className="text-center text-sm text-destructive">
                {t.rsvp.error}
              </p>
            )}
            {!allAnswered && (
              <p className="text-center text-sm text-muted-foreground">{t.rsvp.chooseAll}</p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="submit"
                disabled={status === "sending" || !allAnswered}
                className="min-h-11 flex-1 rounded-full bg-terracotta px-6 text-sm tracking-[0.18em] text-primary-foreground uppercase disabled:opacity-60"
              >
                {status === "sending"
                  ? t.rsvp.sending
                  : alreadyAnswered
                    ? t.rsvp.update
                    : t.rsvp.confirm}
              </button>
              <button
                type="button"
                onClick={backToSearch}
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
                <div className="relative flex-1">
                  <input
                    id="rsvp-search"
                    role="combobox"
                    aria-expanded={showList}
                    aria-controls="rsvp-suggestions"
                    aria-autocomplete="list"
                    aria-activedescendant={
                      showList && activeIndex >= 0 ? `rsvp-suggestion-${activeIndex}` : undefined
                    }
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setListOpen(true);
                      setActiveIndex(-1);
                    }}
                    onFocus={() => setListOpen(true)}
                    onBlur={() => setListOpen(false)}
                    onKeyDown={handleSearchKeys}
                    placeholder={t.rsvp.searchPlaceholder}
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={120}
                    className="min-h-11 w-full rounded-sm border border-terracotta/25 bg-paper/70 px-4 text-base text-ink placeholder:text-muted-foreground"
                  />
                  {showList && suggestions && (
                    <ul
                      id="rsvp-suggestions"
                      role="listbox"
                      aria-label={t.rsvp.suggestionsLabel}
                      className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-sm border border-terracotta/25 bg-card py-1 shadow-[0_18px_30px_-18px_rgba(36,30,25,0.45)]"
                    >
                      {suggestions.items.length ? (
                        suggestions.items.map((item, index) => (
                          <li
                            key={`${item.invite.code}-${item.name}`}
                            id={`rsvp-suggestion-${index}`}
                            role="option"
                            aria-selected={index === activeIndex}
                            // Evita que o campo perca o foco antes do clique.
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => chooseSuggestion(item)}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={cn(
                              "cursor-pointer px-4 py-2.5 text-left",
                              index === activeIndex && "bg-paper-deep",
                            )}
                          >
                            <span className="font-display block text-lg leading-snug text-ink">
                              {item.name}
                            </span>
                            {item.invite.title !== item.name && (
                              <span className="block text-xs text-muted-foreground">
                                {item.invite.title}
                              </span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li
                          role="option"
                          aria-selected={false}
                          aria-disabled
                          className={cn(
                            "px-4 py-2.5 text-sm",
                            suggestions.failed ? "text-destructive" : "text-muted-foreground",
                          )}
                        >
                          {suggestions.failed ? t.rsvp.loadError : t.rsvp.noSuggestions}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
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

            {(status === "short" ||
              status === "empty" ||
              status === "link-missing" ||
              status === "search-error") && (
              <p
                role="status"
                className={cn(
                  "text-center text-sm",
                  status === "search-error" ? "text-destructive" : "text-muted-foreground",
                )}
              >
                {status === "short"
                  ? t.rsvp.tooShort
                  : status === "empty"
                    ? t.rsvp.noResults
                    : status === "link-missing"
                      ? t.rsvp.linkNotFound
                      : t.rsvp.loadError}
              </p>
            )}

            {status === "results" && (
              <div>
                <p className="kicker text-center">{t.rsvp.resultsTitle}</p>
                <ul className="mt-4 space-y-3">
                  {results.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => pickInvite(item)}
                        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-terracotta/20 bg-paper/70 px-4 py-4 text-left transition-colors hover:border-terracotta/50"
                      >
                        <span className="min-w-0">
                          <span className="font-display block truncate text-xl text-ink">
                            {item.title}
                          </span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {item.members.map((member) => member.name).join(" · ")}
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
