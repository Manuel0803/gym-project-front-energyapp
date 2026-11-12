'use client';

import { useState, useRef } from 'react';
import { useMyProfile, useUpdateMyProfile } from '../hooks/useStudent';
import { StudentProfile } from '../interfaces/student.interface';
import {
  User,
  Phone,
  HeartPulse,
  Camera,
  Lock,
  Save,
  Loader2,
  ShieldCheck,
  Upload,
  AlertOctagon,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentProfileFormProps {
  profile: StudentProfile;
}

function StudentProfileForm({ profile }: StudentProfileFormProps) {
  const { mutate: updateProfile, isPending: isSaving } = useUpdateMyProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pure state initialization directly from loaded profile (no cascading useEffect renders)
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '');
  const [profileImage, setProfileImage] = useState<string | null>(
    profile.profileImageUrl || null
  );
  const [emergencyName, setEmergencyName] = useState(
    profile.emergencyContact?.name || ''
  );
  const [emergencyRelationship, setEmergencyRelationship] = useState(
    profile.emergencyContact?.relationship || ''
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    profile.emergencyContact?.phoneNumber || ''
  );

  // File upload with client validation (JPG/PNG and max 2MB) (CHGYM2-96)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict format check: JPG or PNG only
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido. Solo se admiten imágenes JPG o PNG.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Strict size check: max 2MB (2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('La imagen supera el límite máximo permitido de 2MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read and preview file
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const sanitizePhone = (val: string) => val.replace(/[\s\-().]/g, '').trim();

  const STATE_LABELS: Record<string, string> = {
    ACTIVE: 'Activo',
    SUSPENDED: 'Suspendido',
    INACTIVE: 'Inactivo',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedPhone = sanitizePhone(phoneNumber);
    const cleanedEmergencyPhone = sanitizePhone(emergencyPhone);

    updateProfile({
      phoneNumber: cleanedPhone || undefined,
      profileImageUrl: profileImage,
      emergencyContact: emergencyName.trim()
        ? {
            name: emergencyName.trim(),
            relationship: emergencyRelationship.trim() || 'Familiar',
            phoneNumber: cleanedEmergencyPhone,
          }
        : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight flex items-center gap-2">
          <User className="text-brand-main" size={22} aria-hidden="true" />
          <span>Mi Perfil de Socio</span>
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Actualizá tu información de contacto y foto para el sistema de acceso.
        </p>
      </div>

      {/* Profile Avatar & Upload */}
      <div className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm flex flex-col items-center text-center gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-brand-surface border-2 border-brand-main/40 flex items-center justify-center text-brand-main font-bold text-2xl shadow-sm">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              `${profile.name.charAt(0)}${profile.surname.charAt(0)}`
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-main text-white shadow-sm hover:bg-brand-hover transition-transform active:scale-95 cursor-pointer"
            title="Cambiar foto de perfil"
            aria-label="Cambiar foto de perfil"
          >
            <Camera size={15} aria-hidden="true" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Seleccionar foto de perfil"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-brand-main hover:underline cursor-pointer flex items-center gap-1 mx-auto"
          >
            <Upload size={13} aria-hidden="true" />
            <span>Subir nueva foto</span>
          </button>
          <span className="text-[10px] text-text-muted block mt-0.5">
            Solo JPG o PNG (máximo 2MB)
          </span>
        </div>
      </div>

      {/* Read-Only Informative Locked Section (CHGYM2-96) */}
      <div className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-border-primary">
          <div className="flex items-center gap-2 text-xs font-bold text-text-main">
            <Lock size={14} className="text-text-muted" aria-hidden="true" />
            <span>Datos Personales (Solo Lectura)</span>
          </div>
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest bg-background px-2 py-0.5 rounded border border-border-primary">
            Protegido
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Nombre y Apellido */}
          <div className="p-3 rounded-lg bg-background border border-border-primary flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Nombre Completo
            </span>
            <span className="font-bold text-text-main mt-0.5">
              {profile.name} {profile.surname}
            </span>
          </div>

          {/* DNI */}
          <div className="p-3 rounded-lg bg-background border border-border-primary flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              DNI / Documento
            </span>
            <span className="font-mono font-bold text-text-main mt-0.5">
              {profile.dni || '-'}
            </span>
          </div>

          {/* Estado de Membresía */}
          <div className="p-3 rounded-lg bg-background border border-border-primary flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Estado de Membresía
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck size={14} className="text-success-main" aria-hidden="true" />
              <span className="font-bold text-success-main">
                {STATE_LABELS[(profile.state || '').toUpperCase()] || profile.state || 'Activo'}
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="p-3 rounded-lg bg-background border border-border-primary flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Correo Electrónico
            </span>
            <span className="font-medium text-text-muted truncate mt-0.5">
              {profile.email || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Editable Fields Section (CHGYM2-96) */}
      <div className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border-primary text-xs font-bold text-text-main">
          <Phone size={14} className="text-brand-main" aria-hidden="true" />
          <span>Datos de Contacto Editables</span>
        </div>

        {/* Teléfono Propio */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="student-phone"
            className="text-[10px] font-bold uppercase tracking-widest text-text-muted"
          >
            Teléfono Móvil / WhatsApp
          </label>
          <input
            id="student-phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ej: +54 9 362 4123456"
            className="h-9 w-full px-3 text-xs rounded-lg bg-background border border-border-primary text-text-main focus:outline-none focus:border-brand-main font-mono"
          />
        </div>

        {/* Contacto de Emergencia */}
        <div className="pt-2 border-t border-border-primary flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-danger-main">
            <HeartPulse size={15} aria-hidden="true" />
            <span>Contacto de Emergencia</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="emergency-name"
              className="text-[10px] font-bold uppercase tracking-widest text-text-muted"
            >
              Nombre del Contacto
            </label>
            <input
              id="emergency-name"
              type="text"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              placeholder="Ej: María Gómez"
              className="h-9 w-full px-3 text-xs rounded-lg bg-background border border-border-primary text-text-main focus:outline-none focus:border-brand-main"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="emergency-rel"
                className="text-[10px] font-bold uppercase tracking-widest text-text-muted"
              >
                Vínculo / Parentesco
              </label>
              <input
                id="emergency-rel"
                type="text"
                value={emergencyRelationship}
                onChange={(e) => setEmergencyRelationship(e.target.value)}
                placeholder="Ej: Madre, Pareja, Hermano"
                className="h-9 w-full px-3 text-xs rounded-lg bg-background border border-border-primary text-text-main focus:outline-none focus:border-brand-main"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="emergency-phone"
                className="text-[10px] font-bold uppercase tracking-widest text-text-muted"
              >
                Teléfono de Emergencia
              </label>
              <input
                id="emergency-phone"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="Ej: +54 9 362 4987654"
                className="h-9 w-full px-3 text-xs rounded-lg bg-background border border-border-primary text-text-main focus:outline-none focus:border-brand-main font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-2.5 px-4 rounded-lg bg-brand-main hover:bg-brand-hover text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            <span>Guardando Cambios...</span>
          </>
        ) : (
          <>
            <Save size={16} aria-hidden="true" />
            <span>Guardar Mis Datos</span>
          </>
        )}
      </button>
    </form>
  );
}

export function StudentProfileView() {
  const { data: profile, isLoading, isError, error } = useMyProfile();

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-text-muted">
        <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" />
        <span className="text-xs font-medium">Cargando tus datos de perfil...</span>
      </div>
    );
  }

  if (isError || !profile) {
    const isForbidden =
      (error as { response?: { status?: number } })?.response?.status === 403;

    return (
      <div className="p-8 rounded-lg bg-surface border border-border-primary text-center flex flex-col items-center gap-3 my-4 shadow-sm">
        <div className="w-12 h-12 rounded-lg bg-danger-surface text-danger-main flex items-center justify-center">
          <AlertOctagon size={24} aria-hidden="true" />
        </div>
        <h3 className="text-sm font-bold text-text-main">
          {isForbidden
            ? 'Acceso exclusivo para Alumnos'
            : 'No se pudo cargar el perfil'}
        </h3>
        <p className="text-xs text-text-muted max-w-xs leading-relaxed">
          {isForbidden
            ? 'El usuario conectado no tiene rol de socio (CUSTOMER) o carece de un perfil de alumno asociado en este gimnasio.'
            : 'Ocurrió un error al cargar la información. Intenta nuevamente en unos instantes.'}
        </p>
      </div>
    );
  }

  return <StudentProfileForm key={profile.uuid} profile={profile} />;
}
