import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Clients from './pages/clients/Clients'; 
import Invoices from './pages/invoices/Invoices';
import Payments from './pages/payments/Payments'; // Imported real payments module component
import Tickets from './pages/tickets/Tickets';

export default function App() {
  return (
      <>
          <Toaster position="top-right" reverseOrder={false} />
          
          <Routes>
              {/* Public Interface Pipelines */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Workspace Multi-Tenant Infrastructure Node Wrapper */}
              <Route
                  path="/dashboard"
                  element={
                      <ProtectedRoute>
                          <DashboardLayout />
                      </ProtectedRoute>
                  }
              >
                  <Route index element={<Dashboard />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="invoices" element={<Invoices />} />
                  
                  {/* Finalized Milestone Mapped Route Node */}
                  <Route path="payments" element={<Payments />} />
                  <Route path="tickets" element={<Tickets />} />
              </Route>

              {/* Catch-all safety redirection */}
              <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
      </>
  );
}
