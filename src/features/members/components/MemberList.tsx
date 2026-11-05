'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MemberListProps } from '../interfaces/members.interface';
import {
  statusStyles,
  dotStyles,
  statusTranslations,
} from '../constants/member-styles-ui.constants';
import { MemberRowActions } from './MemberRowActions';

interface ExtendedMemberListProps extends Omit<MemberListProps, 'birthdate'> {
  profileImageUrl?: string | null;
  birthDate?: string;
}

export function MemberList({
  name,
  memberID,
  uuid,
  status,
  phoneNumber,
  observations,
  planName,
  profileImageUrl,
  birthDate,
}: ExtendedMemberListProps) {
  const router = useRouter();

  const safeStatusStyles = statusStyles[status] || statusStyles['INACTIVE'];
  const safeDotStyles = dotStyles[status] || dotStyles['INACTIVE'];
  const displayStatus = statusTranslations[status] || status;

  const handleRowClick = () => {
    router.push(`/admin/alumnos/${uuid}`);
  };

  const handleMouseEnter = () => {
    router.prefetch(`/admin/alumnos/${uuid}`);
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'NA';

  const formattedBirthDate = birthDate
    ? birthDate.split('T')[0].split('-').reverse().join('/')
    : '-';

  const statusParts = displayStatus.split('/').map((part) => part.trim());

  return (
    <div
      onClick={handleRowClick}
      onMouseEnter={handleMouseEnter}
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
      className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_2fr_1fr_50px] gap-4 items-center px-5 py-4 border-b border-border-primary hover:bg-surface-hover transition-colors min-w-225 cursor-pointer focus:outline-none focus:bg-surface-hover"
    >
      <div className="min-w-0" role="cell">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 shrink-0 rounded-full bg-background border border-border-primary flex items-center justify-center text-xs font-bold text-text-muted relative overflow-hidden"
            aria-hidden="true"
          >
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-main truncate">{name}</p>
            <p className="text-xs text-text-muted mt-0.5 truncate">{memberID}</p>
          </div>
        </div>
      </div>

      <div className="min-w-0" role="cell">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold border rounded-md uppercase transition-colors ${safeStatusStyles}`}
        >
          <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${safeDotStyles}`} aria-hidden="true"></span>
          <span className="flex flex-col text-left leading-[1.1]">
            {statusParts.map((part, index) => (
              <span key={`${uuid}-status-${index}`}>{part}</span>
            ))}
          </span>
        </span>
      </div>

      <div className="min-w-0" role="cell">
        <p className="text-sm font-medium text-text-main truncate">
          {phoneNumber || '-'}
        </p>
      </div>

      <div className="min-w-0" role="cell">
        <p className="text-sm font-medium text-text-main truncate">
          {formattedBirthDate}
        </p>
      </div>

      <div className="min-w-0" role="cell">
        <p className="text-sm font-medium text-text-main truncate">
          {planName || 'Sin plan'}
        </p>
      </div>

      <div className="min-w-0" role="cell">
        <p className="text-sm text-text-muted truncate">
          {observations || '-'}
        </p>
      </div>

      <div className="min-w-0 flex justify-end" role="cell">
        <MemberRowActions uuid={uuid} name={name} />
      </div>
    </div>
  );
}
