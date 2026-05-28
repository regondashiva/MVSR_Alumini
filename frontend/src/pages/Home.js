import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  UserGroupIcon,
  CalendarIcon,
  BriefcaseIcon,
  StarIcon,
  ArrowRightIcon,
  HeartIcon,
  SupportIcon,
  NewspaperIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  BadgeCheckIcon,
  LockClosedIcon,
  TrendingUpIcon,
  PhotographIcon
} from '@heroicons/react/outline';

const Home = () => {
  // 1. Slider Setup
  const sliderImages = [
    {
      url: '/Alumni.png',
      title: 'MVSR Alumni Community',
      description: 'Join our thriving network of 15,000+ alumni making an impact across the globe.'
    },
    {
      url: 'data:image/jpeg;base64,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',
      title: 'MVSR Engineering College',
      description: 'Lush green 45-acre campus in Nadergul, Hyderabad. Nurturing technical excellence since 1981.'
    },
    {
      url: 'https://mvsrec.edu.in/images/Events/SAMAVARTHAN2026.jpg',
      title: 'Samavarthan Annual Celebrations',
      description: 'Bringing students and alumni together to celebrate achievements, innovation, and college heritage.'
    },
    {
      url: 'https://mvsrec.edu.in/images/Events/ALUMNI-COLL_1.jpg',
      title: 'Annual Global Alumni Reunions',
      description: 'Reconnecting batches across generations to share experiences, mentor, and build lifelong networks.'
    },
    {
      url: 'https://mvsrec.edu.in/images/Events/IT-HACK-1.jpg',
      title: 'Hackathons & Technical Innovation',
      description: 'Empowering future engineers with active coding cultures, incubators, and cutting-edge labs.'
    },
    {
      url: 'https://mvsrec.edu.in/images/home_slider/2024-10-05_Dasara.jpg',
      title: 'Dasara & Traditional Celebrations',
      description: 'Cherishing cultural values, unity, and traditional festivals at MVSR campus.'
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  // 2. Statistics State
  const [stats] = useState([
    { label: 'Registered Alumni', value: '15,000+', icon: UserGroupIcon },
    { label: 'Years of Legacy', value: '45+', icon: TrendingUpIcon },
    { label: 'Industry Mentors', value: '850+', icon: BadgeCheckIcon },
    { label: 'Placement Rate', value: '95%', icon: AcademicCapIcon }
  ]);

  // 3. Departments Data
  const departments = [
    {
      id: 'cse',
      name: 'Computer Science & Engg.',
      short: 'CSE',
      graduates: '4,800+ Graduates',
      icon: AcademicCapIcon,
      color: 'from-blue-500 to-indigo-600',
      description: 'Software engineers, AI researchers, and tech pioneers leading globally.'
    },
    {
      id: 'ece',
      name: 'Electronics & Comm. Engg.',
      short: 'ECE',
      graduates: '4,200+ Graduates',
      icon: BookOpenIcon,
      color: 'from-sky-400 to-blue-600',
      description: 'VLSI specialists, telecom innovators, and embedded systems leads.'
    },
    {
      id: 'it',
      name: 'Information Technology',
      short: 'IT',
      graduates: '3,100+ Graduates',
      icon: SparklesIcon,
      color: 'from-cyan-500 to-blue-700',
      description: 'Cloud architects, cybersecurity analysts, and full stack web leaders.'
    },
    {
      id: 'eee',
      name: 'Electrical & Electronics',
      short: 'EEE',
      graduates: '2,600+ Graduates',
      icon: TrendingUpIcon,
      color: 'from-emerald-400 to-teal-600',
      description: 'Power grid experts, renewable energy designers, and automation leads.'
    },
    {
      id: 'mech',
      name: 'Mechanical & Auto Engg.',
      short: 'MECH',
      graduates: '3,800+ Graduates',
      icon: BriefcaseIcon,
      color: 'from-amber-500 to-orange-600',
      description: 'Robotics pioneers, automotive designers, and aerospace consultants.'
    },
    {
      id: 'civil',
      name: 'Civil Engineering',
      short: 'CIVIL',
      graduates: '1,900+ Graduates',
      icon: SupportIcon,
      color: 'from-stone-400 to-neutral-600',
      description: 'Structural builders, urban planners, and infrastructure consultants.'
    },
    {
      id: 'mba',
      name: 'Management Studies',
      short: 'MBA',
      graduates: '1,200+ Graduates',
      icon: StarIcon,
      color: 'from-purple-500 to-indigo-700',
      description: 'Corporate directors, financial consultants, and startup founders.'
    }
  ];

  // 4. Newsroom Feed
  const newsList = [
    {
      id: 1,
      tag: 'Placements',
      date: 'May 20, 2026',
      title: 'MVSR Placements Record High in 2026 Drive',
      content: 'Over 95% of graduates from CSE, IT, and ECE branches have secured placements with leading tech firms including Cisco, Microsoft, and Oracle. Average packages saw a substantial 22% increase year-on-year.',
      image: 'https://mvsrec.edu.in/images/Events/PLC-CSE.jpg'
    },
    {
      id: 2,
      tag: 'Campus Pride',
      date: 'April 28, 2026',
      title: 'Samavarthan Annual Day Celebrates Innovation',
      content: 'The Samavarthan 2026 festival brought together students, distinguished academic leaders, and distinguished alumni. Over 50 student projects across AI, robotics, and clean energy were showcased at the campus expo.',
      image: 'https://mvsrec.edu.in/images/Events/SAMAVARTHAN2026.jpg'
    }
  ];

  // 5. Events List
  const eventsList = [
    {
      id: 1,
      month: 'JUL',
      day: '15',
      title: 'Silver Jubilee Reunion: Class of 2001',
      time: '10:00 AM - 05:00 PM',
      location: 'Main Campus OAT, Nadergul'
    },
    {
      id: 2,
      month: 'OCT',
      day: '24',
      title: 'Alumni Mentorship Boot Camp 2026',
      time: '02:00 PM - 06:00 PM',
      location: 'CSE Seminar Hall & Virtual'
    },
    {
      id: 3,
      month: 'DEC',
      day: '19',
      title: 'Global MVSR Annual Alumni Meet',
      time: '06:30 PM Onwards',
      location: 'Hyderabad Marriott & Convention'
    }
  ];

  // 6. Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Niranjan Kumar',
      batch: '1998',
      branch: 'CSE',
      role: 'Director of Engineering',
      company: 'Google',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote: 'MVSR gave me the structural mindset and strong fundamental core. Reconnecting with the alumni portal has allowed me to mentor brilliant juniors.'
    },
    {
      id: 2,
      name: 'Dr. Radhika Reddy',
      batch: '2005',
      branch: 'ECE',
      role: 'Principal Research Scientist',
      company: 'Intel Corp',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote: 'The legacy of MVSR graduates is vast. The official alumni directory keeps us united and provides phenomenal career referrals for students.'
    },
    {
      id: 3,
      name: 'Sandeep Sharma',
      batch: '2012',
      branch: 'IT',
      role: 'Founder & CEO',
      company: 'ApexScale AI',
      image: 'https://randomuser.me/api/portraits/men/81.jpg',
      quote: 'My first funding round and core advisory board came directly from the MVSR alumni network. The bond we share as MVSRians is exceptionally strong.'
    }
  ];

  // 7. Latest Members List
  const recentMembers = [
    { name: 'K. Sai Kiran', batch: '2024', branch: 'CSE', company: 'Cisco' },
    { name: 'Ananya Rao', batch: '2023', branch: 'ECE', company: 'Deloitte' },
    { name: 'Mohammad Ali', batch: '2021', branch: 'IT', company: 'Salesforce' },
    { name: 'P. Sneha', batch: '2025', branch: 'EEE', company: 'TCS' },
    { name: 'Vikram Adithya', batch: '2020', branch: 'MECH', company: 'L&T Technology' },
    { name: 'Ritu Varma', batch: '2022', branch: 'CIVIL', company: 'GMR Group' }
  ];

  // 8. Gallery Highlights
  const galleryThumbnails = [
    { url: 'https://mvsrec.edu.in/images/home_slider/2025-rangoli-1.jpg', caption: 'Rangoli Festival' },
    { url: 'https://mvsrec.edu.in/images/Events/ATHLEMA-25-COLLL.jpg', caption: 'ATHLEMA Sports Fest' },
    { url: 'https://mvsrec.edu.in/images/Events/IT-HACK-1.jpg', caption: 'Hackathons' },
    { url: 'https://mvsrec.edu.in/images/Events/SAM-E8_1.jpg', caption: 'Annual Cultural Night' },
    { url: 'https://mvsrec.edu.in/images/Events/AI100K.jpg', caption: 'AI & ML Workshops' },
    { url: 'https://mvsrec.edu.in/images/Events/NCC-YEP.jpg', caption: 'NCC Collective' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">

      {/* -------------------- ROW 1: HEADER & SLIDER GRID -------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

          {/* Main Photo Slider (70% Width) */}
          <div className="lg:col-span-7 relative bg-black rounded-2xl overflow-hidden shadow-2xl h-[320px] md:h-[460px] group border border-gray-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${sliderImages[activeSlide].url})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  objectFit: 'contain'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Chevrons */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-mvsr-600 text-white p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md border border-white/10 z-10"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-mvsr-600 text-white p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md border border-white/10 z-10"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            {/* Caption Text Box */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-mvsr-600/90 text-white border border-mvsr-400 mb-3 uppercase tracking-wider backdrop-blur-sm shadow-sm animate-pulse">
                Campus Highlights
              </span>
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight drop-shadow-md mb-2">
                {sliderImages[activeSlide].title}
              </h2>
              <p className="text-sm md:text-base text-gray-200 drop-shadow max-w-2xl line-clamp-2 md:line-clamp-none">
                {sliderImages[activeSlide].description}
              </p>
            </div>

            {/* Dot Bullet Indicators */}
            <div className="absolute top-4 right-4 flex space-x-2 z-10 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              {sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-6 bg-mvsr-500' : 'w-2.5 bg-white/50 hover:bg-white'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Join Portal Widget (30% Width) */}
          <div className="lg:col-span-3 bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl p-6 shadow-2xl flex flex-col justify-between border border-slate-800 relative overflow-hidden text-white">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-mvsr-500/10 rounded-full blur-3xl"></div>

            {/* Header branding */}
            <div>
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-11 h-11 bg-mvsr-500/20 rounded-xl flex items-center justify-center border border-mvsr-500/30">
                  <AcademicCapIcon className="h-6 w-6 text-mvsr-400" />
                </div>
                <div>
                  <h3 className="font-extrabold tracking-wide text-lg text-slate-100">MVSR ASSOCIATION</h3>
                  <p className="text-xs text-mvsr-400/90 font-medium">Official Alumni Network</p>
                </div>
              </div>

              <h4 className="text-lg font-bold mb-3 leading-snug">Connect with Your Batchmates</h4>
              <p className="text-sm text-slate-300/95 leading-relaxed mb-6">
                Be a part of a vibrant 15,000+ member engineering alumni network spanning 4 decades. Reconnect, share jobs, mentor juniors, and discover your colleagues worldwide.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3.5 z-10">
              <Link
                to="/register"
                className="w-full py-3 bg-mvsr-600 hover:bg-mvsr-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-mvsr-600/30 hover:scale-[1.01]"
              >
                Join Network Now
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="w-full py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
              >
                <LockClosedIcon className="mr-2 h-4 w-4 text-mvsr-400" />
                Member Login
              </Link>
            </div>

            {/* Micro stats banner */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Established 1981</span>
              <span className="flex items-center text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Active Network
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* -------------------- STATS ROW -------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center space-x-4 p-2">
              <div className="w-12 h-12 bg-mvsr-50 rounded-xl flex items-center justify-center text-mvsr-600 shrink-0">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs md:text-sm font-semibold text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------- ROW 2: NEWSROOM & EVENTS GRID -------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

          {/* Newsroom (70% Width) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
              <h3 className="text-2xl font-extrabold text-slate-900 flex items-center">
                <NewspaperIcon className="h-7 w-7 text-mvsr-600 mr-2.5" />
                Alumni Newsroom
              </h3>
              <Link to="/news" className="text-sm font-bold text-mvsr-600 hover:text-mvsr-700 flex items-center transition-colors">
                View All News
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsList.map((news) => (
                <div key={news.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-mvsr-600/90 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                      {news.tag}
                    </span>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-semibold mb-2 block">{news.date}</span>
                      <h4 className="font-extrabold text-slate-900 leading-snug group-hover:text-mvsr-600 transition-colors mb-2.5">
                        {news.title}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                        {news.content}
                      </p>
                    </div>
                    <Link to="/news" className="text-sm font-bold text-mvsr-600 hover:text-mvsr-700 flex items-center mt-2 group-hover:translate-x-1 transition-transform">
                      Read Complete Article
                      <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events (30% Width) */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
              <h3 className="text-2xl font-extrabold text-slate-900 flex items-center">
                <CalendarIcon className="h-7 w-7 text-mvsr-600 mr-2.5" />
                Events & Reunions
              </h3>
              <Link to="/events" className="text-sm font-bold text-mvsr-600 hover:text-mvsr-700 flex items-center transition-colors">
                All Events
              </Link>
            </div>

            <div className="space-y-4">
              {eventsList.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start space-x-4 hover:shadow-md hover:border-mvsr-100 transition-all">
                  {/* Calendar Widget Box */}
                  <div className="bg-mvsr-50 text-mvsr-700 rounded-xl px-3 py-2 text-center shrink-0 w-14 font-extrabold border border-mvsr-100">
                    <span className="block text-xs uppercase tracking-wider">{event.month}</span>
                    <span className="block text-xl leading-none font-black">{event.day}</span>
                  </div>
                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1 hover:text-mvsr-600 transition-colors line-clamp-2">
                      {event.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-semibold mb-1">{event.time}</p>
                    <p className="text-xs text-gray-500 font-medium truncate">{event.location}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick RSVP CTA card */}
            <div className="mt-5 bg-gradient-to-br from-mvsr-500 to-indigo-600 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <h4 className="font-bold mb-1">Host a Reunion?</h4>
              <p className="text-xs text-white/80 leading-relaxed mb-3.5">Reunite your batch! Contact the alumni relation cell to coordinate.</p>
              <Link to="/contact" className="inline-flex items-center text-xs bg-white text-mvsr-600 font-extrabold px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-100 transition-colors">
                Contact Cell
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* -------------------- ROW 3: THREE ENGAGEMENT PILLARS -------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Three Pillars of Engagement</h3>
          <p className="text-base text-gray-500 max-w-xl mx-auto">Actively give back, guide the next generation, or secure career leaps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[350px] relative group">
            <div className="h-1/2 relative bg-black overflow-hidden">
              <img
                src="https://mvsrec.edu.in/images/Alumni/Nagaraju-alumni.jpg"
                alt="Mentorship"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-white">
                <SupportIcon className="h-6 w-6 text-mvsr-400" />
                <span className="font-extrabold uppercase text-xs tracking-wider">Volunteer</span>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-slate-950 mb-1.5">Mentorship Program</h4>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                  Become a guide for final-year students. Offer career path alignment, conduct mock interviews, or review research papers.
                </p>
              </div>
              <Link to="/alumni" className="text-sm font-bold text-mvsr-600 hover:text-mvsr-700 flex items-center transition-colors">
                Become a Mentor
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[350px] relative group">
            <div className="h-1/2 relative bg-black overflow-hidden">
              <img
                src="https://mvsrec.edu.in/images/Events/PLC-CSE.jpg"
                alt="Career opportunities"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-white">
                <BriefcaseIcon className="h-6 w-6 text-mvsr-400" />
                <span className="font-extrabold uppercase text-xs tracking-wider">Careers</span>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-slate-950 mb-1.5">Career & Referral Center</h4>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                  Post active openings in your enterprise, apply for lateral positions posted by peers, and seek referrals at global corporations.
                </p>
              </div>
              <Link to="/careers" className="text-sm font-bold text-mvsr-600 hover:text-mvsr-700 flex items-center transition-colors">
                Post or Apply for Jobs
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[350px] relative group">
            <div className="h-1/2 relative bg-black overflow-hidden">
              <img
                src="https://mvsrec.edu.in/images/home_slider/2025-rangoli-1.jpg"
                alt="Donation support"
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-white">
                <HeartIcon className="h-6 w-6 text-mvsr-400" />
                <span className="font-extrabold uppercase text-xs tracking-wider">Support</span>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-slate-950 mb-1.5">Student Foundation Fund</h4>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                  Directly fund student innovation prototypes, research publications, merit-based scholarships, and modernization of laboratories.
                </p>
              </div>
              <Link to="/contact" className="text-sm font-bold text-mvsr-600 hover:text-mvsr-700 flex items-center transition-colors">
                Support Foundation
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* -------------------- ROW 4: JOIN ALUMNI OF YOUR DEPARTMENT -------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold bg-mvsr-50 text-mvsr-600 px-3 py-1.5 rounded-full uppercase tracking-wider border border-mvsr-100">
            Find Your Tribe
          </span>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-3 mb-2">Join Alumni of Your Department</h3>
          <p className="text-base text-gray-500 max-w-xl mx-auto">Explore network branches by departmental specializations and reconnect with batch engineers.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <Link
              to="/alumni"
              key={dept.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                  <dept.icon className="h-6 w-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 leading-tight mb-2 group-hover:text-mvsr-600 transition-colors">
                  {dept.name}
                </h4>
                <p className="text-xs text-gray-400 font-semibold mb-3">{dept.graduates}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {dept.description}
                </p>
              </div>
              <span className="text-xs font-bold text-mvsr-600 flex items-center uppercase tracking-wider group-hover:translate-x-1.5 transition-transform mt-2">
                Explore Batch
                <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* -------------------- ROW 5: MEMORIES PHOTO GALLERY -------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex items-center justify-between mb-8 pb-2 border-b border-gray-200">
          <h3 className="text-2xl font-extrabold text-slate-900 flex items-center">
            <PhotographIcon className="h-7 w-7 text-mvsr-600 mr-2.5" />
            Nostalgic Campus Memories
          </h3>
          <Link to="/gallery" className="text-sm font-bold text-mvsr-600 hover:text-mvsr-700 flex items-center transition-colors">
            Explore Full Gallery
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {galleryThumbnails.map((photo, index) => (
            <Link
              to="/gallery"
              key={index}
              className="group relative rounded-xl overflow-hidden shadow-sm aspect-square bg-gray-100 border border-gray-200 block"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                <div>
                  <PhotographIcon className="h-5 w-5 text-white mx-auto mb-1" />
                  <p className="text-white text-xs font-bold leading-tight">{photo.caption}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* -------------------- ROW 6: LATEST REGISTERED MEMBERS -------------------- */}
      <div className="bg-slate-900 text-white py-10 mt-20 overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-mvsr-950/20 via-transparent to-mvsr-950/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800/80">
            <h4 className="font-extrabold text-lg text-slate-100 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-2.5 animate-pulse"></span>
              Recently Joined MVSRian Graduates
            </h4>
            <span className="text-xs font-semibold text-slate-400">Class of 1985 - 2025</span>
          </div>

          {/* Scrolling ticker track */}
          <div className="relative">
            <div className="flex space-x-6 overflow-x-auto pb-2 scrollbar-hide select-none scroll-smooth">
              {recentMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/70 hover:bg-slate-800 rounded-xl px-5 py-4 border border-slate-800 shrink-0 w-60 flex items-center space-x-3.5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-mvsr-550/10 text-mvsr-400 flex items-center justify-center font-black text-sm border border-mvsr-500/20 shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-sm text-slate-100 truncate leading-snug">{member.name}</h5>
                    <p className="text-xs text-mvsr-400 font-semibold mb-0.5">
                      Batch of {member.batch} • {member.branch}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      At {member.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* -------------------- TESTIMONIALS SECTION -------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-2">What Our Alumni Say</h3>
          <p className="text-base text-gray-500 max-w-xl mx-auto">Real voices from MVSR engineering alumni leading tech and science across the globe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div key={test.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
              <div className="absolute top-6 right-6 text-6xl text-mvsr-100 font-serif leading-none select-none">“</div>
              <div className="relative">
                <p className="text-sm md:text-base text-gray-500 italic leading-relaxed mb-6">
                  "{test.quote}"
                </p>
              </div>
              <div className="flex items-center space-x-3.5 pt-4 border-t border-gray-100">
                <img
                  src={test.image}
                  alt={test.name}
                  className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-inner shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate leading-snug">{test.name}</h4>
                  <p className="text-xs text-gray-400 font-semibold">{test.role} at {test.company}</p>
                  <p className="text-[10px] text-mvsr-600 font-bold uppercase tracking-wider">Class of {test.batch} ({test.branch})</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------- ROW 7: MOBILE APP & CTA OVERLAY -------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-mvsr-800 to-indigo-900 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-mvsr-700/30">
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-mvsr-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-14 items-center">

            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-mvsr-300 border border-white/10 mb-4 uppercase tracking-wider backdrop-blur-sm">
                Official Network App
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                Stay Connected on the Go!
              </h3>
              <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                Download the official MVSR Alumni App on iOS & Android to search nearby alumni on maps, chat with batchmates, browse instant job referrals, and get invitations to exclusive reunions.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-black transition-colors px-5 py-3 rounded-xl border border-slate-800 flex items-center space-x-3.5 shadow-md shadow-slate-950/20 hover:scale-[1.01]"
                >
                  <img
                    src="https://vaave.s3.amazonaws.com/assets/images/google-store-btn.png"
                    alt="Get it on Google Play"
                    className="h-7 object-contain"
                  />
                </a>
                <a
                  href="https://apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-black transition-colors px-5 py-3 rounded-xl border border-slate-800 flex items-center space-x-3.5 shadow-md shadow-slate-950/20 hover:scale-[1.01]"
                >
                  <img
                    src="https://vaave.s3.amazonaws.com/assets/images/apple-store-btn.png"
                    alt="Download on the App Store"
                    className="h-7 object-contain"
                  />
                </a>
              </div>
            </div>

            <div className="flex justify-center relative lg:pt-0 pt-6">
              {/* Decorative app Mockup graphics */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full backdrop-blur-sm relative overflow-hidden">
                <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center space-x-2"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-[10px] text-white/50 tracking-wider">mvsr-alumni.apk</span>
                </div>
                <div className="space-y-3.5">
                  <div className="h-7 bg-white/10 rounded-lg animate-pulse w-3/4"></div>
                  <div className="h-20 bg-white/5 rounded-xl border border-white/10 flex items-center p-3.5 space-x-3">
                    <div className="w-9 h-9 rounded-full bg-mvsr-500/20 text-mvsr-400 flex items-center justify-center font-bold">JD</div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-white/15 rounded w-1/3"></div>
                      <div className="h-2.5 bg-white/10 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-10 bg-mvsr-600/40 rounded-xl border border-mvsr-600/30"></div>
                    <div className="h-10 bg-white/10 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
