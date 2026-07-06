// Mock email conversations, auto-sorted to cases by sender. Threads link to
// existing people and their applications. No real send: the Communications
// page mutates a copy of this in local state.

import type { Conversation } from "@/lib/types/contract";

function minsAgo(minutes: number): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
}

const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-rosa",
    personId: "person-6",
    applicationId: "app-6",
    read: true,
    messages: [
      {
        id: "conv-rosa-1",
        direction: "inbound",
        autoSorted: true,
        body: "I got a reminder that my food assistance is up for renewal. What do I need to send?",
        sentAt: minsAgo(300),
      },
      {
        id: "conv-rosa-2",
        direction: "outbound",
        delivered: true,
        body: "Hi Rosa, for the renewal we need your latest income verification and a current utility bill. You can email them here whenever you have them.",
        sentAt: minsAgo(240),
      },
    ],
  },
  {
    id: "conv-tommy",
    personId: "person-4",
    applicationId: "app-4",
    read: false,
    messages: [
      {
        id: "conv-tommy-1",
        direction: "outbound",
        delivered: true,
        body: "Hi Tommy, I still need the incident report for your file. Can you send it when you get a chance?",
        sentAt: minsAgo(1440),
      },
      {
        id: "conv-tommy-2",
        direction: "inbound",
        body: "I will drop it off tomorrow. Is email okay instead?",
        sentAt: minsAgo(360),
      },
    ],
  },
  {
    id: "conv-elena",
    personId: "person-7",
    applicationId: "app-7",
    read: true,
    messages: [
      {
        id: "conv-elena-1",
        direction: "inbound",
        autoSorted: true,
        body: "I am attaching my energy bill for the assistance application.",
        sentAt: minsAgo(480),
      },
      {
        id: "conv-elena-2",
        direction: "outbound",
        delivered: true,
        body: "Thank you, Elena. I have added it to your file and will review it this week.",
        sentAt: minsAgo(420),
      },
    ],
  },
  {
    id: "conv-marisol",
    personId: "person-1",
    applicationId: "app-1",
    read: false,
    messages: [
      {
        id: "conv-marisol-1",
        direction: "inbound",
        body: "Hi, I got a letter about my housing intake. I want to send my pay stub but I am not sure how.",
        sentAt: minsAgo(2880),
      },
      {
        id: "conv-marisol-2",
        direction: "outbound",
        delivered: true,
        body: "Good to hear from you, Marisol. You can reply to this email with a photo of your pay stub and I will add it to your file.",
        sentAt: minsAgo(2820),
      },
      {
        id: "conv-marisol-3",
        direction: "inbound",
        body: "Here is the photo of my last pay stub. Let me know if you need the one before it too.",
        sentAt: minsAgo(1440),
      },
    ],
  },
  {
    id: "conv-priya",
    personId: "person-3",
    applicationId: "app-3",
    read: true,
    messages: [
      {
        id: "conv-priya-1",
        direction: "inbound",
        body: "Do I need to come in person to finish my review, or can we do it over email?",
        sentAt: minsAgo(2880),
      },
      {
        id: "conv-priya-2",
        direction: "outbound",
        delivered: true,
        body: "Hi Priya, we can finish it over email. I will send the last form you need to sign later today.",
        sentAt: minsAgo(2820),
      },
    ],
  },
  {
    id: "conv-darnell",
    personId: "person-2",
    applicationId: "app-2",
    read: true,
    messages: [
      {
        id: "conv-darnell-1",
        direction: "outbound",
        delivered: true,
        body: "Hi Darnell, your home visit is set for Thursday at 10 in the morning. Does that still work for you?",
        sentAt: minsAgo(4320),
      },
      {
        id: "conv-darnell-2",
        direction: "inbound",
        body: "Thursday at 10 works. Thank you.",
        sentAt: minsAgo(4290),
      },
      {
        id: "conv-darnell-3",
        direction: "outbound",
        delivered: true,
        body: "Great, I have it on the calendar. See you then.",
        sentAt: minsAgo(4260),
      },
    ],
  },
  {
    id: "conv-aisha",
    personId: "person-5",
    applicationId: "app-5",
    read: true,
    messages: [
      {
        id: "conv-aisha-1",
        direction: "outbound",
        delivered: true,
        body: "Hi Aisha, your child care subsidy is all set. You should see it start next month.",
        sentAt: minsAgo(8640),
      },
      {
        id: "conv-aisha-2",
        direction: "inbound",
        body: "Thank you so much for your help.",
        sentAt: minsAgo(8580),
      },
    ],
  },
];

// A fresh deep copy so the page can append messages and mark reads without
// mutating the module data.
export function getInitialConversations(): Conversation[] {
  return CONVERSATIONS.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({ ...message })),
  }));
}
