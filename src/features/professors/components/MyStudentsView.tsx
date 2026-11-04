'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyStudents } from '../hooks/useProfessors';
import {
  Users,
  Search,
  Dumbbell,
  Phone,
  Loader2,
  FileText,
  HeartPulse,
} from 'lucide-react';

export function MyStudentsView() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: students = [], isLoading } = useMyStudents({
    term: searchTerm || undefined,
  });

  const filteredStudents = students.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const fullName = `${s.name} ${s.surname}`.toLowerCase();
    const dni = s.dni?.toLowerCase() || '';
    return fullName.includes(term) || dni.includes(term);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido o DNI..."
            className="h-9 w-full pl-9 pr-4 text-xs rounded-lg bg-surface border border-border-primary text-text-main placeholder:text-text-muted focus:outline-none focus:border-brand-main transition-colors shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Users size={15} aria-hidden="true" />
          <span>
            Total asignados:{' '}
            <strong className="text-text-main font-bold">
              {filteredStudents.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Students List / Grid */}
      <div className="relative min-h-60">
        {isLoading && (
          <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 rounded-lg">
            <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-2" aria-hidden="true" />
            <span className="text-xs font-medium text-text-muted">Cargando alumnos asignados...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const hasEmergency = Boolean(
              student.emergencyContact?.name || student.emergencyContact?.phoneNumber
            );

            return (
              <div
                key={student.uuid}
                className="p-5 rounded-lg bg-surface border border-border-primary shadow-sm hover:border-brand-main/40 transition-colors flex flex-col justify-between gap-4"
              >
                {/* Header: Student Identity */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-background border border-border-primary text-brand-main font-bold flex items-center justify-center text-xs shrink-0">
                        {student.name.charAt(0)}
                        {student.surname.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-text-main truncate">
                          {student.name} {student.surname}
                        </h2>
                        <p className="text-[11px] text-text-muted font-mono">
                          DNI: {student.dni}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border uppercase bg-success-surface text-success-main border-success-main/30 shrink-0">
                      <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-success-main" aria-hidden="true" />
                      {student.state || 'Activo'}
                    </span>
                  </div>

                  {/* Contact Info (Phone) */}
                  {student.phoneNumber && (
                    <div className="flex items-center gap-2 text-xs text-text-muted pt-1">
                      <Phone size={13} className="text-brand-main shrink-0" aria-hidden="true" />
                      <a
                        href={`tel:${student.phoneNumber}`}
                        className="hover:text-text-main transition-colors font-mono"
                      >
                        {student.phoneNumber}
                      </a>
                    </div>
                  )}

                  {/* Emergency Contact Badge */}
                  {hasEmergency && (
                    <div className="p-2.5 rounded-lg bg-danger-surface border border-danger-main/30 flex flex-col gap-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-danger-main font-bold">
                        <HeartPulse size={13} aria-hidden="true" />
                        <span>Contacto de Emergencia:</span>
                      </div>
                      <p className="text-text-main font-medium pl-4">
                        {student.emergencyContact?.name}
                        {student.emergencyContact?.relationship && (
                          <span className="text-text-muted font-normal">
                            {' '}
                            ({student.emergencyContact.relationship})
                          </span>
                        )}
                        {student.emergencyContact?.phoneNumber && (
                          <span className="block text-text-muted font-mono">
                            Tel: {student.emergencyContact.phoneNumber}
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Medical Observations / Notes */}
                  {student.observations && (
                    <div className="p-2.5 rounded-lg bg-background border border-border-primary flex items-start gap-2 text-[11px]">
                      <FileText size={13} className="text-text-muted shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-text-muted line-clamp-2">
                        <strong className="text-text-main">Obs:</strong> {student.observations}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer: Routine Constructor Action */}
                <div className="pt-3 border-t border-border-primary">
                  <Link
                    href={`/profesor/alumnos/${student.uuid}/rutina`}
                    className="w-full py-2 px-3 rounded-lg bg-brand-surface hover:bg-brand-main text-brand-main hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 border border-brand-main/30 shadow-xs cursor-pointer"
                  >
                    <Dumbbell size={15} aria-hidden="true" />
                    <span>Armar Rutina de Entrenamiento</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {!isLoading && filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-surface border border-border-primary rounded-lg p-8">
            <Users size={36} className="text-text-muted mb-2 opacity-50" aria-hidden="true" />
            <p className="text-xs font-bold text-text-main">
              No se encontraron alumnos asignados
            </p>
            <p className="text-[11px] text-text-muted mt-1 max-w-sm">
              No tienes alumnos vinculados a tu turno actualmente o no coinciden con la búsqueda ingresada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
