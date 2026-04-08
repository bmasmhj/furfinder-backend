import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Matches - Pet Reunite AI',
};

export default function MatchesPage() {
  const matches = [
    {
      id: 1,
      yourPet: 'Max (Lost Dog)',
      matchedPet: 'Golden Retriever found in Park Slope',
      confidence: 92,
      date: '2 hours ago',
      location: 'Park Slope, Brooklyn',
      status: 'Pending Review',
    },
    {
      id: 2,
      yourPet: 'Whiskers (Lost Cat)',
      matchedPet: 'Tabby cat found near Central Park',
      confidence: 85,
      date: '1 day ago',
      location: 'Central Park, Manhattan',
      status: 'Pending Review',
    },
    {
      id: 3,
      yourPet: 'Max (Lost Dog)',
      matchedPet: 'Golden Retriever spotted in Prospect Park',
      confidence: 78,
      date: '2 days ago',
      location: 'Prospect Park, Brooklyn',
      status: 'Pending Review',
    },
  ];

  return (
    <div className="p-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Potential Matches</h1>
        <p className="text-neutral-600 mt-2">Our AI found {matches.length} potential matches for your pets.</p>
      </div>

      <div className="mt-8 space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white p-6 rounded-lg border border-neutral-200 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 mb-1">{match.yourPet}</h3>
                <p className="text-neutral-600">{match.matchedPet}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-brand-600">{match.confidence}%</div>
                <p className="text-xs text-neutral-600">Match Confidence</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2 text-neutral-600 text-sm">
                <span>📍</span>
                <span>{match.location}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 text-sm">
                <span>🕐</span>
                <span>{match.date}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/matches/${match.id}`}
                className="flex-1 rounded-lg bg-brand-600 text-white font-medium py-2 text-center hover:bg-brand-700 transition"
              >
                Review Match
              </Link>
              <button className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 font-medium hover:bg-neutral-50 transition">
                Not a Match
              </button>
            </div>
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="bg-white p-12 rounded-lg border border-neutral-200 text-center">
          <p className="text-neutral-600 text-lg">No matches yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
