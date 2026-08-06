import React from 'react';
import { dbQuery } from '@/lib/database/pg';
import { initLegalTables } from '@/lib/database/initLegalTables';

export const metadata = {
  title: 'Refund Policy | Disibin',
  description: 'Refund Policy for Disibin platforms and services.',
};

async function getRefundPolicies() {
  try {
    await initLegalTables();
    const res = await dbQuery(`
      SELECT id, title, content, order_num, updated_at
      FROM refund_conditions
      WHERE is_published = true
      ORDER BY order_num ASC, id ASC
    `);
    return res.rows || [];
  } catch (error) {
    console.error('Error loading Refund Policy items:', error);
    return [];
  }
}

export default async function RefundPolicyPage() {
  const items = await getRefundPolicies();

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 font-sans min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">
        Refund Policy
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
        <p className="text-slate-500 text-sm">No Refund Policy items available.</p>
      )}
    </div>
  );
}
