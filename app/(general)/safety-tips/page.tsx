import { ChevronLeft, Shield, Sparkles, Search, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    title: 'When Your Pet Goes Missing',
    color: 'text-red-500',
    bg: 'bg-red-50',
    tips: [
      'Search your home and neighborhood thoroughly first',
      "Contact local shelters and vets with your pet's description",
      'Post on social media and community groups immediately',
      'Put out familiar items (bed, toys) near your home',
      'Check with microchip company to ensure contact details are current',
      'Browse our Partner Directory for local vets, shelters & rescue groups',
    ],
  },
  {
    title: 'If You Find a Lost Pet',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    tips: [
      'Check for tags, collar, or microchip (any vet can scan)',
      'Post in local lost & found groups with photo and location',
      'Contact local council and animal shelters to report',
      'Provide food, water, and a safe space while searching for owner',
      'Do not chase the animal - use treats to coax them close',
    ],
  },
  {
    title: 'Prevention Tips',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    tips: [
      'Microchip your pet and keep registration details updated',
      'Use a collar with ID tag including your phone number',
      'Take clear, recent photos of your pet from multiple angles',
      'Keep gates and fences secure, check for escape points',
      'Consider GPS tracking collars for adventurous pets',
    ],
  },
  {
    title: 'Emergency Contacts',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    tips: [
      'RSPCA: 1300 278 3589',
      'Animal Emergency: Contact your nearest 24hr vet',
      'Local Council Animal Services',
      'National Pet Register: 1300 734 738',
      "The Fur Finder AI Matching: Use our app's AI feature!",
    ],
  },
];

export default function SafetyTipsPage() {

  return (<div className="min-h-screen bg-gray-50">
    <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 pt-6 pb-8">


      <div className="space-y-2">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20">
          <Shield size={20} />
        </div>
        <h1 className="text-2xl font-bold">Pet Safety Guide</h1>
        <p className="text-sm text-white/80">
          Essential tips for lost & found situations
        </p>
      </div>
    </div>
    <div className="p-4 space-y-4">
      {categories.map((category, index) => (
        <div key={index} className="bg-white rounded-xl p-4 border shadow-sm">
          <h2 className="font-semibold text-lg mb-3">{category.title}</h2>

          <div className="space-y-2">
            {category.tips.map((tip, i) => {
              const isLink = tip.includes("Partner Directory");

              return (
                <Link
                  href={isLink ? "/partners" : "#"}
                  key={i}

                  className={`flex gap-2 items-start ${isLink ? "cursor-pointer" : ""
                    }`}
                >
                  <CheckCircle
                    className={`${category.color} mt-1`}
                    size={18}
                  />

                  <p
                    className={`text-sm ${isLink ? "text-emerald-600 underline" : "text-gray-600"
                      }`}
                  >
                    {tip}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl p-6 text-center space-y-4">
        <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-white/20">
          <Sparkles />
        </div>

        <p className="text-sm">
          Use The Fur Finder's AI matching to quickly find potential matches
          for lost or found pets
        </p>


      </div>
    </div>
  </div>)
}