import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LearningApp } from '../components/learning';
import { NotificationProvider } from '../contexts/NotificationContext';

export const LearningWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <NotificationProvider>
      <LearningApp onBack={() => navigate('/')} />
    </NotificationProvider>
  );
};
