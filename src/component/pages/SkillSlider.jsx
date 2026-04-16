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
  { name: 'WeCommerce', icon: MdOutlineDesignServices},
]



const SkillSlider = () => {
  return (
    <section className="w-full py-32 bg-white overflow-hidden border-y border-slate-50">
      <div className="container-custom mb-16 text-center">
         <span className='text-emerald-600 font-black tracking-[0.4em] uppercase text-[10px] mb-4 inline-block'>Infrastructure</span>
         <h2 className='text-4xl md:text-5xl font-black text-slate-900 tracking-tighter'>The Stack We Master.</h2>
      </div>

      <div className="flex gap-16 whitespace-nowrap animate-slide select-none">
        {}
        {[...skills, ...skills].map((skill, index) => {
          const Icon = skill.icon
          return (
            <div
              key={index}
              className="flex items-center gap-4 text-slate-200 group hover:text-emerald-500 transition-colors duration-500"
            >
              <Icon size={40} className="filter grayscale group-hover:grayscale-0 transition-all" />
              <span className='text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all'>{skill.name}</span>
            </div>
          )
        })}
      </div>

      <div className='container-custom mt-20'>
        <div className='flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto'>
            {skills.map((skill) => (
            <span 
                key={skill.name} 
                className='px-6 py-2.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100 hover:border-emerald-500/20 hover:text-emerald-600 transition-all cursor-default'
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
