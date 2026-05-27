"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PaymentMethod } from "@/lib/generated/prisma/enums";
import { recordPaymentAction } from "@/lib/actions/payments";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  expectedAmount: number;
  paidAmount: number;
}

export function RecordPaymentModal({ isOpen, onClose, scheduleId, expectedAmount, paidAmount }: RecordPaymentModalProps) {
  const [state, formAction, isPending] = useActionState(recordPaymentAction, null);
  
  const remaining = expectedAmount - paidAmount;
  const defaultDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (state?.success) {
      toast.success("Paiement enregistré avec succès");
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <input type="hidden" name="scheduleId" value={scheduleId} />
          <DialogHeader>
            <DialogTitle>Enregistrer un encaissement</DialogTitle>
            <DialogDescription>
              Le reste à payer pour cette échéance est de {remaining} XAF.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right text-sm">
                Montant
              </label>
              <div className="col-span-3">
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  defaultValue={remaining}
                  min="0"
                  step="0.01"
                />
                {state?.errors?.amount && <p className="text-xs text-error mt-1">{state.errors.amount[0]}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right text-sm">
                Date
              </label>
              <div className="col-span-3">
                <Input
                  id="date"
                  name="paymentDate"
                  type="date"
                  defaultValue={defaultDate}
                />
                {state?.errors?.paymentDate && <p className="text-xs text-error mt-1">{state.errors.paymentDate[0]}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="method" className="text-right text-sm">
                Mode
              </label>
              <div className="col-span-3">
                <Select 
                  name="paymentMethod"
                  defaultValue={PaymentMethod.CASH}
                  options={[
                    { label: "Espèces (Cash)", value: PaymentMethod.CASH },
                    { label: "Mobile Money", value: PaymentMethod.MOBILE_MONEY },
                    { label: "Virement Bancaire", value: PaymentMethod.BANK_TRANSFER },
                    { label: "Chèque", value: PaymentMethod.CHEQUE }
                  ]}
                />
                {state?.errors?.paymentMethod && <p className="text-xs text-error mt-1">{state.errors.paymentMethod[0]}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="ref" className="text-right text-sm">
                Réf. (Opt)
              </label>
              <div className="col-span-3">
                <Input
                  id="ref"
                  name="reference"
                  placeholder="N° de transaction..."
                />
                {state?.errors?.reference && <p className="text-xs text-error mt-1">{state.errors.reference[0]}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Encaisser"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
