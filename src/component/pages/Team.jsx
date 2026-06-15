import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi'
const Team = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team')
        const data = await res.json()
        if (data.success) {
          setTeamMembers(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch team:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  if (loading) {
    return <div className="w-full py-20 text-center font-poppins text-slate-500">Loading team...</div>
  }

  if (teamMembers.length === 0) {
    return null
  }

  return (
    <section className="w-full py-20 px-4 my-4 rounded-xl shadow-xl shadow-slate-100 bg-white relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 font-poppins block mb-3">
            Our People
          </span>
          <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight mb-4">
            Meet the <span className="gradient-text">Minds</span> Behind the Tech
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-poppins">
            A diverse team of engineers, designers, and strategists committed to pushing the boundaries of what's possible in enterprise software.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.member_id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg shadow-sky-100 mb-6 bg-slate-100">
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                )}

                {/* Social overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-sky-500 hover:text-white transition-colors duration-300">
                    <FiLinkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-sky-500 hover:text-white transition-colors duration-300">
                    <FiTwitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 hover:bg-sky-500 hover:text-white transition-colors duration-300">
                    <FiGithub className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <h3 className="font-poppins text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-sm font-semibold text-sky-600 font-poppins">{member.post}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Team