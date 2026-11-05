'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useUpdateMember,
  useMember,
} from '@/features/members/hooks/useMembers';
import {
  memberSchema,
  MemberFormInput,
  MemberFormValues,
} from '@/features/members/schemas/member.schema';
import { UpdateMemberPayload } from '../interfaces/members.interface';
import { InputField } from '@/common/components/ui/InputField';
import { TextareaField } from '@/common/components/ui/TextareaField';
import { ImageUpload } from '@/common/components/ui/ImageUpload';
import { uploadImageToCloudinary } from '@/common/services/cloudinary.service';
import { Phone, IdCard, Loader2, HeartPulse, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProfessors } from '@/features/professors/hooks/useProfessors';

export function EditMemberForm({ id }: { id: string }) {
  const router = useRouter();
  const { data: member, isLoading } = useMember(id);
  const { data: professors = [], isLoading: isLoadingProfessors } = useProfessors();
  const updateMemberMutation = useUpdateMember();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormInput, unknown, MemberFormValues>({
    resolver: zodResolver(memberSchema) as unknown as Resolver<MemberFormInput, unknown, MemberFormValues>,
    defaultValues: {
      dni: '',
      name: '',
      surname: '',
      phoneNumber: '',
      birthDate: '',
      professorAssignedUuid: '',
      observations: '',
      emergencyName: '',
      emergencyPhone: '',
      emergencyRelation: '',
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        dni: member.dni,
        name: member.name,
        surname: member.surname,
        phoneNumber: member.phoneNumber || '',
        birthDate: member.birthDate
          ? new Date(member.birthDate).toISOString().split('T')[0]
          : '',
        professorAssignedUuid: member.professorAssignedUuid || member.professorAssigned?.uuid || '',
        observations: member.observations || '',
        emergencyName: member.emergencyContact?.name || '',
        emergencyPhone: member.emergencyContact?.phoneNumber || '',
        emergencyRelation: member.emergencyContact?.relationship || '',
      });
    }
  }, [member, reset]);

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    if (!file) {
      setImageDeleted(true);
    } else {
      setImageDeleted(false);
    }
  };

  const onSubmit = async (data: MemberFormValues) => {
    setIsUploading(true);
    try {
      let profileImageUrl = member?.profileImageUrl;

      if (selectedImage) {
        profileImageUrl = await uploadImageToCloudinary(selectedImage);
      } else if (imageDeleted) {
        profileImageUrl = null;
      }

      const hasEmergency = !!(data.emergencyName && data.emergencyPhone && data.emergencyRelation);

      const payload: UpdateMemberPayload = {
        dni: data.dni,
        name: data.name,
        surname: data.surname,
        birthDate: data.birthDate,
        phoneNumber: data.phoneNumber || undefined,
        professorAssignedUuid: data.professorAssignedUuid?.trim() || null,
        observations: data.observations || undefined,
        profileImageUrl: profileImageUrl as string | undefined | null,
        emergencyContact: hasEmergency
          ? {
              name: data.emergencyName as string,
              phoneNumber: data.emergencyPhone as string,
              relationship: data.emergencyRelation as string,
            }
          : null,
      };

      updateMemberMutation.mutate(
        { id, payload },
        {
          onSuccess: () => {
            toast.success('Datos del socio actualizados exitosamente');
            router.refresh();
            router.push(`/admin/alumnos/${id}`);
          },
        }
      );
    } catch (error: unknown) {
      console.error('[EditMemberForm] Error uploading image:', error);
      toast.error('Error al procesar la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = updateMemberMutation.isPending || isUploading;

  if (isLoading) {
    return (
      <div 
        className="flex flex-col justify-center items-center h-64"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-3" aria-hidden="true" />
        <span className="text-text-muted text-sm">
          Cargando datos del socio...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <div className="border border-border-primary rounded-lg bg-surface flex flex-col p-6 gap-8 shadow-sm">
          
          <fieldset className="flex flex-col gap-6">
            <legend className="sr-only">Identidad y Contacto</legend>
            <h2 className="text-[15px] font-bold text-text-main">
              Identidad y Contacto
            </h2>

            <div className="flex justify-center pb-4">
              <ImageUpload 
                currentImageUrl={member?.profileImageUrl}
                onImageSelect={handleImageSelect} 
                disabled={isSubmitting} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="DNI"
                type="text"
                placeholder="12345678"
                registration={register('dni')}
                error={errors.dni?.message}
                disabled={isSubmitting}
                icon={<IdCard size={14} className="text-text-muted" aria-hidden="true" />}
                className="md:col-span-2"
              />

              <InputField
                label="Primer Nombre"
                type="text"
                registration={register('name')}
                error={errors.name?.message}
                disabled={isSubmitting}
              />

              <InputField
                label="Apellido"
                type="text"
                registration={register('surname')}
                error={errors.surname?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <InputField
                label="Fecha de Nacimiento"
                type="date"
                registration={register('birthDate')}
                error={errors.birthDate?.message}
                disabled={isSubmitting}
              />

              <InputField
                label="Teléfono (Opcional)"
                type="tel"
                placeholder="+5491123456789"
                registration={register('phoneNumber')}
                error={errors.phoneNumber?.message}
                disabled={isSubmitting}
                icon={<Phone size={14} className="text-text-muted" aria-hidden="true" />}
              />
            </div>

            {/* Asignación Manual de Profesor */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell size={14} className="text-brand-main" aria-hidden="true" />
                <span>Profesor / Entrenador Asignado</span>
                <span className="text-[10px] text-text-muted font-normal lowercase">(opcional)</span>
              </label>
              <select
                {...register('professorAssignedUuid')}
                disabled={isSubmitting || isLoadingProfessors}
                className="w-full bg-background border border-border-primary rounded-lg px-3 py-2 text-xs text-text-main focus:outline-none focus:border-brand-main transition-colors disabled:opacity-50 cursor-pointer"
              >
                <option value="">Sin profesor asignado (Opcional)</option>
                {professors.map((prof) => (
                  <option key={prof.uuid} value={prof.uuid}>
                    {prof.name} {prof.surname} ({prof.email})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-text-muted">
                Asigna o reasigna manualmente el profesor para que este alumno aparezca en su lista de entrenamiento.
              </p>
            </div>
          </fieldset>

          <hr className="border-border-primary" />

          <fieldset className="flex flex-col gap-6">
            <legend className="sr-only">Información de Emergencia</legend>
            <div className="flex items-center gap-2">
              <HeartPulse className="text-danger-main" size={20} aria-hidden="true" />
              <h2 className="text-[15px] font-bold text-text-main">Información de Emergencia (Opcional)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Nombre del Contacto"
                type="text"
                disabled={isSubmitting}
                registration={register('emergencyName')}
                error={errors.emergencyName?.message}
              />
              <InputField
                label="Teléfono"
                type="tel"
                placeholder="+549..."
                disabled={isSubmitting}
                registration={register('emergencyPhone')}
                error={errors.emergencyPhone?.message}
                icon={<Phone size={14} className="text-text-muted" aria-hidden="true" />}
              />
              <InputField
                label="Parentesco"
                type="text"
                placeholder="Ej. Madre, Hermano"
                disabled={isSubmitting}
                registration={register('emergencyRelation')}
                error={errors.emergencyRelation?.message}
              />
            </div>
          </fieldset>

          <hr className="border-border-primary" />
          
          <fieldset className="flex flex-col gap-6">
            <legend className="sr-only">Información Médica o Adicional</legend>
            <h2 className="text-[15px] font-bold text-text-main">
              Información Médica / Adicional
            </h2>
            <TextareaField
              label="Observaciones / Notas"
              placeholder="Excepciones físicas, condición. Datos relevantes"
              registration={register('observations')}
              error={errors.observations?.message}
              disabled={isSubmitting}
              rows={4}
            />
          </fieldset>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-primary">
            <Link
              href={`/admin/alumnos/${id}`}
              className="px-6 py-2.5 border border-border-primary bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover rounded-sm text-sm font-medium transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-main hover:bg-brand-hover text-white rounded-sm text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer min-w-35"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
