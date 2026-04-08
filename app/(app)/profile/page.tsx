import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile - Pet Reunite AI',
};

export default function ProfilePage() {
  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-lg border border-neutral-200 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center text-white text-3xl font-bold">
              U
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">John Doe</h2>
              <p className="text-neutral-600">Member since March 2024</p>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue="John"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue="Doe"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Email</label>
              <input
                type="email"
                defaultValue="john@example.com"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Phone</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">City</label>
                <input
                  type="text"
                  placeholder="Brooklyn"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">State</label>
                <input
                  type="text"
                  placeholder="NY"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Bio</label>
              <textarea
                rows={4}
                placeholder="Tell us about yourself and your pets..."
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                className="rounded-lg bg-brand-600 text-white font-medium px-6 py-2 hover:bg-brand-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="rounded-lg border border-neutral-300 text-neutral-900 font-medium px-6 py-2 hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition">
                Privacy Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition">
                Notification Preferences
              </button>
              <button className="w-full text-left px-4 py-2 text-error hover:bg-error/10 rounded-lg transition">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
