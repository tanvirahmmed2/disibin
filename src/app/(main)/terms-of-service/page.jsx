import React from 'react';
import { dbQuery } from '@/lib/database/pg';
import { initLegalTables } from '@/lib/database/initLegalTables';

export const metadata = {
  title: 'Terms of Service | Disibin',
  description: 'Review the legal terms and operational guidelines governing the use of Disibin platforms and services.',
};

async function getTermsOfService() {
  try {
    await initLegalTables();
    const res = await dbQuery(`
      SELECT id, title, content, updated_at
      FROM terms_and_conditions
      WHERE is_published = true
      ORDER BY id DESC
      LIMIT 1
    `);
    if (res.rows.length > 0) return res.rows[0];
  } catch (error) {
    console.error('Error loading Terms of Service:', error);
  }
  return null;
}

export default async function TermsOfServicePage() {
  const terms = await getTermsOfService();

  const title = terms?.title || 'Terms of Service';
  const content = terms?.content;
  const lastUpdated = terms?.updated_at
    ? new Date(terms.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="max-w-5xl mx-auto py-24 px-6 sm:px-10 min-h-screen">
      {/* Header */}
      <div className="mb-16 border-b border-slate-100 pb-10">
        <p className="uppercase tracking-[0.3em] text-xs text-sky-600 font-semibold mb-4">
          Legal Documentation
        </p>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
          {title}
        </h1>

        {lastUpdated && (
          <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        )}
      </div>

      {/* Content */}
      {content ? (
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed whitespace-pre-line text-base">
          {content}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">
            No Terms of Service document has been published yet.
          </p>
        </div>
      )}
    </div>
  );
}
