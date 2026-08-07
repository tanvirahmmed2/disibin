import React from 'react';
import { getPublicPrivacyPolicy } from '@/lib/services/publicLegal';

export const metadata = {
  title: 'Privacy Policy | Disibin',
  description: 'Privacy Policy of Disibin platforms and services.',
};

export default async function PrivacyPolicyPage() {
  const items = await getPublicPrivacyPolicy();

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 font-sans min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">
        Privacy Policy
      </h1>

      {items.length > 0 ? (
        <div className="space-y-8">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">
                {item.title}
              </h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No Privacy Policy items available.</p>
      )}
    </div>
  );
}
