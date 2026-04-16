import React from 'react'
import Details from '@/component/pages/Details'

// Static meta configuration for now
export async function generateMetadata({ params }) {
  return {
    title: `${params?.title?.replace(/-/g, ' ')} | Disibin Services`,
  }
}

const Servicepage = ({ params }) => {
  const serviceTitle = params?.title?.replace(/-/g, ' ') || 'Service'

  // Normally we would fetch the service data right here from DB, using the slug/title.
  // We'll mock the data for Details to consume properly for the time being.
  const mockedServiceData = {
    title: serviceTitle,
    subtitle: `Explore comprehensive solutions regarding ${serviceTitle} customized directly for your enterprise.`,
    services: [
      { id: 1, title: 'Strategic Planning', description: 'Comprehensive roadmap for your service tier.', icon: '🎯' },
      { id: 2, title: 'Implementation', description: 'Flawless execution of the proposed plans.', icon: '⚡' },
      { id: 3, title: 'Growth Analysis', description: 'Data-driven analytics to maximize growth.', icon: '📈' }
    ],
    showSections: true,
    customSections: [
      {
        id: 'feat-1',
        title: `Enterprise ${serviceTitle}`,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop',
        sections: [
          { id: 's1', title: 'Dedicated Support', description: 'Round the clock SLA focused execution.' },
          { id: 's2', title: 'Advanced Scalability', description: 'Build systems that handle millions of requests.' },
        ]
      }
    ]
  }

  return (
    <div className='w-full min-h-screen pt-16'>
      {/* We utilize our Details component as the primary data renderer */}
      <Details 
        title={mockedServiceData.title}
        subtitle={mockedServiceData.subtitle}
        services={mockedServiceData.services}
        showSections={mockedServiceData.showSections}
        customSections={mockedServiceData.customSections}
      />
    </div>
  )
}

export default Servicepage
