import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard - Pet Reunite AI',
};

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Welcome Back!</h1>
        <p className="text-neutral-600 mt-2">Here&apos;s what&apos;s happening with your pet search.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-neutral-600 text-sm">Active Reports</p>
          <p className="text-2xl font-bold text-neutral-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-neutral-600 text-sm">Potential Matches</p>
          <p className="text-2xl font-bold text-brand-600">7</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-neutral-600 text-sm">New Messages</p>
          <p className="text-2xl font-bold text-neutral-900">2</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-neutral-600 text-sm">Reunited</p>
          <p className="text-2xl font-bold text-green-600">1</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Recent Matches</h2>
            <div className="space-y-4">
              {[
                {
                  type: 'Match Found',
                  title: 'Golden Retriever in Brooklyn',
                  desc: 'Your lost Golden Retriever "Max" may match this found pet.',
                  date: '2 hours ago',
                  icon: '🎯',
                },
                {
                  type: 'Message',
                  title: 'New message from Sarah',
                  desc: 'Regarding the tabby cat found near Central Park',
                  date: '4 hours ago',
                  icon: '💬',
                },
                {
                  type: 'Report',
                  title: 'Report Updated',
                  desc: 'Your lost dog report was updated successfully',
                  date: '1 day ago',
                  icon: '✅',
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 hover:bg-neutral-50 rounded-lg transition cursor-pointer"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900">{activity.type}</p>
                    <p className="text-neutral-600 text-sm">{activity.title}</p>
                    <p className="text-neutral-500 text-xs mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 h-fit">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/reports/new"
              className="block w-full rounded-lg bg-brand-600 text-white font-medium py-2 text-center hover:bg-brand-700 transition"
            >
              Report Pet
            </Link>
            <Link
              href="/matches"
              className="block w-full rounded-lg border border-neutral-300 text-neutral-900 font-medium py-2 text-center hover:bg-neutral-50 transition"
            >
              View All Matches
            </Link>
            <Link
              href="/messages"
              className="block w-full rounded-lg border border-neutral-300 text-neutral-900 font-medium py-2 text-center hover:bg-neutral-50 transition"
            >
              View Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
