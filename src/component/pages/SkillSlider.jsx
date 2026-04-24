'use client'
import React from 'react'
import { DiIllustrator } from 'react-icons/di'
import { MdOutlineDesignServices } from 'react-icons/md'
import { RiBlenderLine, RiGithubLine, RiVercelLine, RiWordpressLine } from 'react-icons/ri'
import {
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiPostman,
  SiHtml5,
  SiCss3,
  SiC,
  SiCplusplus,
  SiPostgresql,
  SiFigma,
} from 'react-icons/si'

const skills = [
  { name: 'HTML', icon: SiHtml5 },
  { name: 'CSS', icon: SiCss3 },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'React js', icon: SiReact },
  { name: 'React Native', icon: SiReact },
  { name: 'Next.js', icon: SiNextdotjs },
  { name: 'Node.js', icon: SiNodedotjs },
  { name: 'Express.js', icon: SiExpress },
  { name: 'MongoDB', icon: SiMongodb },
  { name: 'Tailwind CSS', icon: SiTailwindcss },
  { name: 'REST API', icon: SiPostman },
  { name: 'C', icon: SiC },
  { name: 'C++', icon: SiCplusplus },
  { name: 'postgreSQL', icon: SiPostgresql },
  { name: 'Wordpress', icon: RiWordpressLine },
  { name: 'Illustrator', icon: DiIllustrator },
  { name: 'Figma', icon: SiFigma },
  { name: 'Vercel', icon: RiVercelLine },
  { name: 'Render', icon: RiBlenderLine},
  { name: 'Github', icon: RiGithubLine},
  { name: 'WooCommerce', icon: MdOutlineDesignServices},
]



const SkillSlider = () => {
  return (
    <section className="w-full py-24 bg-emerald-500 overflow-hidden border-y border-white/10">
      <div className="container-custom mb-12 text-center">
         <span className='text-white/80 font-semibold tracking-[0.4em] uppercase text-[10px] mb-4 inline-block'>Infrastructure</span>
         <h2 className='text-4xl md:text-5xl font-bold text-white tracking-tighter'>The Stack We Master.</h2>
      </div>

      <div className="flex gap-16 whitespace-nowrap animate-slide select-none">
        
        {[...skills, ...skills].map((skill, index) => {
          const Icon = skill.icon
          return (
            <div
              key={`${skill.name}-${index}`}
              className="flex items-center gap-4 text-white/40 group hover:text-white transition-colors duration-500"
            >
              <Icon size={40} className="filter grayscale group-hover:grayscale-0 transition-all" />
              <span className='text-[10px] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all'>{skill.name}</span>
            </div>
          )
        })}
      </div>

      <div className='container-custom mt-16'>
        <div className='flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto'>
            {skills.map((skill) => (
            <span 
                key={skill.name} 
                className='px-5 py-2 bg-white/5 text-white/50 text-[9px] font-semibold uppercase tracking-widest rounded-full border border-white/10 hover:border-white/20 hover:text-white transition-all cursor-default'
            >
                {skill.name}
            </span>
            ))}
        </div>
      </div>
    </section>
  )
}


export default SkillSlider
