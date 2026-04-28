import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  BriefcaseIcon, 
  LocationMarkerIcon, 
  AcademicCapIcon,
  OfficeBuildingIcon,
  CodeIcon,
  DocumentTextIcon,
  CalendarIcon,
  StarIcon,
  PlusIcon,
  XIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatIcon,
  UserGroupIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const AlumniProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [showMentorshipModal, setShowMentorshipModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [formData, setFormData] = useState({
    currentPosition: '',
    company: '',
    workLocation: '',
    industry: '',
    skills: {
      programming: [],
      technical: [],
      soft: []
    },
    technologies: {
      frameworks: [],
      tools: [],
      platforms: []
    },
    projects: [],
    internships: []
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    // Fetch alumni data
    fetchAlumniData();
  }, [id, navigate]);

  const fetchAlumniData = async () => {
    try {
      const response = await fetch(`/api/alumni/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setAlumni(data.data);
        setFormData({
          currentPosition: data.data.currentPosition || '',
          company: data.data.company || '',
          workLocation: data.data.workLocation || '',
          industry: data.data.industry || '',
          skills: data.data.skills || { programming: [], technical: [], soft: [] },
          technologies: data.data.technologies || { frameworks: [], tools: [], platforms: [] },
          projects: data.data.projects || [],
          internships: data.data.internships || []
        });
      } else {
        toast.error('Alumni not found');
        navigate('/alumni-discovery');
      }
    } catch (error) {
      console.error('Error fetching alumni data:', error);
      toast.error('Failed to load alumni profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`/api/alumni/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        fetchAlumniData(); // Refresh data
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      title: '',
      description: '',
      technologies: '',
      duration: '',
      role: ''
    };
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const handleUpdateProject = (projectId, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === projectId ? { ...project, [field]: value } : project
      )
    }));
  };

  const handleRemoveProject = (projectId) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== projectId)
    }));
  };

  const handleAddInternship = () => {
    const newInternship = {
      id: Date.now(),
      companyName: '',
      role: '',
      duration: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      internships: [...prev.internships, newInternship]
    }));
  };

  const handleUpdateInternship = (internshipId, field, value) => {
    setFormData(prev => ({
      ...prev,
      internships: prev.internships.map(internship => 
        internship.id === internshipId ? { ...internship, [field]: value } : internship
      )
    }));
  };

  const handleRemoveInternship = (internshipId) => {
    setFormData(prev => ({
      ...prev,
      internships: prev.internships.filter(internship => internship.id !== internshipId)
    }));
  };

  const handleRequestMentorship = () => {
    setShowMentorshipModal(true);
  };

  const handleSendConnectionRequest = () => {
    setShowConnectionModal(true);
  };

  const submitMentorshipRequest = async (message) => {
    try {
      const response = await fetch(`/api/mentorship/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          alumniId: id,
          message,
          requestedBy: user.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Mentorship request sent successfully!');
        setShowMentorshipModal(false);
      } else {
        toast.error('Failed to send mentorship request');
      }
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      toast.error('Failed to send mentorship request');
    }
  };

  const submitConnectionRequest = async (message) => {
    try {
      const response = await fetch(`/api/connections/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          alumniId: id,
          message,
          requestedBy: user.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Connection request sent successfully!');
        setShowConnectionModal(false);
      } else {
        toast.error('Failed to send connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mvsr-600"></div>
      </div>
    );
  }

  if (!alumni) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Alumni not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{alumni.name}</h1>
                <p className="text-gray-600">{alumni.currentPosition}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {alumni.batch} • {alumni.branch}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <OfficeBuildingIcon className="h-4 w-4 mr-2" />
                    {alumni.company}
                  </div>
                  <span className="flex items-center">
                    <LocationMarkerIcon className="h-4 w-4 mr-1" />
                    {alumni.city}, {alumni.state}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && user.id !== alumni.id && (
                <>
                  <button
                    onClick={handleRequestMentorship}
                    className="px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                  >
                    Request Mentorship
                  </button>
                  <button
                    onClick={handleSendConnectionRequest}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Connect
                  </button>
                </>
              )}
              {user && user.id === alumni.id && (
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
                    <input
                      type="text"
                      value={formData.currentPosition}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPosition: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label>
                    <input
                      type="text"
                      value={formData.workLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, workLocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Current Position</p>
                      <p className="text-gray-600">{alumni.currentPosition}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <OfficeBuildingIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Company</p>
                      <p className="text-gray-600">{alumni.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Work Location</p>
                      <p className="text-gray-600">{alumni.city}, {alumni.state}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Industry</p>
                      <p className="text-gray-600">{alumni.industry}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Programming Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.programming.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.technical.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.soft.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technologies & Tools</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.frameworks.map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Software Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.tools.map((tool, index) => (
                      <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.platforms.map((platform, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                {isEditing && (
                  <button
                    onClick={handleAddProject}
                    className="flex items-center px-3 py-1 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Project
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {formData.projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleUpdateProject(project.id, 'title', e.target.value)}
                          placeholder="Project title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                          placeholder="Project description"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                        />
                        <input
                          type="text"
                          value={project.technologies}
                          onChange={(e) => handleUpdateProject(project.id, 'technologies', e.target.value)}
                          placeholder="Technologies used"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleRemoveProject(project.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <CodeIcon className="h-4 w-4 mr-1" />
                            {project.technologies}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {formData.projects.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>No projects added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Internships */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Internships</h2>
                {isEditing && (
                  <button
                    onClick={handleAddInternship}
                    className="flex items-center px-3 py-1 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Internship
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {formData.internships.map((internship) => (
                  <div key={internship.id} className="border border-gray-200 rounded-lg p-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={internship.companyName}
                          onChange={(e) => handleUpdateInternship(internship.id, 'companyName', e.target.value)}
                          placeholder="Company name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                        />
                        <input
                          type="text"
                          value={internship.role}
                          onChange={(e) => handleUpdateInternship(internship.id, 'role', e.target.value)}
                          placeholder="Role"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                        />
                        <input
                          type="text"
                          value={internship.duration}
                          onChange={(e) => handleUpdateInternship(internship.id, 'duration', e.target.value)}
                          placeholder="Duration"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                        />
                        <textarea
                          value={internship.description}
                          onChange={(e) => handleUpdateInternship(internship.id, 'description', e.target.value)}
                          placeholder="Work description"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleRemoveInternship(internship.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{internship.role}</h3>
                          <span className="text-sm text-gray-500">{internship.duration}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{internship.companyName}</p>
                        <p className="text-gray-600 mt-2">{internship.description}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {formData.internships.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BriefcaseIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>No internships added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={handleRequestMentorship}
                  className="w-full px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                >
                  Request Mentorship
                </button>
                <button
                  onClick={handleSendConnectionRequest}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Send Connection Request
                </button>
              </div>
            </div>

            {/* Career Journey */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Career Journey</h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-mvsr-100 rounded-full flex items-center justify-center">
                    <AcademicCapIcon className="h-4 w-4 text-mvsr-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Graduated {alumni.batch}</p>
                    <p className="text-sm text-gray-600">{alumni.branch}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-mvsr-100 rounded-full flex items-center justify-center">
                    <OfficeBuildingIcon className="h-4 w-4 text-mvsr-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Current Role</p>
                    <p className="text-sm text-gray-600">{alumni.currentPosition}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Stats</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-medium text-gray-900">{formData.projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Internships</span>
                  <span className="font-medium text-gray-900">{formData.internships.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills</span>
                  <span className="font-medium text-gray-900">
                    {formData.skills.programming.length + formData.skills.technical.length + formData.skills.soft.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Technologies</span>
                  <span className="font-medium text-gray-900">
                    {formData.technologies.frameworks.length + formData.technologies.tools.length + formData.technologies.platforms.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showMentorshipModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Request Mentorship</h3>
                <button
                  onClick={() => setShowMentorshipModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                    rows={4}
                    placeholder="Tell them why you'd like mentorship..."
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowMentorshipModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitMentorshipRequest(document.querySelector('textarea').value)}
                    className="px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showConnectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Send Connection Request</h3>
                <button
                  onClick={() => setShowConnectionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500"
                    rows={4}
                    placeholder="Introduce yourself and why you'd like to connect..."
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowConnectionModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitConnectionRequest(document.querySelector('textarea').value)}
                    className="px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;
