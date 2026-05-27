import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/outline';

const CreateNews = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'news',
    image: ''
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

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/v1/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        alert('News posted successfully!');
        navigate('/faculty-dashboard');
      } else {
        setError(data.message || 'Failed to post news');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while posting news.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Post Department News</h3>
            <p className="mt-1 text-sm text-gray-500">
              Share updates, achievements, or announcements with the alumni network.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Headline/Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 focus:ring-mvsr-500 focus:border-mvsr-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
                  >
                    <option value="news">General News</option>
                    <option value="achievements">Achievements</option>
                    <option value="learning">Learning Resources</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                  <input
                    type="url"
                    name="image"
                    id="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="mt-1 focus:ring-mvsr-500 focus:border-mvsr-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                  <div className="mt-1">
                    <textarea
                      id="content"
                      name="content"
                      rows={5}
                      required
                      value={formData.content}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-mvsr-500 focus:border-mvsr-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Write your announcement here..."
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
                  {loading ? 'Posting...' : 'Post News'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNews;
