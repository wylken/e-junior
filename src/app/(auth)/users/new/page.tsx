'use client';

import { useEffect, useState } from 'react';
import { UserForm } from '@/components/forms/user-form';
import { User } from '@/types/auth';

export default function NewUserPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData.user);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar dados do usuário</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <UserForm userRole={currentUser.role} />
    </div>
  );
}