# **Spécifications UI/UX : Module Échéances et Encaissements (Bailkey)**

## **1\. Principes de Design Généraux**

* **Clarté visuelle :** L'argent est un sujet sensible. Les montants attendus, payés et restants doivent être lisibles instantanément (typographie grasse, alignement à droite pour les chiffres).  
* **Prévention des erreurs :** Empêcher la saisie d'un montant de paiement supérieur au reste à payer (ou afficher un avertissement clair si on autorise un trop-perçu).  
* **Feedback immédiat :** Utilisation de "Toasts" (notifications éphémères) lors de l'enregistrement d'un paiement ou de la génération de l'échéancier.

## **2\. Langage Visuel et Composants Clés**

### **2.1. Badges de Statut (ScheduleStatus)**

Chaque échéance doit afficher un badge de statut avec une sémantique de couleur stricte (références Tailwind CSS recommandées) :

* ⚪ **PENDING (À payer) :** Fond Gris (bg-slate-100), Texte Gris Foncé (text-slate-700). Icône : Horloge.  
* 🟠 **PARTIAL (Partiel) :** Fond Orange clair (bg-orange-100), Texte Orange (text-orange-700). Icône : Cercle à moitié plein.  
* 🟢 **PAID (Payé) :** Fond Vert clair (bg-emerald-100), Texte Vert (text-emerald-700). Icône : Check.  
* 🔴 **OVERDUE (En retard) :** Fond Rouge clair (bg-rose-100), Texte Rouge (text-rose-700). Icône : Point d'exclamation.

### **2.2. Indicateur de Verrouillage (isLocked)**

* Une icône de cadenas (ex: Lock de Lucide Icons) doit apparaître discrètement à côté du montant d'une échéance si celle-ci a déjà reçu un paiement, signifiant que ses données de base ne sont plus modifiables.

## **3\. Écrans Principaux**

### **Écran A : Le Tableau de Bord Global des Encaissements**

**URL suggérée :** /dashboard/rent-schedules **Objectif :** Permettre au gestionnaire de voir tous les loyers attendus pour le mois en cours, toutes propriétés confondues.

* **Filtres rapides en haut de page :**  
  * Mois concerné (Sélecteur de mois : "Octobre 2026", "Novembre 2026").  
  * Statut (Boutons toggles : "Tous", "En retard", "À payer").  
  * Barre de recherche (Nom du locataire ou Réf. Propriété).  
* **KPIs (Cartes au-dessus du tableau) :**  
  * Total attendu ce mois (ex: 2 500 000 FCFA).  
  * Total encaissé ce mois (ex: 1 800 000 FCFA).  
  * Taux de recouvrement (ex: 72% avec une barre de progression).  
* **Tableau de données (Data Table) :**  
  * Colonnes : Locataire (Lien vers profil), Propriété, Période, Montant Attendu, Reste à Payer, Date limite, Statut, Actions.  
  * Action principale (bouton de fin de ligne) : "Encaisser" (ouvre la modale de paiement).

### **Écran B : Détail d'un Bail \- Onglet "Échéancier"**

**URL suggérée :** /dashboard/leases/\[id\]?tab=schedules **Objectif :** Gérer la vie financière d'un contrat spécifique.

* **Entête de l'onglet :** Bouton secondaire "Régénérer l'échéancier" (si le bail vient d'être modifié).  
* **Liste sous forme de Timeline ou de Tableau :**  
  * Chaque ligne représente un mois/période.  
  * Si l'échéance est PARTIAL ou PAID, un bouton déroulant (Accordéon) permet de voir le(s) sous-paiement(s) associé(s) (Date, Mode, Réf).  
  * Boutons d'action par échéance :  
    * 💳 "Encaisser" (Primaire).  
    * 📄 "Télécharger Quittance" (Secondaire, actif uniquement si amountPaid \> 0).

## **4\. Interactions et Modales**

### **4.1. Modale "Enregistrer un paiement" (Record Payment)**

C'est l'action la plus critique du module. Elle doit être rapide et fluide.

* **Déclencheur :** Clic sur "Encaisser" depuis n'importe quel tableau d'échéances.  
* **Layout :** Fenêtre modale centrée (Dialog) ou panneau coulissant latéral (Slide-over).  
* **Champs de formulaire :**  
  * **Montant :** (Input numérique). *Règle UX :* Le champ est pré-rempli avec le **reste à payer** (Montant total \- Montant déjà payé).  
  * **Date de paiement :** (Date Picker). *Règle UX :* Pré-rempli avec la date du jour (today).  
  * **Mode de paiement :** (Select/Radio buttons). Cash, MoMo, Virement, Chèque.  
  * **Référence (Optionnel) :** (Input texte). Pour le numéro de transaction Orange Money / MTN ou N° de chèque.  
  * **Notes (Optionnel) :** (Textarea).  
* **Validation (Footer) :** Bouton "Valider l'encaissement". État de chargement (spinner) pendant l'appel serveur.

### **4.2. Action "Télécharger Quittance"**

* Lorsque l'utilisateur clique sur ce bouton, génération côté serveur d'un PDF.  
* L'interface affiche un indicateur de chargement, puis ouvre le PDF dans un nouvel onglet ou déclenche le téléchargement.  
* *Note :* Si l'échéance est PARTIAL, le reçu généré doit explicitement porter la mention "Reçu de paiement partiel" et non "Quittance de loyer".

## **5\. Formulaire de Création/Édition du Bail (Configuration)**

Dans l'assistant de création d'un bail (Lease), une étape "Facturation & Échéances" doit inclure :

* **Périodicité :** Menu déroulant (Mensuel, Trimestriel, Semestriel, Annuel). *Défaut: Mensuel.*  
* **Jour de paiement :** Input numérique (1 à 31\) ou Select.  
  * *Micro-copie (Texte d'aide) :* "Le locataire devra payer son loyer au plus tard ce jour-là du mois."  
* **Alerte UX :** Si l'utilisateur modifie ces paramètres sur un bail "Actif", prévenir via une alerte : *"Attention, cela va recalculer toutes les échéances futures non verrouillées."*

## **6\. États Vides (Empty States)**

* **Si aucun échéancier n'est généré pour un bail :** \* Illustration simple (ex: calendrier vide).  
  * Message : *"Aucun échéancier n'a été généré pour ce contrat."*  
  * Call-to-action : *"Générer les échéances"*.  
* **Si le tableau de bord global est vide (aucun loyer en attente) :**  
  * Message : *"Tous les loyers sont à jour pour cette période \! 🎉"*

## **7\. Responsive Design (Mobile)**

L'agent immobilier peut être sur le terrain :

* Les tableaux de données complexes doivent se transformer en liste de "Cartes" sur mobile.  
* La modale de paiement doit s'afficher en plein écran (Bottom Sheet) sur smartphone pour faciliter la saisie au doigt.