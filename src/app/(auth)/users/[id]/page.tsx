'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UserForm } from '@/components/forms/user-form';
import { User } from '@/types/auth';
import { toast } from 'sonner';

export default function EditUserPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [userResponse, authResponse] = await Promise.all([
        fetch(`/api/users/${params.id}`),
        fetch('/api/auth/me')
      ]);

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || 'Erro ao carregar usuário');
      }

      if (!authResponse.ok) {
        throw new Error('Erro ao verificar autenticação');
      }

      const [userData, authData] = await Promise.all([
        userResponse.json(),
        authResponse.json()
      ]);

      setUser(userData.user);
      setCurrentUser(authData.user);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar dados');
      console.error(error);
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

  if (!user || !currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <UserForm 
        user={user} 
        isEdit={true} 
        userRole={currentUser.role}
      />
    </div>
  );
}