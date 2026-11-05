'use client';

import { useRouter } from 'next/navigation';
import { useUser, useUpdateUser } from '../hooks/useUsers';
import { AdminForm } from './AdminForm';
import { FormSkeleton } from '@/common/components/ui/skeletons/FormSkeleton';
import { UserFormValues } from '@/features/administrators/schemas/user.schema';

export function EditAdminForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: currentUser, isLoading } = useUser(id);
  const { mutate: updateUser, isPending } = useUpdateUser();

  if (isLoading) return <FormSkeleton />;
  
  if (!currentUser) {
    return (
      <div className="text-danger-main p-4 bg-danger-surface border border-danger-main/20 rounded-lg text-sm font-medium">
        No se pudo cargar el administrador.
      </div>
    );
  }

  const handleSubmit = (data: UserFormValues) => {
    updateUser(
      { id, payload: data },
      { 
        onSuccess: () => router.push('/dashboard/administradores'),
        onError: (error: unknown) => {
          console.error('[EditAdminForm] Failed to update admin data:', error);
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminForm 
        defaultValues={currentUser}
        onSubmit={handleSubmit} 
        isPending={isPending} 
        submitLabel="Guardar Cambios" 
        isEditMode={true}
      />
    </div>
  );
}
