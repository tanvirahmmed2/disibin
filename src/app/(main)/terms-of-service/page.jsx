import React from 'react';
import { dbQuery } from '@/lib/database/pg';
import { initLegalTables } from '@/lib/database/initLegalTables';

export const metadata = {
  title: 'Terms of Service | Disibin',
  description: 'Terms of Service for Disibin platforms and services.',
};

async function getTermsOfService() {
  try {
    await initLegalTables();
    const res = await dbQuery(`
      SELECT id, title, content, order_num, updated_at
      FROM terms_and_conditions
      WHERE is_published = true
      ORDER BY order_num ASC, id ASC
    `);
    return res.rows || [];
  } catch (error) {
    console.error('Error loading Terms of Service items:', error);
    return [];
  }
}

export default async function TermsOfServicePage() {
  const items = await getTermsOfService();

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 font-sans min-h-screen">
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
