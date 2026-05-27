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
      url: 'https://mvsrec.edu.in/images/home_slider/IMG_20251120_120402893_HDR_AE.jpg',
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
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${sliderImages[activeSlide].url})` }}
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
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeSlide ? 'w-6 bg-mvsr-500' : 'w-2.5 bg-white/50 hover:bg-white'
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
                  <div className="flex items-center space-x-2">
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
