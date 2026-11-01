import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { LinksPage } from './pages/LinksPage';
import { CreateLinkPage } from './pages/CreateLinkPage';
import { LinkDetailsPage } from './pages/LinkDetailsPage';
import { QrStudioPage } from './pages/QrStudioPage';
import { FoldersTagsPage } from './pages/FoldersTagsPage';
import { CampaignManagerPage } from './pages/CampaignManagerPage';
import { UtmBuilderPage } from './pages/UtmBuilderPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PasswordChallengePage } from './pages/PasswordChallengePage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/p/:shortCode" element={<PasswordChallengePage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Authenticated Dashboard Pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/create" element={<CreateLinkPage />} />
        <Route path="/links/:id/analytics" element={<LinkDetailsPage />} />
        <Route path="/qr-studio" element={<QrStudioPage />} />
        <Route path="/folders-tags" element={<FoldersTagsPage />} />
        <Route path="/campaigns" element={<CampaignManagerPage />} />
        <Route path="/utm-builder" element={<UtmBuilderPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
