'use client';

import { useRouter } from 'next/navigation';
import { useCreateUser } from '../hooks/useUsers';
import { AdminForm } from './AdminForm';
import { UserFormValues } from '@/features/administrators/schemas/user.schema';

export function NewAdminForm() {
  const router = useRouter();
  const { mutate: createUser, isPending } = useCreateUser();

  const handleSubmit = (data: UserFormValues) => {
    createUser(data, {
      onSuccess: () => router.push('/dashboard/administradores'),
      onError: (error: unknown) => {
        console.error('[NewAdminForm] Failed to create new admin:', error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminForm 
        onSubmit={handleSubmit} 
        isPending={isPending} 
        submitLabel="Crear Administrador" 
      />
    </div>
  );
}
