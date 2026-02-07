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
    <div className="w-full overflow-hidden  bg-linear-to-br select-none  from-teal-900 to-teal-700 text-white  p-8">
      <div className="flex gap-10 whitespace-nowrap animate-skill-slide">

        {skills.map((skill, index) => {
          const Icon = skill.icon
          return (
            <div
              key={index}
              className="flex items-center gap-2 text-lg font-semibold  uppercase"
            >
              <Icon className="text-6xl text-white/50 hover:scale-105 cursor-pointer" />
              <span className='opacity-20'>{skill.name}</span>
            </div>
          )
        })}

        {skills.map((skill, index) => {
          const Icon = skill.icon
          return (
            <div
              key={`dup-${index}`}
              className="flex items-center gap-2 text-lg font-semibold  uppercase"
            >
              <Icon className="text-6xl text-white/50 hover:scale-105 cursor-pointer" />
              <span className='opacity-20'>{skill.name}</span>
            </div>
          )
        })}

      </div>
      <div className='w-full max-w-3xl mx-auto mt-12 flex flex-wrap items-center justify-center gap-4'>
        {
        skills.map((skill)=>(
          <p key={skill.name} className='px-4 p-1 bg-white/10 rounded-full hover:scale-105'>{skill.name}</p>
        ))
      }
      </div>
    </div>
  )
}

export default SkillSlider
