"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import {
  FolderInput,
  LayoutTemplate,
  Mail,
  Paperclip,
  Send,
} from "lucide-react";
import type { Conversation, Message } from "@/lib/types/contract";
import { getInitialConversations } from "@/lib/mock/communications";
import { getPerson } from "@/lib/mock/people";
import { getApplication } from "@/lib/mock/applications";
import { MOCK_USER } from "@/lib/mock/user";
import { APPLICATIONS_PATH, PEOPLE_PATH } from "./nav";
import motion from "./motion.module.css";

type Filter = "inbox" | "sent" | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "sent", label: "Sent" },
  { id: "all", label: "All" },
];

function lastMessage(conversation: Conversation): Message {
  return conversation.messages[conversation.messages.length - 1];
}

// Short relative time for the conversation list.
function formatRelative(iso: string): string {
  const mins = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 60000),
  );
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

// Full date and time for the message audit line.
function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CommunicationsView() {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    getInitialConversations(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("inbox");
  const [draft, setDraft] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const sorted = useMemo(() => {
    const filtered = conversations.filter((c) => {
      if (filter === "all") return true;
      const dir = lastMessage(c).direction;
      return filter === "inbox" ? dir === "inbound" : dir === "outbound";
    });
    return [...filtered].sort(
      (a, b) =>
        new Date(lastMessage(b).sentAt).getTime() -
        new Date(lastMessage(a).sentAt).getTime(),
    );
  }, [conversations, filter]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;
  const person = selected ? getPerson(selected.personId) : undefined;
  const application = selected
    ? getApplication(selected.applicationId)
    : undefined;

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: true } : c)),
    );
  };

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selected) return;
    const message: Message = {
      id: `${selected.id}-out-${selected.messages.length}-${Date.now()}`,
      direction: "outbound",
      delivered: true,
      body,
      sentAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, read: true, messages: [...c.messages, message] }
          : c,
      ),
    );
    setDraft("");
    setAnnouncement(`Message sent to ${person?.fullName ?? "the client"}.`);
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden bg-surface-0">
      <h1 className="sr-only">Communications</h1>

      {/* LEFT PANE: conversation list */}
      <nav
        aria-label="Conversations"
        className="flex w-[280px] shrink-0 flex-col border-r border-border"
      >
        <div className="shrink-0 border-b border-border p-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-600">
            <Mail size={14} aria-hidden="true" />
            Connected: Outlook
          </span>
          <div className="mt-3 flex gap-1">
            {FILTERS.map((f) => {
              const active = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={
                    "flex h-8 flex-1 items-center justify-center rounded-lg border px-2 text-xs font-medium transition-[transform,background-color,border-color] duration-[130ms] active:scale-[0.97] " +
                    (active
                      ? "border-brand-700 bg-brand-700 text-surface-0"
                      : "border-border bg-surface-0 text-ink-900 hover:bg-surface-50")
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {sorted.map((conversation) => {
            const rowPerson = getPerson(conversation.personId);
            const last = lastMessage(conversation);
            const active = conversation.id === selectedId;
            const unread = !conversation.read;
            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => selectConversation(conversation.id)}
                  aria-current={active ? "true" : undefined}
                  className={
                    "flex w-full flex-col gap-0.5 border-l-2 px-4 py-3 text-left transition-colors " +
                    (active
                      ? "border-brand-700 bg-surface-50"
                      : "border-transparent hover:bg-surface-50")
                  }
                >
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={
                        "truncate text-sm text-ink-900 " +
                        (unread ? "font-semibold" : "")
                      }
                    >
                      {rowPerson?.fullName ?? "Unknown"}
                    </span>
                    <span className="shrink-0 text-xs text-ink-600">
                      {formatRelative(last.sentAt)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="min-w-0 flex-1 truncate text-xs text-ink-600">
                      {last.direction === "outbound" ? "You: " : ""}
                      {last.body}
                    </span>
                    {unread && (
                      <>
                        <span className="sr-only">unread</span>
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 shrink-0 rounded-full bg-brand-700"
                        />
                      </>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
          {sorted.length === 0 && (
            <li className="px-4 py-8 text-center text-xs text-ink-600">
              No conversations here.
            </li>
          )}
        </ul>
      </nav>

      {/* RIGHT PANE: selected thread */}
      <div className="flex min-w-0 flex-1 flex-col">
        {!selected || !person ? (
          <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-ink-600">
            Select a conversation to read it.
          </div>
        ) : (
          <>
            <header className="shrink-0 border-b border-border px-6 py-4">
              <h2 className="font-heading text-base font-semibold text-ink-900">
                <Link
                  href={`${PEOPLE_PATH}/${person.id}`}
                  className="underline"
                >
                  {person.fullName}
                </Link>
              </h2>
              <p className="mt-0.5 text-xs text-ink-600">
                {application && (
                  <>
                    <Link
                      href={`${APPLICATIONS_PATH}/${application.id}`}
                      className="text-brand-700 underline"
                    >
                      {application.caseNumber}
                    </Link>
                    {" · "}
                  </>
                )}
                via Outlook
              </p>
            </header>

            <div
              role="log"
              aria-label={`Messages with ${person.fullName}`}
              className="flex flex-1 flex-col gap-4 overflow-y-auto p-6"
            >
              {selected.messages.map((message) => (
                <Fragment key={message.id}>
                  {message.autoSorted && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-ink-600">
                      <FolderInput size={12} aria-hidden="true" />
                      {`Sorted to ${person.fullName}'s case automatically`}
                    </div>
                  )}
                  {message.direction === "inbound" ? (
                    <div
                      className={`max-w-[75%] self-start ${motion.bubbleIn}`}
                    >
                      <div className="rounded-xl border border-border bg-surface-50 px-4 py-2 text-sm text-ink-900">
                        {message.body}
                      </div>
                      <div className="mt-1 text-xs text-ink-600">
                        {person.fullName} · {formatDateTime(message.sentAt)}
                      </div>
                    </div>
                  ) : (
                    <div className={`max-w-[75%] self-end ${motion.bubbleIn}`}>
                      <div className="rounded-xl bg-[color-mix(in_srgb,var(--brand-400)_12%,var(--surface-0))] px-4 py-2 text-sm text-ink-900">
                        {message.body}
                      </div>
                      <div className="mt-1 text-right text-xs text-ink-600">
                        {MOCK_USER.fullName} · via Outlook ·{" "}
                        {formatDateTime(message.sentAt)} · Delivered
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="shrink-0 border-t border-border p-3"
            >
              <label htmlFor="reply" className="sr-only">
                Write a reply
              </label>
              <textarea
                id="reply"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a reply…"
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Attach a file"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-surface-50 hover:text-ink-900"
                  >
                    <Paperclip size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Insert a template"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-surface-50 hover:text-ink-900"
                  >
                    <LayoutTemplate size={18} aria-hidden="true" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="flex h-9 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-medium text-surface-0 transition-[transform,background-color] duration-[130ms] enabled:active:scale-[0.98] hover:bg-[color-mix(in_srgb,var(--ink-900)_25%,var(--brand-700))] disabled:bg-surface-50 disabled:text-ink-600"
                >
                  <Send size={16} aria-hidden="true" />
                  Send
                </button>
              </div>
            </form>

            <div aria-live="polite" className="sr-only">
              {announcement}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
