import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Messages - Pet Reunite AI',
};

export default function MessagesPage() {
  const conversations = [
    {
      id: 1,
      name: 'Sarah Chen',
      lastMessage: 'I found a golden retriever near my house...',
      time: '2 hours ago',
      unread: 2,
      avatar: 'SC',
    },
    {
      id: 2,
      name: 'John Smith',
      lastMessage: 'Thanks for the tips on finding lost pets!',
      time: '1 day ago',
      unread: 0,
      avatar: 'JS',
    },
    {
      id: 3,
      name: 'Emma Davis',
      lastMessage: 'Is this the cat you were looking for?',
      time: '3 days ago',
      unread: 0,
      avatar: 'ED',
    },
  ];

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
        {/* Conversation List */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-neutral-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="block p-4 border-b border-neutral-200 hover:bg-neutral-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-neutral-900">{conv.name}</h3>
                      <span className="text-xs text-neutral-600">{conv.time}</span>
                    </div>
                    <p className="text-sm text-neutral-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="flex-shrink-0 ml-2">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-brand-600 text-white text-xs font-bold">
                        {conv.unread}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Sarah Chen</h2>
              <p className="text-sm text-neutral-600">Found a golden retriever nearby</p>
            </div>
            <button className="text-neutral-600 hover:text-neutral-900">⋮</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm">SC</div>
              <div className="bg-white p-3 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-900">Hi! I think I found your golden retriever</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-brand-600 p-3 rounded-lg text-white">
                <p className="text-sm">Really? Where did you see it?</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">U</div>
            </div>
          </div>

          <div className="p-6 border-t border-neutral-200">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button className="rounded-lg bg-brand-600 text-white px-6 py-2 font-medium hover:bg-brand-700 transition">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
