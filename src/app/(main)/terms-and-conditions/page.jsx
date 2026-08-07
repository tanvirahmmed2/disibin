import React from 'react';
import { getPublicTermsOfService } from '@/lib/services/publicLegal';

export const metadata = {
  title: 'Terms of Service | Disibin',
  description: 'Terms of Service for Disibin platforms and services.',
};

export default async function TermsOfServicePage() {
  const items = await getPublicTermsOfService();

  return (
    <div className="w-full p-6 md:p-20 font-sans min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">
        Terms of Service
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
        <p className="text-slate-500 text-sm">No Terms of Service items available.</p>
      )}
    </div>
  );
}
