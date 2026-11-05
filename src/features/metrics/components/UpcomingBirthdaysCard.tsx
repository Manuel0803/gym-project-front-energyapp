import Link from 'next/link';
import Image from 'next/image';
import { UpcomingBirthday } from '../interfaces/metrics.interface';
import { Cake } from 'lucide-react';

interface UpcomingBirthdaysCardProps {
  birthdays: UpcomingBirthday[];
}

export function UpcomingBirthdaysCard({ birthdays }: UpcomingBirthdaysCardProps) {
  return (
    <section 
      className="bg-surface border border-border-primary rounded-lg flex flex-col transition-colors overflow-hidden h-full shadow-sm"
      aria-labelledby="upcoming-birthdays-title"
    >
      <header className="flex items-center justify-between p-5 border-b border-border-primary shrink-0">
        <h2 id="upcoming-birthdays-title" className="text-sm font-bold text-text-main transition-colors flex items-center gap-2">
          <Cake aria-hidden="true" /> Cumpleaños (7 días)
        </h2>
        <div 
          className="text-xs font-bold text-brand-main bg-brand-surface px-2 py-0.5 rounded shadow-sm"
          aria-label={`${birthdays.length} cumpleaños próximos`}
          title={`${birthdays.length} cumpleaños próximos`}
        >
          {birthdays.length}
        </div>
      </header>

      <div className="flex-1 p-0 overflow-y-auto min-h-0 max-h-80 relative">
        {birthdays.length === 0 ? (
          <div className="p-6 text-center text-sm text-text-muted flex-1 flex items-center justify-center h-full">
            No hay cumpleaños próximos.
          </div>
        ) : (
          <ul className="flex flex-col m-0 p-0 list-none">
            {birthdays.map((birthday, index) => (
              <li key={birthday.id} className="w-full">
                <Link
                  href={`/admin/alumnos/${birthday.id}`}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors cursor-pointer w-full focus:outline-none focus-visible:bg-surface-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-main ${
                    index !== birthdays.length - 1 ? 'border-b border-border-primary' : ''
                  }`}
                  aria-label={`Ver perfil de ${birthday.name}. Cumpleaños: ${birthday.isToday ? '¡Hoy!' : `en ${birthday.daysLeft} días`}`}
                  title={`Ver perfil de ${birthday.name}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className="w-8 h-8 shrink-0 rounded-full bg-background border border-border-primary flex items-center justify-center text-xs font-bold text-text-muted transition-colors relative overflow-hidden shadow-sm"
                      aria-hidden="true"
                    >
                      {birthday.profileImageUrl ? (
                        <Image 
                          src={birthday.profileImageUrl} 
                          alt=""
                          fill 
                          sizes="32px"
                          className="object-cover" 
                        />
                      ) : (
                        birthday.initials
                      )}
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm text-text-main font-medium transition-colors truncate">
                        {birthday.name}
                      </span>
                      <span className="text-xs text-text-muted">
                        {(() => {
                          const [, month, day] = birthday.birthDate.split('T')[0].split('-');
                          return `${day}/${month}`;
                        })()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end shrink-0 ml-3">
                    {birthday.isToday ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-brand-main text-white rounded-full flex items-center gap-1 shadow-sm">
                        ¡HOY!
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-text-muted">
                        En {birthday.daysLeft} {birthday.daysLeft === 1 ? 'día' : 'días'}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
