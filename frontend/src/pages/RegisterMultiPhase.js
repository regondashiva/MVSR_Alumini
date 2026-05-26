import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { EyeIcon, EyeOffIcon, AcademicCapIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

const RegisterMultiPhase = () => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [userType, setUserType] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const showMode = commandInput.trim().toLowerCase() === 'show';
  const [registrationData, setRegistrationData] = useState({});
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // College data with departments
  const colleges = [
    { id: 'matrusri', name: 'Matrusri' },
    { id: 'mvsr', name: 'MVSR Engineering College' }
  ];

  const collegeData = {
    matrusri: {
      departments: [
        'Computer Science Engineering',
        'Electronics and Communication Engineering',
        'Electrical and Electronics Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Information Technology'
      ]
    },
    mvsr: {
      departments: [
        'Computer Science Engineering',
        'Electronics and Communication Engineering',
        'Electrical and Electronics Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Information Technology',
        'Chemical Engineering',
        'Biomedical Engineering'
      ]
    }
  };

  // combined unique departments for faculty selection
  const allDepartments = Array.from(new Set(Object.values(collegeData).flatMap(c => c.departments))).sort();

  const countries = [
    { code: '+91', name: 'India' },
    { code: '+1', name: 'United States' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+61', name: 'Australia' },
    { code: '+971', name: 'UAE' },
    { code: '+966', name: 'Saudi Arabia' },
    { code: '+65', name: 'Singapore' },
    { code: '+81', name: 'Japan' },
    { code: '+82', name: 'South Korea' },
    { code: '+86', name: 'China' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+39', name: 'Italy' },
    { code: '+34', name: 'Spain' },
    { code: '+7', name: 'Russia' },
    { code: '+55', name: 'Brazil' },
    { code: '+52', name: 'Mexico' },
    { code: '+54', name: 'Argentina' },
    { code: '+27', name: 'South Africa' },
    { code: '+20', name: 'Egypt' },
    { code: '+234', name: 'Nigeria' },
    { code: '+254', name: 'Kenya' },
    { code: '+91', name: 'India (Additional)' }
  ];

  const currentYear = new Date().getFullYear();
  const passoutYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix',
    'Tesla', 'SpaceX', 'IBM', 'Oracle', 'SAP', 'Adobe', 'Intel',
    'NVIDIA', 'AMD', 'Cisco', 'HP', 'Dell', 'Accenture', 'Deloitte',
    'PwC', 'KPMG', 'EY', 'TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra',
    'Capgemini', 'Cognizant', 'Honeywell', 'Siemens', 'Bosch', 'GE',
    'Philips', "Unilever", "P&G", "Nestlé", "Coca-Cola", "PepsiCo",
    "McDonald's", "Starbucks", "Walmart", "Target", "Costco"
  ];

  const industries = [
    'Information Technology', 'Software Development', 'Consulting',
    'Banking & Finance', 'Insurance', 'Healthcare', 'Pharmaceuticals',
    'Oil & Gas', 'Energy', 'Manufacturing', 'Automotive', 'Aerospace',
    'Telecommunications', 'E-commerce', 'Retail', 'Food & Beverage',
    'Hospitality', 'Travel & Tourism', 'Education', 'Real Estate',
    'Construction', 'Logistics & Supply Chain', 'Media & Entertainment',
    'Government & Public Sector', 'Non-profit', 'Agriculture', 'Mining',
    'Chemicals', 'Biotechnology', 'Textiles', 'Fashion', 'Sports',
    'Gaming', 'Social Media', 'Artificial Intelligence', 'Machine Learning',
    'Data Science', 'Cybersecurity', 'Cloud Computing', 'IoT',
    'Robotics', 'Blockchain', 'FinTech', 'EdTech', 'HealthTech'
  ];

  const processSkills = [
    'Art & Design', 'Communication', 'Android Development', 'iOS Development',
    'Web Development', 'Frontend Development', 'Backend Development',
    'Full Stack Development', 'Mobile Development', 'Data Analysis',
    'Data Science', 'Machine Learning', 'Artificial Intelligence',
    'Cloud Computing', 'DevOps', 'Cybersecurity', 'Network Administration',
    'Database Management', 'Project Management', 'Product Management',
    'Business Analysis', 'Quality Assurance', 'Testing', 'UX/UI Design',
    'Graphic Design', 'Content Writing', 'Digital Marketing', 'SEO',
    'Social Media Marketing', 'Email Marketing', 'Content Strategy',
    'Public Relations', 'Customer Service', 'Sales', 'Business Development',
    'Strategic Planning', 'Financial Analysis', 'Accounting', 'HR Management',
    'Operations Management', 'Supply Chain Management', 'Logistics',
    'Teaching', 'Training', 'Research', 'Writing', 'Photography',
    'Videography', 'Animation', 'Game Development', 'Music Production',
    'Video Editing', 'Audio Engineering', 'Translation', 'Interpretation',
    'Event Planning', 'Hospitality', 'Cooking', 'Fitness Training',
    'Coaching', 'Mentoring', 'Leadership', 'Team Management',
    'Negotiation', 'Public Speaking', 'Presentation Skills', 'Time Management',
    'Problem Solving', 'Critical Thinking', 'Creativity', 'Innovation',
    'Analytical Skills', 'Research Skills', 'Technical Writing',
    'Documentation', 'Process Improvement', 'Change Management', 'Risk Management'
  ];

  const handlePhaseSubmit = (data) => {
    if (currentPhase === 1) {
      // Validate password match
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      // Generate roll number based on college and department
      const rollNumber = generateRollNumber(selectedCollege || 'mvsr', data.firstName, data.lastName);
      setRegistrationData({ ...registrationData, ...data, rollNumber });
      setCurrentPhase(2);
    } else if (currentPhase === 2) {
      if (!userType) {
        toast.error('Please select user type');
        return;
      }
      if (userType === 'alumni') {
        if (!selectedCollege) {
          toast.error('Please select a college');
          return;
        }
        if (!data.department) {
          toast.error('Please select department');
          return;
        }
        if (!data.passoutYear) {
          toast.error('Please select passout year');
          return;
        }
      }
      if (userType === 'faculty') {
        if (!data.facultyId) {
          toast.error('Please enter Faculty ID');
          return;
        }
        if (!data.facultyDepartment) {
          toast.error('Please enter Department');
          return;
        }
      }
      // Update roll number if college changed
      const updatedRollNumber = generateRollNumber(selectedCollege, registrationData.firstName, registrationData.lastName);
      setRegistrationData({ ...registrationData, ...data, college: selectedCollege, userType, rollNumber: updatedRollNumber });
      setCurrentPhase(3);
    } else if (currentPhase === 3) {
      // Final submission
      const finalData = { ...registrationData, ...data };
      submitRegistration(finalData);
    }
  };

  // Generate roll number based on college and user details
  const generateRollNumber = (college, firstName, lastName) => {
    const collegeCode = college === 'matrusri' ? 'MAT' : 'MVSR';
    const year = new Date().getFullYear().toString().slice(-2);
    const nameInitials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${collegeCode}${year}${nameInitials}${randomDigits}`;
  };

  const submitRegistration = async (data) => {
    setLoading(true);
    try {
      // Prepare registration data
      const registrationPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        rollNumber: data.rollNumber,
        countryCode: data.countryCode,
        phoneNumber: data.phoneNumber,
        address: data.address,
        college: userType === 'alumni' ? selectedCollege : '',
        department: userType === 'alumni' ? data.department : (data.facultyDepartment || ''),
        passoutYear: data.passoutYear,
        role: userType,
        company: userType === 'alumni' ? (data.company || '') : '',
        experience: userType === 'alumni' ? (parseInt(data.experience) || 0) : 0,
        roleDescription: userType === 'alumni' ? (data.roleDescription || '') : (data.designation || ''),
        industry: userType === 'alumni' ? (data.industry || '') : '',
        skills: userType === 'alumni' ? (data.skills || '') : '',
        facultyId: userType === 'faculty' ? (data.facultyId || '') : ''
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Registration submitted successfully! Your account is pending approval.');
        navigate('/login');
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const renderPhase1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Phase 1: Personal Information</h3>
        <p className="text-gray-600 mt-2">Please provide your basic details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            {...register('firstName', { required: 'First name is required' })}
            type="text"
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            placeholder="First name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            {...register('lastName', { required: 'Last name is required' })}
            type="text"
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
          placeholder="Email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">
            Country Code *
          </label>
          <select
            {...register('countryCode', { required: 'Country code is required' })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
          >
            <option value="">Select country</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.code} - {country.name}
              </option>
            ))}
          </select>
          {errors.countryCode && (
            <p className="mt-1 text-sm text-red-600">{errors.countryCode.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number *
          </label>
          <input
            {...register('phoneNumber', { required: 'Mobile number is required' })}
            type="tel"
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            placeholder="Mobile number"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address *
        </label>
        <textarea
          {...register('address', { required: 'Address is required' })}
          rows={3}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
          placeholder="Enter your complete address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <div className="relative">
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              type={showPassword ? 'text' : 'password'}
              className="mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword', { required: 'Please confirm your password' })}
              type={showConfirmPassword ? 'text' : 'password'}
              className="mt-1 appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPhase2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Phase 2: Academic Information</h3>
        <p className="text-gray-600 mt-2">Provide your academic details and user type</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          User Type *
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              value="alumni"
              {...register('userType', { required: 'User type is required' })}
              onChange={(e) => setUserType(e.target.value)}
              className="h-4 w-4 text-mvsr-600 focus:ring-mvsr-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Register as Alumni</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="faculty"
              {...register('userType', { required: 'User type is required' })}
              onChange={(e) => setUserType(e.target.value)}
              className="h-4 w-4 text-mvsr-600 focus:ring-mvsr-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Register as Faculty</span>
          </label>
        </div>
        {errors.userType && (
          <p className="mt-1 text-sm text-red-600">{errors.userType.message}</p>
        )}
      </div>

      {/* Conditional fields revealed when user selects user type */}
      {userType === 'alumni' && (
        <>
          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700">
              College *
            </label>
            <select
              {...register('college')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              onChange={(e) => setSelectedCollege(e.target.value)}
            >
              <option value="">Select college</option>
              {colleges.map(college => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCollege && (
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department *
              </label>
              <select
                {...register('department')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              >
                <option value="">Select department</option>
                {collegeData[selectedCollege]?.departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="passoutYear" className="block text-sm font-medium text-gray-700">
              Passout Year *
            </label>
            <select
              {...register('passoutYear')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            >
              <option value="">Select passout year</option>
              {passoutYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {userType === 'faculty' && (
        <>
          <div>
            <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700">
              Faculty ID *
            </label>
            <input
              {...register('facultyId')}
              type="text"
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              placeholder="Enter Faculty ID"
            />
          </div>

          <div>
            <label htmlFor="facultyDepartment" className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <select
              {...register('facultyDepartment')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            >
              <option value="">Select department</option>
              {allDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );

  const renderPhase3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Phase 3: Professional Information</h3>
        <p className="text-gray-600 mt-2">Provide your professional details</p>
      </div>

      {userType === 'alumni' && (
        <>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company *
            </label>
            <select
              {...register('company', { required: 'Company is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            >
              <option value="">Select company</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
              <option value="other">Other</option>
            </select>
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
            )}
            {watch('company') === 'other' && (
              <input
                {...register('otherCompany', { required: 'Please specify company' })}
                type="text"
                className="mt-2 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
                placeholder="Enter company name"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Total Years of Experience *
              </label>
              <input
                {...register('experience', { required: 'Experience is required' })}
                type="number"
                min="0"
                max="50"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
                placeholder="Years of experience"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role Description *
              </label>
              <input
                {...register('role', { required: 'Role is required' })}
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
                placeholder="Your current role"
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry Type *
            </label>
            <select
              {...register('industry', { required: 'Industry is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
              <option value="other">Other</option>
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
            )}
            {watch('industry') === 'other' && (
              <input
                {...register('otherIndustry', { required: 'Please specify industry' })}
                type="text"
                className="mt-2 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
                placeholder="Enter industry type"
              />
            )}
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
              Process Skills *
            </label>
            <select
              {...register('skills', { required: 'Skills are required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            >
              <option value="">Select skills</option>
              {processSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
              <option value="other">Other</option>
            </select>
            {errors.skills && (
              <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
            )}
            {watch('skills') === 'other' && (
              <input
                {...register('otherSkills', { required: 'Please specify skills' })}
                type="text"
                className="mt-2 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
                placeholder="Enter your skills"
              />
            )}
          </div>
        </>
      )}

      {userType === 'faculty' && (
        <>
          <div>
            <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700">
              Faculty ID
            </label>
            <input
              {...register('facultyId')}
              type="text"
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
              placeholder="Faculty ID (if any)"
            />
          </div>

          <div>
            <label htmlFor="facultyDepartment" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              {...register('facultyDepartment')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 sm:text-sm"
            >
              <option value="">Select department</option>
              {allDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="border-t pt-6">
        <p className="text-sm font-medium text-gray-700 mb-4">Additional Options:</p>
        <div className="space-y-3">
          <button type="button" className="text-mvsr-600 hover:text-mvsr-500 text-sm font-medium">
            Add Additional Course
          </button>
          <br />
          <button type="button" className="text-mvsr-600 hover:text-mvsr-500 text-sm font-medium">
            Add Course Still Pursuing
          </button>
          <br />
          <button type="button" className="text-mvsr-600 hover:text-mvsr-500 text-sm font-medium">
            Register as Faculty
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-mvsr-600 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your alumni account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-mvsr-600 hover:text-mvsr-500"
            >
              Sign in here
            </Link>
          </p>
          {/* <div className="mt-4 flex justify-center">
            <input
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder='Type "show" to reveal registration options'
              className="w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-mvsr-500 focus:border-mvsr-500 text-sm"
            />
          </div> */}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentPhase >= 1 ? 'text-mvsr-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPhase >= 1 ? 'bg-mvsr-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Personal Info</span>
            </div>
            <div className={`w-8 h-0.5 ${currentPhase >= 2 ? 'bg-mvsr-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentPhase >= 2 ? 'text-mvsr-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPhase >= 2 ? 'bg-mvsr-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Academic Info</span>
            </div>
            <div className={`w-8 h-0.5 ${currentPhase >= 3 ? 'bg-mvsr-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentPhase >= 3 ? 'text-mvsr-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPhase >= 3 ? 'bg-mvsr-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Professional Info</span>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handlePhaseSubmit)}>
          {currentPhase === 1 && renderPhase1()}
          {currentPhase === 2 && renderPhase2()}
          {currentPhase === 3 && renderPhase3()}

          <div className="flex justify-between">
            {currentPhase > 1 && (
              <button
                type="button"
                onClick={handlePreviousPhase}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mvsr-500"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </button>
            )}
            
            <div className="flex-1"></div>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mvsr-600 hover:bg-mvsr-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mvsr-500 disabled:opacity-50"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {currentPhase === 3 ? 'Submit Registration' : 'Next Phase'}
                  <ChevronRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMultiPhase;
