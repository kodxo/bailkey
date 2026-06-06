import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ScheduleDisplayDTO } from "@/app/(agence)/dashboard/gestion/echeances/components/schedule-serializer";

export function generateReceipt(schedule: ScheduleDisplayDTO) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(33, 33, 33);
  doc.text("BAILKEY", 14, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Gestion locative simplifiée", 14, 32);

  // Title depending on status
  const isPartial = schedule.status === "PARTIAL";
  const title = isPartial ? "REÇU DE PAIEMENT PARTIEL" : "QUITTANCE DE LOYER";
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, 50);
  
  // Date and details
  doc.setFontSize(12);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
  doc.text(`Date d'édition : ${formattedDate}`, 14, 60);
  doc.text(`Locataire : ${schedule.tenantName}`, 14, 70);
  doc.text(`Bien : ${schedule.propertyInfo}`, 14, 78);
  doc.text(`Échéance du : ${schedule.date}`, 14, 86);
  
  // Financial Summary
  doc.setFontSize(14);
  doc.text("Résumé Financier", 14, 105);

  const totalPaid = schedule.amount - schedule.remaining;
  const rentAmount = schedule.rentAmount || 0;
  const chargesAmount = schedule.chargesAmount || 0;
  
  autoTable(doc, {
    startY: 110,
    head: [['Description', 'Montant']],
    body: [
      ['Loyer de base', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(rentAmount)}`],
      ['Provision pour charges', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(chargesAmount)}`],
      ['Total Quittancé', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(schedule.amount)}`],
      ['Montant encaissé', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(totalPaid)}`],
      ['Reste à payer', `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(schedule.remaining)}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // History of payments
  if (schedule.payments && schedule.payments.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    doc.setFontSize(14);
    doc.text("Détail des Encaissements", 14, finalY + 15);
    
    const paymentData = schedule.payments.map(p => [
      p.date,
      p.method,
      p.reference || "-",
      `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(Number(p.amount))}`
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Date', 'Méthode', 'Référence', 'Montant']],
      body: paymentData,
      theme: 'grid',
    });
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.text("Document généré informatiquement par Bailkey. La présente quittance ne libère le locataire qu'à hauteur du montant encaissé.", 14, pageHeight - 15, { maxWidth: 180 });

  // Download the PDF
  doc.save(`Quittance_${schedule.tenantName.replace(/\s+/g, '_')}_${schedule.date.replace(/\s+/g, '_')}.pdf`);
}
