'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useMembers } from '../hooks/useMembers';
import { usePlans } from '@/features/plans/hooks/usePlans';
import { MemberList } from './MemberList';
import { MembersToolbar, SortOption } from './MembersToolbar';
import { MembersTableHeader } from './MembersTableHeader';
import { MembersPagination } from './MembersPagination';
import { ImportMembersModal } from './ImportMembersModal';
import { TableSkeleton } from '@/common/components/ui/skeletons/TableSkeleton';
import { MemberSortBy, SortOrder } from '../interfaces/members.interface';

const ITEMS_PER_PAGE = 10;

const getMidnightTime = (dateInput?: string | Date) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function MembersDirectory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filter = (searchParams.get('filter') as 'RELEVANT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') || 'RELEVANT';
  const currentPage = Number(searchParams.get('page')) || 1;
  const selectedPlanId = searchParams.get('planId') || '';
  const sortBy = searchParams.get('sortBy') as MemberSortBy | null;
  const order = searchParams.get('order') as SortOrder | null;
  const q = searchParams.get('q') || undefined;

  const sortConfig = sortBy && order ? { sortBy, order } : null;

  const updateParams = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const prevQRef = useRef(q);
  useEffect(() => {
    if (prevQRef.current !== q) {
      prevQRef.current = q;
      updateParams({ page: 1 });
    }
  }, [q, updateParams]);

  const { data: plansResponse } = usePlans(1, 100);
  const plans = plansResponse?.data || [];

  const stateQuery = filter === 'RELEVANT' ? 'ACTIVE,SUSPENDED' : filter;

  const { data: response, isLoading } = useMembers({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    term: q,
    state: stateQuery,
    planId: selectedPlanId || undefined,
    sortBy: sortConfig?.sortBy,
    order: sortConfig?.order,
  });

  const members = response?.data || [];
  const totalPages = response?.meta?.lastPage || 1;

  const handlePlanChange = (planId: string) => {
    updateParams({ planId, page: 1 });
  };

  const handleSortChange = (value: SortOption) => {
    switch (value) {
      case 'createdAt_desc':
        updateParams({ sortBy: 'createdAt', order: 'desc', page: 1 });
        break;
      case 'name_asc':
        updateParams({ sortBy: 'name', order: 'asc', page: 1 });
        break;
      case 'name_desc':
        updateParams({ sortBy: 'name', order: 'desc', page: 1 });
        break;
      case 'surname_asc':
        updateParams({ sortBy: 'surname', order: 'asc', page: 1 });
        break;
      case 'surname_desc':
        updateParams({ sortBy: 'surname', order: 'desc', page: 1 });
        break;
      default:
        updateParams({ sortBy: null, order: null, page: 1 });
        break;
    }
  };

  const handleSortName = () => {
    if (!sortConfig || sortConfig.sortBy !== 'name') {
      updateParams({ sortBy: 'name', order: 'asc', page: 1 });
    } else if (sortConfig.order === 'asc') {
      updateParams({ sortBy: 'name', order: 'desc', page: 1 });
    } else {
      updateParams({ sortBy: null, order: null, page: 1 });
    }
  };

  const handleFilterChange = (
    newFilter: 'RELEVANT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ) => {
    updateParams({ filter: newFilter, page: 1 });
  };

  const todayMidnight = getMidnightTime();

  if (isLoading && members.length === 0) {
    return <TableSkeleton showToolbar />;
  }

  return (
    <section className="bg-background flex flex-col gap-6" aria-label="Directorio de miembros">
      <MembersToolbar
        selectedPlanId={selectedPlanId}
        onPlanChange={handlePlanChange}
        plans={plans}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        filter={filter}
        onFilterChange={handleFilterChange}
        onImportClick={() => setIsImportModalOpen(true)}
      />

      <div className="bg-surface border border-border-primary rounded-lg flex flex-col overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-225" role="table" aria-label="Lista de miembros">
            <MembersTableHeader
              sortConfig={sortConfig}
              onSortName={handleSortName}
            />

            <div className="flex flex-col relative" aria-live="polite">
              {isLoading && members.length > 0 && (
                <div className="absolute inset-0 bg-surface/60 flex flex-col items-center justify-center z-10 backdrop-blur-[2px]">
                  <Loader2 className="w-8 h-8 text-brand-main animate-spin mb-3" aria-hidden="true" />
                  <p className="text-text-muted text-sm font-medium">
                    Actualizando lista...
                  </p>
                </div>
              )}

              {members.length > 0 ? (
                members.map((member) => {
                  const activeSub =
                    member.subscriptions?.find(
                      (sub) =>
                        sub.status === 'ACTIVE' &&
                        getMidnightTime(sub.startDate) <= todayMidnight &&
                        getMidnightTime(sub.endDate) >= todayMidnight
                    ) ||
                    member.subscriptions?.find(
                      (sub) =>
                        sub.status === 'ACTIVE' &&
                        getMidnightTime(sub.endDate) >= todayMidnight
                    );

                  const latestSub = member.subscriptions?.[0];
                  const planName = activeSub?.plan?.name || latestSub?.plan?.name || 'Sin plan';

                  let dynamicState = member.state;
                  if (dynamicState === 'ACTIVE' && !activeSub) {
                    dynamicState = 'SUSPENDED';
                  }

                  // V2 payload compatibility: member.user contains personal info
                  const memberName = member.user?.name || member.name || '';
                  const memberSurname = member.user?.surname || member.surname || '';
                  const fullName = `${memberName} ${memberSurname}`.trim() || 'Sin nombre';
                  const memberDni = member.user?.dni || member.dni || '';

                  return (
                    <MemberList
                      key={member.uuid}
                      name={fullName}
                      memberID={memberDni}
                      uuid={member.uuid}
                      status={dynamicState}
                      profileImageUrl={member.profileImageUrl}
                      phoneNumber={member.phoneNumber || ''}
                      birthDate={member.birthDate}
                      observations={member.observations || ''}
                      planName={planName}
                    />
                  );
                })
              ) : (
                !isLoading && (
                  <div className="flex-1 flex items-center justify-center py-16 text-sm text-text-muted">
                    No hay miembros que coincidan con los filtros seleccionados.
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <MembersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          onPrevPage={() => currentPage > 1 && updateParams({ page: currentPage - 1 })}
          onNextPage={() =>
            currentPage < totalPages && updateParams({ page: currentPage + 1 })
          }
        />
      </div>

      <ImportMembersModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </section>
  );
}
