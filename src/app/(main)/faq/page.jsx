import FAQ from '@/component/public/pages/FAQ'
import React from 'react'

export const metadata = {
  title: 'FAQ | Frequently Asked Questions - Disibin',
  description: 'Find answers to common questions about Disibin software systems, architecture, database safety, security, and web management services.',
};

export default function FAQPage() {
  return (
    <main className="w-full min-h-screen pt-8 pb-20">
      <FAQ />
    </main>
  )
}
