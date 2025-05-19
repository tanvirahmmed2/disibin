import React from 'react'

export default function About(props) {
  return (
    
    <div className='w-full h-auto flex flex-col items-center justify-center px-12 py-8 mb-8 gap-4 text-center'>
      <p> <strong className='font-bold text-2xl'>{props.title}</strong>, is a dynamic and forward-thinking digital agency committed to transforming ideas into impactful digital experiences. We provide end-to-end services that blend strategy, creativity, and technology to help businesses thrive in the modern digital landscape.</p>
      
      <p className='font-bold'>Our core specialties include:</p>

      <div className='w-[60%] min-h-[60vh] flex flex-col items-start gap-2'>

        <p className='flex flex-col items-start text-start'>
          <strong>UI/UX Design:</strong>
          We design intuitive, user-centered interfaces that are not only visually engaging but also enhance usabity and drive user satisfaction. Every element we create is tailored to provide seamless interaction and elevate the customer experience.
        </p>


        <p className='flex flex-col items-start text-start'>
          <strong>Front-End Web Development: </strong>
          Using the latest technologies such as React.js, Tailwind CSS, and modern frameworks, we bring your designs to pfe with responsive, high-performance websites that look great on any device.
        </p>


        <p className='flex flex-col items-start text-start'>
          <strong>Back-End Web Development:</strong>
          We build robust and scalable server-side appcations that power your website or platform. From databases to APIs, our back-end solutions are built for reabity, security, and future growth.
        </p>


        <p className='flex flex-col items-start text-start'>
          <strong>Full-Stack Web Development:</strong>
          As full-stack experts, we handle every aspect of your digital product—from front-end visuals to back-end logic—ensuring complete integration, efficiency, and control.
        </p>


        <p className='flex flex-col items-start text-start'>
          <strong>Branding & Identity:</strong>
          We help businesses define who they are with strong brand identities. Through custom logo design, visual systems, and brand strategy, we ensure your brand is memorable, cohesive, and agned with your vision.
        </p>


        <p className='flex flex-col items-start text-start'>
          <strong>Free Consultation: </strong>
          Not sure where to start? We offer free consultations to help you explore your ideas, get expert feedback, and identify the right digital solutions—no cost, no pressure.
        </p>

      </div>
      <p className='mt-8'>Our mission is to empower businesses—big or small—to succeed onne. We believe in honest communication, long-term partnerships, and devering measurable results. Whether you’re launching a new product, redesigning your website, or building a brand from scratch, our team is here to make it happen.</p>
      <p>Let’s collaborate and bring your vision to fe with creativity, code, and clarity.</p>

    </div>
  )
}
