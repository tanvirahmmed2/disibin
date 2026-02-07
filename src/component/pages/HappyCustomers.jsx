'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const dummyReviews = [
  {
    userName: "Tanvir Rahman",
    userImage: "https://randomuser.me/api/portraits/men/1.jpg",
    userImageId: "img_m_01",
    rating: 5,
    comment: "Excellent service! Highly recommended for anyone looking for quality. I was initially skeptical about the delivery timeline, but they exceeded all my expectations. The team was professional, the communication was clear throughout the process, and the final result was flawless. I will definitely be returning for future projects without any hesitation at all.",
    isApproved: true
  },
  {
    userName: "Rakib Hasan",
    userImage: "https://randomuser.me/api/portraits/men/2.jpg",
    userImageId: "img_m_02",
    rating: 4,
    comment: "Very smooth experience from start to finish. The interface was intuitive, and I didn't face any technical glitches while navigating the platform. Although there was a minor delay in the initial response from support, they made up for it with their helpfulness once we connected. Overall, a solid performance that I appreciate.",
    isApproved: true
  },
  {
    userName: "Sabbir Ahmed",
    userImage: "https://randomuser.me/api/portraits/men/3.jpg",
    userImageId: "img_m_03",
    rating: 5,
    comment: "Loved the quality of the work provided here! It is rare to find a service provider that pays such close attention to the small details. Everything was handled with extreme care and precision. I am genuinely impressed by the craftsmanship and the dedication shown by the entire team involved in this project.",
    isApproved: true
  },
  {
    userName: "Mehedi Hasan",
    userImage: "https://randomuser.me/api/portraits/men/4.jpg",
    userImageId: "img_m_04",
    rating: 3,
    comment: "Good but needs improvement in a few key areas. While the core product is functional and does what it promises, the user experience feels a bit outdated. I think adding more modern features and streamlining the checkout process would make a huge difference. It is okay for now, but there's definitely room for growth.",
    isApproved: true
  },
  {
    userName: "Fahim Chowdhury",
    userImage: "https://randomuser.me/api/portraits/men/5.jpg",
    userImageId: "img_m_05",
    rating: 4,
    comment: "Worth the money spent on this service. I compared several different options before choosing this one, and I believe I made the right decision for my budget. The balance between price and quality is quite fair. It isn't the cheapest option available, but the reliability you get in return makes it a winner.",
    isApproved: true
  },
  {
    userName: "Imran Hossain",
    userImage: "https://randomuser.me/api/portraits/men/6.jpg",
    userImageId: "img_m_06",
    rating: 5,
    comment: "Top-notch service that truly stands out in the industry! I have used many similar platforms in the past, but none have been as consistent as this one. The staff is knowledgeable and they really take the time to understand your specific needs before moving forward. I could not have asked for a better experience.",
    isApproved: true
  },
  {
    userName: "Arif Mahmud",
    userImage: "https://randomuser.me/api/portraits/men/7.jpg",
    userImageId: "img_m_07",
    rating: 4,
    comment: "Good value overall for the price point. The features included in the package are comprehensive and cover all the basics one might need. I did encounter one small bug during my usage, but the technical team was quick to address it. It is a dependable choice for professionals who need results quickly.",
    isApproved: true
  },
  {
    userName: "Hasan Ali",
    userImage: "https://randomuser.me/api/portraits/men/8.jpg",
    userImageId: "img_m_08",
    rating: 4,
    comment: "Satisfied with the service provided. The onboarding process was straightforward and I felt supported throughout my first week of using the tool. There are a few features I would like to see added in the future, such as better reporting tools, but for now, it serves its purpose perfectly for my business.",
    isApproved: true
  },
  {
    userName: "Nazmul Huda",
    userImage: "https://randomuser.me/api/portraits/men/9.jpg",
    userImageId: "img_m_09",
    rating: 5,
    comment: "Highly professional work delivered ahead of schedule. I was worried about meeting my own internal deadlines, but they handled the workload with ease. The communication was proactive, so I never had to wonder about the status of my order. This is exactly how a customer-centric business should operate in this day and age.",
    isApproved: true
  },
  {
    userName: "Saiful Islam",
    userImage: "https://randomuser.me/api/portraits/men/10.jpg",
    userImageId: "img_m_10",
    rating: 3,
    comment: "Average experience that didn't really blow me away. It works as advertised, but there were no 'wow' moments during the entire process. I think the customer support could be a bit more empathetic rather than just giving scripted responses. It is a decent middle-of-the-road option if you aren't looking for anything too fancy.",
    isApproved: true
  },
  {
    userName: "Mahmudul Hasan",
    userImage: "https://randomuser.me/api/portraits/men/11.jpg",
    userImageId: "img_m_11",
    rating: 5,
    comment: "Exceeded expectations in every possible way! I came in with a very complex request that I thought might be too difficult to handle, but the team took it in stride. They provided creative solutions I hadn't even considered. The final output was better than what I had originally envisioned. Truly a fantastic partnership.",
    isApproved: true
  },
  {
    userName: "Rashed Khan",
    userImage: "https://randomuser.me/api/portraits/men/12.jpg",
    userImageId: "img_m_12",
    rating: 4,
    comment: "Good response time from the support desk when I had questions. It makes a big difference when you know you can get help quickly if something goes wrong. The product itself is stable and does exactly what I need it to do for my daily workflow. I am happy with this purchase so far.",
    isApproved: true
  },
  {
    userName: "Aminul Islam",
    userImage: "https://randomuser.me/api/portraits/men/13.jpg",
    userImageId: "img_m_13",
    rating: 5,
    comment: "Very reliable service that I have come to trust over the last few months. Consistency is key for me, and they deliver every single time without fail. Whether it is a small task or a major project, the level of attention remains high. I would encourage anyone on the fence to give them a try.",
    isApproved: true
  },
  {
    userName: "Shakil Ahmed",
    userImage: "https://randomuser.me/api/portraits/men/14.jpg",
    userImageId: "img_m_14",
    rating: 4,
    comment: "Good experience overall, though I think the documentation could be a bit clearer for new users. I spent a little too much time trying to figure out some of the advanced settings on my own. However, once I got the hang of it, everything worked perfectly fine. It's a great tool once mastered.",
    isApproved: true
  },
  {
    userName: "Jahidul Islam",
    userImage: "https://randomuser.me/api/portraits/men/15.jpg",
    userImageId: "img_m_15",
    rating: 5,
    comment: "Will definitely recommend to my colleagues and friends! The level of expertise shown by the staff is truly remarkable. They solved a problem I had been struggling with for weeks in just a matter of hours. This kind of efficiency is hard to find, and I am very grateful for their help.",
    isApproved: true
  },

  {
    userName: "Nusrat Jahan",
    userImage: "https://randomuser.me/api/portraits/women/1.jpg",
    userImageId: "img_f_01",
    rating: 4,
    comment: "Very nice experience using this platform for the first time. The layout is clean and it didn't feel overwhelming like some other sites I have visited recently. I appreciate the transparency regarding pricing and terms. I will likely be a repeat customer in the future because of the positive first impression I received.",
    isApproved: true
  },
  {
    userName: "Anika Islam",
    userImage: "https://randomuser.me/api/portraits/women/2.jpg",
    userImageId: "img_f_02",
    rating: 5,
    comment: "Absolutely loved it! From the moment I signed up, I felt like a valued customer. The attention to detail in the packaging and the personalized note I received were such thoughtful touches. It is these small things that build long-term loyalty. I cannot wait to see what new features they roll out next year.",
    isApproved: true
  },
  {
    userName: "Sharmin Sultana",
    userImage: "https://randomuser.me/api/portraits/women/3.jpg",
    userImageId: "img_f_03",
    rating: 4,
    comment: "Smooth and easy process that saved me a lot of time. I am a busy person, so I appreciate services that don't require me to jump through hoops. Everything was automated and worked exactly as it should. I had a small question about billing, and it was resolved within thirty minutes. Great job by everyone.",
    isApproved: true
  },
  {
    userName: "Rima Akter",
    userImage: "https://randomuser.me/api/portraits/women/4.jpg",
    userImageId: "img_f_04",
    rating: 3,
    comment: "Decent service, but I was expecting a bit more based on the advertisements I saw online. The product is okay, but it lacks some of the premium feel that the marketing suggests. It is perfectly fine for basic use, but if you are a power user, you might find some of the limitations a bit frustrating.",
    isApproved: true
  },
  {
    userName: "Farzana Rahman",
    userImage: "https://randomuser.me/api/portraits/women/5.jpg",
    userImageId: "img_f_05",
    rating: 5,
    comment: "Great support team that went above and beyond to help me! I had a technical issue that was actually on my end, but they stayed on the line with me until it was completely fixed. Their patience and expertise are truly commendable. I feel very confident using this service knowing that help is always available.",
    isApproved: true
  }
];


const HappyCustomers = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % dummyReviews.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const review = dummyReviews[index]

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className="w-full p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">Our Happy Customers</h1>

      <div className="w-full relative  flex items-center justify-center">
          <motion.div
            key={review.userImageId}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className=" bg-emerald-200 w-full max-w-150 p-4 rounded-xl flex flex-col items-center gap-3 text-center"
          >
            <Image
              src={review.userImage}
              alt={review.userName}
              width={100}
              height={100}
              className="rounded-xl"
            />

            <p className="italic">"{ review.comment}"</p>
            <p className="font-bold">{review.userName}</p>
          </motion.div>
      </div>

      
    </div>
  )
}

export default HappyCustomers
