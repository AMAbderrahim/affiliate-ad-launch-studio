import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainDataHub } from './components/MainDataHub';
import { MarketingStrategist } from './components/agents/MarketingStrategist';
import { CreativeStrategist } from './components/agents/CreativeStrategist';
import { VideoDirector } from './components/agents/VideoDirector';
import { Designer } from './components/agents/Designer';
import { PromptGenerator } from './components/agents/PromptGenerator';
import { Copywriter } from './components/agents/Copywriter';
import { MediaBuyer } from './components/agents/MediaBuyer';
import { DataOps } from './components/agents/DataOps';
import { Compliance } from './components/agents/Compliance';
import { CompetitorAnalysis } from './components/agents/CompetitorAnalysis';
import { CampaignScheduler } from './components/agents/CampaignScheduler';
import { WeeklyReports } from './components/WeeklyReports';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { CampaignProvider } from './context/CampaignContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <CampaignProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar - Navigation */}
        <aside className="w-72 flex-shrink-0">
          <Navigation />
        </aside>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <Routes>
                <Route path="/" element={<Navigate to="/data-hub" replace />} />
                <Route path="/data-hub" element={<MainDataHub />} />
                <Route path="/marketing-strategist" element={<MarketingStrategist />} />
                <Route path="/creative-strategist" element={<CreativeStrategist />} />
                <Route path="/video-director" element={<VideoDirector />} />
                <Route path="/designer" element={<Designer />} />
                <Route path="/prompt-generator" element={<PromptGenerator />} />
                <Route path="/copywriter" element={<Copywriter />} />
                <Route path="/media-buyer" element={<MediaBuyer />} />
                <Route path="/data-ops" element={<DataOps />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
                <Route path="/campaign-scheduler" element={<CampaignScheduler />} />
                <Route path="/weekly-reports" element={<WeeklyReports />} />
                <Route path="*" element={<Navigate to="/data-hub" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </CampaignProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;