import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/outline';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary_range: '',
    job_type: 'Full-time',
    experience_required: '',
    skills_required_raw: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Convert comma-separated skills to an array
    const skillsArray = formData.skills_required_raw
      ? formData.skills_required_raw.split(',').map(s => s.trim()).filter(s => s)
      : [];

    const payload = {
      ...formData,
      skills_required: skillsArray
    };
    delete payload.skills_required_raw;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        alert('Job/Internship posted successfully!');
        navigate('/faculty-dashboard');
      } else {
        setError(data.message || 'Failed to post job');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while posting the job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Post a Job or Internship</h3>
          <p className="mt-1 text-sm text-gray-500">
            Share career opportunities with students and alumni.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title / Role</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 focus:ring-mvsr-500 focus:border-mvsr-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. Software Engineer Intern"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 focus:ring-mvsr-500 focus:border-mvsr-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 focus:ring-mvsr-500 focus:border-mvsr-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. Hyderabad, Remote"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">Job Type</label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700">Salary Range (Optional)</label>
                <input
                  type="text"
                  name="salary_range"
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  className="mt-1 focus:ring-mvsr-500 focus:border-mvsr-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. 5LPA - 8LPA, Unpaid"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="experience_required" className="block text-sm font-medium text-gray-700">Experience Required</label>
                <input
                  type="text"
                  name="experience_required"
                  id="experience_required"
                  value={formData.experience_required}
                  onChange={handleChange}
                  className="mt-1 focus:ring-mvsr-500 focus:border-mvsr-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. Fresher, 1-2 Years"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="skills_required_raw" className="block text-sm font-medium text-gray-700">Skills Required (Comma separated)</label>
                <input
                  type="text"
                  name="skills_required_raw"
                  id="skills_required_raw"
                  value={formData.skills_required_raw}
                  onChange={handleChange}
                  className="mt-1 focus:ring-mvsr-500 focus:border-mvsr-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. React, Node.js, Python"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-mvsr-500 focus:border-mvsr-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Describe the responsibilities, requirements, and how to apply..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mvsr-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-mvsr-600 hover:bg-mvsr-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mvsr-500"
              >
                {loading ? 'Posting...' : 'Post Job/Internship'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
