import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AlumniDirectoryEnhanced from './pages/AlumniDirectoryEnhanced';
import EventManagement from './pages/EventManagement';
import News from './pages/News';
import Gallery from './pages/Gallery';
import Careers from './pages/Careers';
import Academics from './pages/Academics';
import StudentLife from './pages/StudentLife';
import HelpDeskEnhanced from './pages/HelpDeskEnhanced';
import Contact from './pages/Contact';
import LoginSimple from './pages/LoginSimple';
import RegisterMultiPhase from './pages/RegisterMultiPhase';
import AlumniDashboard from './pages/AlumniDashboard';
import AlumniDiscovery from './pages/AlumniDiscovery';
import AlumniProfile from './pages/AlumniProfile';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import UserStatistics from './pages/UserStatistics';
import OAuthCallback from './pages/OAuthCallback';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alumni" element={<AlumniDirectoryEnhanced />} />
            <Route path="/alumni-enhanced" element={<AlumniDirectoryEnhanced />} />
            <Route path="/user-statistics" element={<UserStatistics />} />
            <Route path="/events" element={<EventManagement />} />
            <Route path="/news" element={<News />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/student-life" element={<StudentLife />} />
            <Route path="/help-desk" element={<HelpDeskEnhanced />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginSimple />} />
            <Route path="/register" element={<RegisterMultiPhase />} />
            <Route path="/auth/success" element={<OAuthCallback />} />
            <Route path="/auth/error" element={<OAuthCallback />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AlumniDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alumni-discovery" 
              element={
                <ProtectedRoute>
                  <AlumniDiscovery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/alumni-profile/:id" 
              element={
                <ProtectedRoute>
                  <AlumniProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/help-desk-enhanced" 
              element={
                <ProtectedRoute>
                  <HelpDeskEnhanced />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#0ea5e9',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
