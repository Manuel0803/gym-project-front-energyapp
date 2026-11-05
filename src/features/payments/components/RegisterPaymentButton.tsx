'use client';

import { useState } from 'react';
import { PaymentForm } from './PaymentForm';
import { RegisterPaymentButtonProps } from '../interfaces/payments.interface';
import { Modal } from '@/common/components/ui/Modal';
import { CreditCard } from 'lucide-react';

export default function RegisterPaymentButton({
  memberName,
  memberSurname,
  uuid,
  defaultAmount,
}: RegisterPaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        className="w-full py-2.5 bg-brand-main hover:bg-brand-hover text-white font-medium text-sm transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <CreditCard size={18} aria-hidden="true" />
        <span>Registrar nuevo pago</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Registrar Pago"
      >
        <PaymentForm
          memberName={memberName}
          memberSurname={memberSurname}
          uuid={uuid}
          defaultAmount={defaultAmount}
          onSuccess={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}
