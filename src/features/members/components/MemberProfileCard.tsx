import Link from 'next/link';
import Image from 'next/image';
import { MemberProfileCardProps } from '../interfaces/members.interface';
import RegisterPaymentButton from '@/features/payments/components/RegisterPaymentButton';
import { Pencil, User, HeartPulse, Star } from 'lucide-react';

export function MemberProfileCard({
  member,
  displayStatus,
  safeStatusStyles,
  defaultAmount,
}: MemberProfileCardProps) {
  
  const formattedBirthDate = member.birthDate 
    ? member.birthDate.split('T')[0].split('-').reverse().join('/')
    : '-';

  const memberSince = member.createdAt
    ? new Date(member.createdAt).toLocaleDateString('es-ES', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <aside 
      className="lg:col-span-1 bg-surface border border-border-primary rounded-lg p-6 flex flex-col transition-colors shadow-sm"
      aria-labelledby="profile-heading"
    >
      <header className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-text-main uppercase tracking-wider">
          Perfil del Socio
        </span>
        <span
          className={`px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-widest uppercase ${safeStatusStyles}`}
          aria-label={`Estado actual: ${displayStatus}`}
        >
          {displayStatus}
        </span>
      </header>

      <div className="flex flex-col items-center mb-8 pt-4 border-t border-border-primary">
        <div className="w-24 h-24 bg-background border border-border-primary rounded-full flex items-center justify-center mb-4 shadow-inner relative overflow-hidden">
          {member.profileImageUrl ? (
            <Image
              src={member.profileImageUrl}
              alt={`Foto de perfil de ${member.name} ${member.surname}`}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <User size={40} className="text-text-muted" aria-hidden="true" />
          )}
        </div>
        <h2 id="profile-heading" className="text-xl font-bold text-text-main text-center">
          {member.name} {member.surname}
        </h2>
        
        {memberSince && (
          <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold text-brand-main bg-brand-surface border border-brand-main/20 px-3 py-1 rounded-full shadow-sm">
            <Star size={12} className="fill-brand-main/50" aria-hidden="true" />
            <span className="uppercase tracking-wider">Socio desde {memberSince}</span>
          </div>
        )}
      </div>

      <dl className="flex flex-col gap-6 border-t border-border-primary pt-6">
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-text-muted font-bold uppercase tracking-wider">
            Teléfono
          </dt>
          <dd className="text-sm text-text-main font-medium">
            {member.phoneNumber || '-'}
          </dd>
        </div>
        
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-text-muted font-bold uppercase tracking-wider">
            Fecha de nacimiento
          </dt>
          <dd className="text-sm text-text-main font-medium">
            {formattedBirthDate}
          </dd>
        </div>

        <div className="flex flex-col gap-3 p-3 bg-danger-main/5 border border-danger-main/20 rounded-md">
          <div className="flex items-center gap-2">
            <HeartPulse size={16} className="text-danger-main" aria-hidden="true" />
            <dt className="text-xs font-bold text-danger-main uppercase tracking-wider">
              Contacto de Emergencia
            </dt>
          </div>
          {member.emergencyContact ? (
            <dd className="flex flex-col gap-1">
              <span className="text-sm font-bold text-text-main">
                {member.emergencyContact.name}{' '}
                <span className="font-normal text-text-muted">
                  ({member.emergencyContact.relationship})
                </span>
              </span>
              <span className="text-sm text-text-main font-medium">
                {member.emergencyContact.phoneNumber}
              </span>
            </dd>
          ) : (
            <dd className="text-xs text-text-muted">
              Sin contacto registrado
            </dd>
          )}
        </div>

        {member.observations && (
          <div className="flex flex-col gap-1">
            <dt className="text-xs text-text-muted font-bold uppercase tracking-wider">
              Observaciones
            </dt>
            <dd className="text-sm text-text-main leading-relaxed">
              {member.observations}
            </dd>
          </div>
        )}
      </dl>

      <footer className="flex flex-col gap-3 mt-8 pt-6 border-t border-border-primary">
        <RegisterPaymentButton
          memberName={member.name}
          memberSurname={member.surname}
          uuid={member.uuid}
          defaultAmount={defaultAmount}
        />
        <Link
          href={`/admin/alumnos/${member.uuid}/editar`}
          className="w-full py-2.5 px-4 rounded-sm font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 border border-border-primary bg-background hover:bg-surface-hover text-text-main shadow-sm uppercase"
        >
          <Pencil size={14} aria-hidden="true" /> Editar Ficha
        </Link>
      </footer>
    </aside>
  );
}
