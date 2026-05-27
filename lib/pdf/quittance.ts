import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface QuittanceData {
  locataireName: string;
  propertyDesignation: string;
  propertyAddress: string;
  periodStart: Date;
  periodEnd: Date;
  amount: number;
  amountPaid: number;
  remaining: number;
  dateGenerated: Date;
  receiptNumber: string;
}

export function generateQuittancePDF(data: QuittanceData) {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(22);
  doc.setTextColor(41, 128, 185);
  doc.text("Bailkey", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Votre partenaire de gestion locative", 14, 28);
  
  // Titre
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("QUITTANCE DE LOYER", 105, 40, { align: "center" });
  
  doc.setFontSize(11);
  doc.text(`Quittance N°: ${data.receiptNumber}`, 14, 55);
  doc.text(`Date d'émission : ${data.dateGenerated.toLocaleDateString("fr-FR")}`, 14, 62);
  
  // Infos Locataire & Propriété
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 70, 85, 45, "F");
  doc.rect(110, 70, 85, 45, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Informations Locataire :", 18, 78);
  doc.setFont("helvetica", "normal");
  doc.text(data.locataireName, 18, 86);
  
  doc.setFont("helvetica", "bold");
  doc.text("Détails du bien :", 114, 78);
  doc.setFont("helvetica", "normal");
  doc.text(data.propertyDesignation, 114, 86);
  doc.text(data.propertyAddress, 114, 94);
  
  // Détail Financier
  doc.setFont("helvetica", "bold");
  doc.text("Détail du paiement :", 14, 130);
  
  const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF", maximumFractionDigits: 0 });
  const formatPeriod = (d: Date) => d.toLocaleDateString("fr-FR");
  
  autoTable(doc, {
    startY: 135,
    head: [["Description", "Période", "Montant"]],
    body: [
      ["Loyer", `${formatPeriod(data.periodStart)} au ${formatPeriod(data.periodEnd)}`, formatter.format(data.amount)],
      ["Montant payé", "-", formatter.format(data.amountPaid)],
    ],
    foot: [
      ["Reste à payer", "", formatter.format(data.remaining)]
    ],
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185] },
    footStyles: { fillColor: [220, 53, 69] }
  });
  
  // Pied de page
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Généré de manière sécurisée par Bailkey", 105, pageHeight - 15, { align: "center" });
  
  // Sauvegarde
  doc.save(`quittance_${data.receiptNumber}.pdf`);
}
