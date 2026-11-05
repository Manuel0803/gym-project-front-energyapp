'use client';

import { useState } from 'react';
import { useDeleteUser } from '../hooks/useUsers';
import { Modal } from '@/common/components/ui/Modal';
import { Loader2, Trash2 } from 'lucide-react';
import { User } from '../interfaces/user.interface';

export interface DeleteAdminButtonProps {
  admin: User;
  onDeleted: () => void;
}

export function DeleteAdminButton({
  admin,
  onDeleted,
}: DeleteAdminButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const fullName = `${admin.name} ${admin.surname}`;

  const handleDelete = () => {
    deleteUser(admin.uuid, {
      onSuccess: () => {
        setIsModalOpen(false);
        onDeleted();
      },
      onError: (error: unknown) => {
        console.error('[DeleteAdminButton] Failed to revoke admin access:', error);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger-main hover:bg-danger-surface transition-colors cursor-pointer"
        aria-label={`Eliminar al administrador ${fullName}`}
      >
        <Trash2 size={14} aria-hidden="true" /> Eliminar
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isDeleting && setIsModalOpen(false)}
        title="Revocar Acceso"
      >
        <div className="flex flex-col gap-4">
          <p className="text-text-main text-sm">
            ¿Estás seguro de que deseas eliminar a <strong>{fullName}</strong>{' '}
            del sistema? Perderá acceso inmediatamente.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
              aria-disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-text-main border border-border-primary hover:bg-surface-hover transition-colors rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-danger-main hover:bg-danger-hover transition-colors rounded flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Eliminando...</span>
                </>
              ) : (
                <span>Eliminar administrador</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
