import React, { useState } from 'react';
import { 
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  SupportIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowRightIcon,
  SearchIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationIcon
} from '@heroicons/react/outline';

const Engage = () => {
  const [activeTab, setActiveTab] = useState('queries');
  const [queries, setQueries] = useState([
    {
      id: 1,
      title: 'Alumni Verification Issue',
      description: 'I need help verifying my alumni status. My roll number is not being accepted.',
      status: 'pending',
      category: 'verification',
      priority: 'high',
      submittedDate: '2024-03-15',
      responses: [
        {
          id: 1,
          author: 'Admin Team',
          message: 'Please check your roll number format. It should be 4 digits without any special characters.',
          date: '2024-03-15',
          isOfficial: true
        }
      ]
    },
    {
      id: 2,
      title: 'Event Registration Help',
      description: 'Having trouble registering for upcoming alumni meet?',
      status: 'resolved',
      category: 'events',
      priority: 'medium',
      submittedDate: '2024-03-10',
      responses: [
        {
          id: 1,
          author: 'Support Team',
          message: 'Event registration is now working. Please try again using the updated form.',
          date: '2024-03-11',
          isOfficial: true
        }
      ]
    },
    {
      id: 3,
      title: 'Profile Update Request',
      description: 'Request to update my company information and job details.',
      status: 'in-progress',
      category: 'profile',
      priority: 'low',
      submittedDate: '2024-03-12',
      responses: []
    }
  ]);

  const [newQuery, setNewQuery] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const categories = [
    { id: 'general', name: 'General Query', icon: QuestionMarkCircleIcon },
    { id: 'verification', name: 'Verification Issue', icon: CheckCircleIcon },
    { id: 'events', name: 'Event Related', icon: CalendarIcon },
    { id: 'profile', name: 'Profile Update', icon: UserGroupIcon },
    { id: 'technical', name: 'Technical Support', icon: SupportIcon }
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: 'text-gray-500' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-500' },
    { id: 'high', name: 'High', color: 'text-red-500' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle query submission
    const newQueryData = {
      ...newQuery,
      id: Date.now(),
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      responses: []
    };
    setQueries([newQueryData, ...queries]);
    setNewQuery({ title: '', description: '', category: 'general', priority: 'medium' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Engage</h1>
          <p className="text-gray-600">Get support, ask questions, and connect with the alumni community</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {['queries', 'submit', 'faq'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-mvsr-500 text-mvsr-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
            ))}
          </nav>
        </div>

        {activeTab === 'queries' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Query Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit New Query</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Query Title
                    </label>
                    <input
                      type="text"
                      value={newQuery.title}
                      onChange={(e) => setNewQuery({...newQuery, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                      placeholder="Brief description of your query"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Detailed Description
                    </label>
                    <textarea
                      value={newQuery.description}
                      onChange={(e) => setNewQuery({...newQuery, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                      placeholder="Provide detailed information about your query"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newQuery.category}
                        onChange={(e) => setNewQuery({...newQuery, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={newQuery.priority}
                        onChange={(e) => setNewQuery({...newQuery, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                      >
                        {priorities.map((priority) => (
                          <option key={priority.id} value={priority.id}>{priority.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-mvsr-600 text-white py-2 px-4 rounded-lg hover:bg-mvsr-700 transition-colors duration-200 font-medium"
                  >
                    Submit Query
                  </button>
                </form>
              </div>
            </div>

            {/* Queries List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Queries</h2>
                <div className="space-y-4">
                  {queries.map((query) => (
                    <div key={query.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[query.status]}`}>
                            {query.status}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${priorities.find(p => p.id === query.priority)?.color}`}>
                            {query.priority}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {query.submittedDate}
                        </span>
                      </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{query.title}</h3>
                      <p className="text-gray-600 mb-3">{query.description}</p>
                      
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Category: {categories.find(c => c.id === query.category)?.name}
                        </span>
                      </div>
                      
                      {query.responses.length > 0 && (
                        <div className="border-t border-gray-200 pt-3">
                          <h4 className="font-medium text-gray-900 mb-2">Responses</h4>
                          <div className="space-y-2">
                            {query.responses.map((response) => (
                              <div key={response.id} className={`flex items-start space-x-2 ${response.isOfficial ? 'bg-blue-50 p-3 rounded-lg' : 'bg-gray-50 p-3 rounded-lg'}`}>
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-mvsr-100 rounded-full flex items-center justify-center">
                                    <ChatBubbleLeftRightIcon className="h-4 w-4 text-mvsr-600" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-900">{response.author}</span>
                                    <span className="text-sm text-gray-500">{response.date}</span>
                                  </div>
                                  <p className="text-gray-700">{response.message}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['queries', 'submit', 'faq'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-mvsr-500 text-mvsr-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'queries' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Query Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit New Query</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Query Title
                  </label>
                  <input
                    type="text"
                    value={newQuery.title}
                    onChange={(e) => setNewQuery({...newQuery, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                    placeholder="Brief description of your query"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    value={newQuery.description}
                    onChange={(e) => setNewQuery({...newQuery, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                    placeholder="Provide detailed information about your query"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newQuery.category}
                      onChange={(e) => setNewQuery({...newQuery, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newQuery.priority}
                      onChange={(e) => setNewQuery({...newQuery, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mvsr-500 focus:border-transparent"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.id} value={priority.id}>{priority.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-mvsr-600 text-white py-2 px-4 rounded-lg hover:bg-mvsr-700 transition-colors duration-200 font-medium"
                >
                  Submit Query
                </button>
              </form>
            </div>
          </div>

          {/* Queries List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Queries</h2>
              <div className="space-y-4">
                {queries.map((query) => (
                  <div key={query.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[query.status]}`}>
                          {query.status}
                        </span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${priorities.find(p => p.id === query.priority)?.color}`}>
                          {query.priority}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {query.submittedDate}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{query.title}</h3>
                    <p className="text-gray-600 mb-3">{query.description}</p>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Category: {categories.find(c => c.id === query.category)?.name}
                      </span>
                    </div>
                    {query.responses.length > 0 && (
                      <div className="border-t border-gray-200 pt-3">
                        <h4 className="font-medium text-gray-900 mb-2">Responses</h4>
                        <div className="space-y-2">
                          {query.responses.map((response) => (
                            <div key={response.id} className={`flex items-start space-x-2 ${response.isOfficial ? 'bg-blue-50 p-3 rounded-lg' : 'bg-gray-50 p-3 rounded-lg'}`}>
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-mvsr-100 rounded-full flex items-center justify-center">
                                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-mvsr-600" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-gray-900">{response.author}</span>
                                  <span className="text-sm text-gray-500">{response.date}</span>
                                </div>
                                <p className="text-gray-700">{response.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'submit' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit New Query</h2>
          <div className="text-center py-8">
            <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Query submitted successfully!</p>
            <p className="text-sm text-gray-500">Our team will review your query and respond within 24-48 hours.</p>
            <button
              onClick={() => setActiveTab('queries')}
              className="bg-mvsr-600 text-white py-2 px-6 rounded-lg hover:bg-mvsr-700 transition-colors duration-200 font-medium"
            >
              Submit Another Query
            </button>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-mvsr-200 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">How do I verify my alumni status?</h3>
              <p className="text-gray-600">Use your roll number and passout year to verify your alumni status. Make sure your college information matches our records.</p>
            </div>
            <div className="border-l-4 border-mvsr-200 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">How long does verification take?</h3>
              <p className="text-gray-600">Verification typically takes 1-2 business days. You will receive an email once completed.</p>
            </div>
            <div className="border-l-4 border-mvsr-200 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">What if my details do not match?</h3>
              <p className="text-gray-600">Contact our support team with your student ID card and any additional documentation for manual verification.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default Engage;
