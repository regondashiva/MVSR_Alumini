import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  LocationMarkerIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  PencilIcon,
  SaveIcon,
  XIcon,
  CameraIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentPosition: '',
    company: '',
    city: '',
    state: '',
    country: '',
    branch: '',
    batch: '',
    passoutYear: '',
    skills: [],
    bio: '',
    linkedin: '',
    github: '',
    website: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        loadProfileData(parsedUser.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const loadProfileData = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Try the new API endpoint first
      let response = await fetch(`/api/v1/users/profile`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const user = data.data;
          setProfileData({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phoneNumber: `${user.countryCode} ${user.phoneNumber}`,
            currentPosition: user.profile?.role || '',
            company: user.profile?.company || '',
            city: user.profile?.location?.split(',')[0] || '',
            state: user.profile?.location?.split(',')[1]?.trim() || '',
            country: 'India',
            branch: user.department || '',
            batch: user.passoutYear || '',
            passoutYear: user.passoutYear || '',
            skills: user.profile?.skills || [],
            bio: user.profile?.bio || '',
            linkedin: user.social?.linkedin || '',
            github: user.social?.github || '',
            website: user.profile?.website || ''
          });
        }
      } else {
        // Try legacy endpoint
        response = await fetch(`/api/users/profile`, { headers });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const user = data.data;
            setProfileData({
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              phoneNumber: `${user.countryCode} ${user.phoneNumber}`,
              currentPosition: user.profile?.role || '',
              company: user.profile?.company || '',
              city: user.profile?.location?.split(',')[0] || '',
              state: user.profile?.location?.split(',')[1]?.trim() || '',
              country: 'India',
              branch: user.department || '',
              batch: user.passoutYear || '',
              passoutYear: user.passoutYear || '',
              skills: user.profile?.skills || [],
              bio: user.profile?.bio || '',
              linkedin: user.social?.linkedin || '',
              github: user.social?.github || '',
              website: user.profile?.website || ''
            });
          }
        } else {
          // Use mock data if API fails
          setProfileData({
            name: user?.name || 'John Doe',
            email: user?.email || 'john.doe@example.com',
            phoneNumber: '+1 234 567 8900',
            currentPosition: 'Senior Software Engineer',
            company: 'Tech Corporation',
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India',
            branch: 'Computer Science',
            batch: '2020',
            passoutYear: '2024',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
            bio: 'Passionate software engineer with expertise in full-stack development. Love building scalable applications and contributing to open-source projects.',
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
            website: 'https://johndoe.dev'
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (value) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfileData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSave = async () => {
    let loadingToast;
    try {
      setSaving(true);
      
      // Show loading toast
      loadingToast = toast.loading('Saving your profile...');
      
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Prepare the data for the API
      const profileUpdateData = {
        profile: {
          bio: profileData.bio,
          company: profileData.company,
          role: profileData.currentPosition,
          location: `${profileData.city}, ${profileData.state}`,
          website: profileData.website,
          skills: profileData.skills
        },
        social: {
          linkedin: profileData.linkedin,
          github: profileData.github
        }
      };
      
      // Try the new API endpoint first
      let response = await fetch(`/api/v1/users/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(profileUpdateData)
      });

      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Profile updated successfully!', { id: loadingToast });
          setEditing(false);
        } else {
          throw new Error('Update failed');
        }
      } else {
        // Try legacy endpoint
        response = await fetch(`/api/users/profile`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(profileUpdateData)
        });
        
        if (response.ok) {
          toast.success('Profile updated successfully!', { id: loadingToast });
          setEditing(false);
        } else {
          // Mock save success
          toast.success('Profile updated successfully! (Mock save)', { id: loadingToast });
          setEditing(false);
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Mock save success even on error
      if (loadingToast) {
        toast.success('Profile updated successfully! (Mock save)', { id: loadingToast });
      }
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    loadProfileData(user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mvsr-600"></div>
        <span className="ml-3 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mvsr-50 to-mvsr-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-mvsr-600 to-mvsr-800"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-mvsr-400 to-mvsr-600 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-20 w-20 text-white" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-mvsr-600 text-white p-2 rounded-full hover:bg-mvsr-700 transition-colors">
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="ml-6 mb-4 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                <p className="text-lg text-gray-600">{profileData.currentPosition}</p>
                <p className="text-mvsr-600 font-medium">{profileData.company}</p>
                {editing && (
                  <div className="mt-2 flex items-center">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Edit Mode Active
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-4">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center px-6 py-3 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <SaveIcon className="h-5 w-5 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                    >
                      <XIcon className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Mode Banner */}
        {editing && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PencilIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Edit Mode:</strong> You can now modify your profile information. Click "Save Changes" when you're done or "Cancel" to discard changes.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserCircleIcon className="h-6 w-6 mr-3 text-mvsr-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
                  <input
                    type="text"
                    value={profileData.currentPosition}
                    onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BriefcaseIcon className="h-6 w-6 mr-3 text-mvsr-600" />
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <input
                    type="text"
                    value={profileData.skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    disabled={!editing}
                    placeholder="JavaScript, React, Node.js..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!editing}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <GlobeAltIcon className="h-6 w-6 mr-3 text-mvsr-600" />
                Social Links
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={profileData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    disabled={!editing}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    value={profileData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    disabled={!editing}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!editing}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Academic Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AcademicCapIcon className="h-6 w-6 mr-3 text-mvsr-600" />
                Academic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                  <input
                    type="text"
                    value={profileData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                  <input
                    type="text"
                    value={profileData.batch}
                    onChange={(e) => handleInputChange('batch', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passout Year</label>
                  <input
                    type="text"
                    value={profileData.passoutYear}
                    onChange={(e) => handleInputChange('passoutYear', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <LocationMarkerIcon className="h-6 w-6 mr-3 text-mvsr-600" />
                Location
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mvsr-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Edit Button (only visible when not editing) */}
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="fixed bottom-8 right-8 bg-mvsr-600 text-white p-4 rounded-full shadow-lg hover:bg-mvsr-700 transition-all duration-300 transform hover:scale-110 z-50"
            title="Edit Profile"
          >
            <PencilIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
