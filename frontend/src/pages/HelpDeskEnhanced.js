import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PhoneIcon, 
  LocationMarkerIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  AcademicCapIcon,
  OfficeBuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  ClockIcon,
  XIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const HelpDeskEnhanced = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobRole: '',
    jobDescription: '',
    requiredSkills: '',
    contactDetails: '',
    visitDate: '',
    visitPurpose: '',
    mentorshipAreas: [],
    transcriptRequest: {
      graduationYear: '',
      degree: '',
      branch: '',
      purpose: ''
    },
    volunteerAreas: [],
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const services = [
    {
      id: 'contact',
      name: 'General Contact',
      icon: PhoneIcon,
      description: 'Get in touch with the alumni association',
      color: 'blue'
    },
    {
      id: 'campus-visit',
      name: 'Campus Visit',
      icon: LocationMarkerIcon,
      description: 'Schedule a visit to the campus',
      color: 'green'
    },
    {
      id: 'recruit',
      name: 'Wish to Recruit',
      icon: BriefcaseIcon,
      description: 'Recruit our talented alumni and students',
      color: 'purple'
    },
    {
      id: 'volunteer',
      name: 'Volunteer',
      icon: UserGroupIcon,
      description: 'Contribute to alumni association activities',
      color: 'orange'
    },
    {
      id: 'mentor',
      name: 'Be a Mentor',
      icon: AcademicCapIcon,
      description: 'Guide and mentor current students',
      color: 'indigo'
    },
    {
      id: 'transcript',
      name: 'Request Transcripts',
      icon: DocumentTextIcon,
      description: 'Get official academic transcripts',
      color: 'red'
    }
  ];

  const mentorshipAreas = [
    'Resume Review',
    'Interview Preparation',
    'Career Guidance',
    'Technical Skills',
    'Soft Skills',
    'Industry Insights',
    'Networking',
    'Job Search'
  ];

  const volunteerAreas = [
    'Event Organization',
    'Alumni Meetup',
    'Career Fair',
    'Guest Lectures',
    'Workshop Conducting',
    'Mentorship Programs',
    'Fundraising',
    'Website Management',
    'Social Media',
    'Content Creation'
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowForm(true);
    setSubmitStatus('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      jobRole: '',
      jobDescription: '',
      requiredSkills: '',
      contactDetails: '',
      visitDate: '',
      visitPurpose: '',
      mentorshipAreas: [],
      transcriptRequest: {
        graduationYear: '',
        degree: '',
        branch: '',
        purpose: ''
      },
      volunteerAreas: [],
      message: ''
    });
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleMentorshipAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      mentorshipAreas: prev.mentorshipAreas.includes(area)
        ? prev.mentorshipAreas.filter(a => a !== area)
        : [...prev.mentorshipAreas, area]
    }));
  };

  const handleVolunteerAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      volunteerAreas: prev.volunteerAreas.includes(area)
        ? prev.volunteerAreas.filter(a => a !== area)
        : [...prev.volunteerAreas, area]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = '/api/helpdesk/submit';
      const payload = {
        ...formData,
        service: selectedService,
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email
      };

      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        toast.success('Your request has been submitted successfully!');
        setTimeout(() => {
          setShowForm(false);
          setSelectedService('');
          setSubmitStatus('');
        }, 2000);
      } else {
        setSubmitStatus('error');
        toast.error(data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting help desk request:', error);
      setSubmitStatus('error');
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    red: 'bg-red-50 border-red-200 text-red-800'
  };

  const renderForm = () => {
    const service = services.find(s => s.id === selectedService);

    return (
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClasses[service.color]}`}>
              <service.icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
            />
          </div>

          {selectedService === 'recruit' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role *
                </label>
                <input
                  type="text"
                  value={formData.jobRole}
                  onChange={(e) => handleInputChange('jobRole', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills *
                </label>
                <input
                  type="text"
                  value={formData.requiredSkills}
                  onChange={(e) => handleInputChange('requiredSkills', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Details *
                </label>
                <input
                  type="text"
                  value={formData.contactDetails}
                  onChange={(e) => handleInputChange('contactDetails', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  required
                />
              </div>
            </>
          )}

          {selectedService === 'campus-visit' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Visit Date *
                </label>
                <input
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) => handleInputChange('visitDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Visit *
                </label>
                <textarea
                  value={formData.visitPurpose}
                  onChange={(e) => handleInputChange('visitPurpose', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  rows={4}
                  required
                />
              </div>
            </>
          )}

          {selectedService === 'mentor' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Mentoring Areas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {mentorshipAreas.map((area) => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.mentorshipAreas.includes(area)}
                        onChange={() => handleMentorshipAreaToggle(area)}
                        className="h-4 w-4 text-mvsr-600 focus:ring-mvsr-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedService === 'volunteer' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Interest
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {volunteerAreas.map((area) => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.volunteerAreas.includes(area)}
                        onChange={() => handleVolunteerAreaToggle(area)}
                        className="h-4 w-4 text-mvsr-600 focus:ring-mvsr-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedService === 'transcript' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year *
                </label>
                <input
                  type="number"
                  value={formData.transcriptRequest.graduationYear}
                  onChange={(e) => handleInputChange('transcriptRequest.graduationYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree *
                </label>
                <input
                  type="text"
                  value={formData.transcriptRequest.degree}
                  onChange={(e) => handleInputChange('transcriptRequest.degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch *
                </label>
                <input
                  type="text"
                  value={formData.transcriptRequest.branch}
                  onChange={(e) => handleInputChange('transcriptRequest.branch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose *
                </label>
                <textarea
                  value={formData.transcriptRequest.purpose}
                  onChange={(e) => handleInputChange('transcriptRequest.purpose', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                  rows={4}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>

          {submitStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h3 className="text-green-800 font-medium">Request Submitted Successfully!</h3>
                  <p className="text-green-700 text-sm">
                    We'll review your request and get back to you soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h3 className="text-red-800 font-medium">Submission Failed</h3>
                  <p className="text-red-700 text-sm">
                    Please try again or contact support if the issue persists.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to access the help desk services.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mvsr-50 to-mvsr-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Alumni Help Desk
          </h1>
          <p className="text-xl text-mvsr-100">
            Connect with the institution and access various services
          </p>
        </div>

        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service.id)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left group"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className={`p-4 rounded-full group-hover:scale-110 transition-transform ${colorClasses[service.color]}`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-mvsr-600">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {showForm && renderForm()}
      </div>
    </div>
  );
};

export default HelpDeskEnhanced;
