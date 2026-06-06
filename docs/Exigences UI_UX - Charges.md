# **Spécifications UI/UX : Module Gestion des Charges (Bailkey)**

## **1\. Principes de Design**

* **Transparence totale :** Le locataire et l'agent doivent toujours pouvoir distinguer le "Loyer pur" du "Total des charges".  
* **Saisie rapide (Data Entry) :** La mise à jour des charges variables (ex: relevé d'eau mensuel) doit se faire le plus rapidement possible, idéalement sans avoir à ouvrir de multiples fenêtres.  
* **Code Couleur Comptable :** Utiliser des indicateurs visuels subtils pour différencier les encaissements (Crédit \- reversé au proprio) des dépenses (Débit \- retenu).

## **2\. Écran 1 : Catalogue des Charges (Paramètres Globaux)**

**URL suggérée :** /dashboard/gestion/charges **Objectif :** Permettre à l'administrateur de l'agence de définir son catalogue de charges (ChargeType).

* **Layout :** Data Table simple avec bouton "Nouvelle Charge".  
* **Formulaire de création/édition (Modale ou Slide-over) :**  
  * **Nom :** Input text (ex: "Gardiennage").  
  * **Type comptable (AccountingMode) :** Radio group ou Select.  
    * *Micro-copie :* "Crédit (Encaissement)" / "Débit (Dépense/Travaux)".  
  * **Options (Switches/Toggles) :**  
    * isDefault : "Ajouter automatiquement aux nouveaux baux".  
    * isUtility : "Ceci est une facture d'eau ou d'électricité".  
* **Indicateurs visuels dans le tableau :**  
  * Afficher un badge Par défaut pour les charges concernées.

## **3\. Écran 2 : Le Formulaire du Bail (Lease Form)**

**Étape de l'assistant :** "Loyer & Charges"

**Objectif :** Définir les charges récurrentes (LeaseCharge) lors de la création ou modification du contrat.

* **UI du composant "Charges" :**  
  * À l'ouverture, la liste est pré-remplie avec les charges ayant isDefault \= true.  
  * Chaque ligne affiche : Nom de la charge, Input pour le amount (Montant par défaut), et un bouton 🗑️ (Supprimer/Désactiver).  
  * Un bouton "+ Ajouter une charge" ouvre un menu déroulant listant les ChargeType restants.  
* **Résumé financier (Sticky Footer ou Sidebar) :**  
  * Loyer de base : 150 000 FCFA  
  * Total Charges : 15 000 FCFA  
  * **Loyer Mensuel Total : 165 000 FCFA** (Mise à jour en temps réel).

## **4\. Écran 3 : Détail de l'Échéance (Saisie des variables)**

**Déclencheur :** Clic sur une ligne d'échéance depuis /dashboard/rent-schedules ou depuis le détail du bail.

**Objectif :** Mettre à jour les charges variables (ex: facture ENEO/SEEG du mois) *avant* d'encaisser.

* **Mode "Vue" (Read-only) :**  
  * Si isLocked \= true (échéance déjà payée partiellement ou totalement), la ventilation (Loyer \+ Liste des charges) s'affiche sous forme de simple liste non modifiable.  
* **Mode "Édition" (Inline Edit) :**  
  * Si isLocked \= false, l'agent voit un encart "Ventilation des Montants".  
  * Loyer de base : *Non modifiable ici* (grisé).  
  * Liste des ScheduleCharge : Le montant de chaque charge est un **Input Number**.  
  * L'agent peut directement cliquer sur le montant de "Facture d'eau", taper "12500" et cliquer sur "Enregistrer" ou valider avec la touche Entrée.  
  * Un bouton "+ Ajouter une charge exceptionnelle" permet d'ajouter une charge uniquement pour CE mois précis.

## **5\. Impact sur les Interactions Existantes**

### **5.1. La Modale de Paiement ("Encaisser")**

Il est crucial que l'agent sache ce qu'il encaisse. La modale (définie dans les exigences précédentes) doit être enrichie d'un résumé :

* **En-tête de la modale :**  
  * "Encaissement pour la période de Mars 2026"  
  * Montant attendu : **165 000 FCFA**  
  * *Bouton "Voir le détail"* (Tooltip ou Accordéon très discret : Loyer 150k, Eau 10k, Ordures 5k).  
* *Règle UX :* On ne demande **pas** à l'agent de ventiler le paiement (ex: "il a payé 10k pour l'eau et 50k pour le loyer"). Le locataire paie un solde global (totalAmount). C'est le système qui calcule le reste à payer.

### **5.2. La Quittance de Loyer (PDF)**

Le reçu généré doit obligatoirement séparer le principal de l'accessoire (obligation légale dans de nombreux pays) :

* **Ligne 1 :** Loyer de base (Période du X au Y) ..... 150 000 FCFA  
* **Ligne 2 :** Provision pour charges .................... 5 000 FCFA  
* **Ligne 3 :** Consommation Eau ......................... 10 000 FCFA  
* **Total Quittancé :** .................................. **165 000 FCFA**