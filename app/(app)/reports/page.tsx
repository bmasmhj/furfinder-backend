import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Reports - Pet Reunite AI',
};

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      petName: 'Max',
      type: 'Lost Dog',
      breed: 'Golden Retriever',
      location: 'Brooklyn, NY',
      lastSeen: '2024-04-05',
      status: 'Active',
      matches: 3,
    },
    {
      id: 2,
      petName: 'Whiskers',
      type: 'Lost Cat',
      breed: 'Tabby',
      location: 'Manhattan, NY',
      lastSeen: '2024-03-28',
      status: 'Active',
      matches: 2,
    },
    {
      id: 3,
      petName: 'Buddy',
      type: 'Found Dog',
      breed: 'Labrador',
      location: 'Queens, NY',
      lastSeen: '2024-04-08',
      status: 'Reunited',
      matches: 0,
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Reports</h1>
          <p className="text-neutral-600 mt-2">Manage your lost and found pet reports.</p>
        </div>
        <Link
          href="/reports/new"
          className="rounded-lg bg-brand-600 text-white font-medium px-6 py-2 hover:bg-brand-700 transition"
        >
          New Report
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Pet</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Matches</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-neutral-900">{report.petName}</p>
                    <p className="text-sm text-neutral-600">{report.breed}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-700">{report.type}</td>
                <td className="px-6 py-4 text-neutral-700">{report.location}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-700">{report.matches}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/reports/${report.id}`}
                      className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                    >
                      View
                    </Link>
                    <button className="text-neutral-600 hover:text-neutral-900 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
