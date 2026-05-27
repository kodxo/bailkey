# **Cahier des Charges : Module Échéances et Encaissements (Bailkey)**

## **1\. Objectif du Module**

Le module "Échéances et Encaissements" a pour but de gérer le cycle financier d'un contrat de bail (location). Il automatise la création des loyers attendus (échéances) et permet le suivi précis des encaissements réels (paiements), tout en gérant les cas de paiements partiels et les retards.

## **2\. Périmètre (Scope)**

**Inclus dans le MVP (Minimum Viable Product) :**

* Configuration des paramètres de facturation au niveau du bail.  
* Génération automatique d'un échéancier (liste des loyers attendus).  
* Gestion du prorata pour le premier mois de location.  
* Enregistrement de paiements simples ou multiples pour une même échéance.  
* Suivi des statuts (À jour, En retard, Partiel).

**Exclus (Hors périmètre pour le moment) :**

* Gestion des charges dynamiques (eau, électricité, ordures).  
* Calcul et déduction des taxes (TSIL, TVA).  
* Génération de factures comptables (uniquement des quittances simples).  
* Création de moratoires (étalement de dettes sur plusieurs mois).

## **3\. Entités Principales et Concepts**

### **3.1. Le Bail (Lease)**

Le contrat de bail agit comme le "générateur" de l'échéancier. Il doit définir les règles suivantes :

* **Montant du loyer :** Le loyer de base fixe attendu pour une période pleine.  
* **Périodicité (paymentFrequency) :** Mensuelle (par défaut), Trimestrielle, Semestrielle ou Annuelle.  
* **Jour de paiement (paymentDay) :** Le jour cible limite pour payer le loyer (ex: le 5 de chaque mois).

### **3.2. L'Échéance (RentSchedule)**

L'échéance représente la **dette** du locataire pour une période précise.

* **Période de consommation :** Date de début (periodStart) et de fin (periodEnd). Ex: du 01/10 au 31/10.  
* **Date limite (dueDate) :** La date maximale à laquelle le paiement est attendu. Ex: 05/10.  
* **Montant attendu (amount) :** La somme exigée pour cette période.  
* **Montant encaissé (amountPaid) :** La somme cumulée des paiements reçus.

### **3.3. Le Paiement / La Quittance (Payment)**

Le paiement représente le **flux financier réel** perçu par l'agence.

* Une échéance peut avoir *plusieurs* paiements (ex: un acompte en espèces, puis le solde par Mobile Money).  
* Un paiement contient un montant, une date de transaction, un mode de paiement (Cash, virement, MoMo) et une éventuelle référence de transaction.

## **4\. Règles Métier (Business Rules)**

### **Règle 1 : La Génération de l'Échéancier**

Lorsqu'un bail passe au statut "Actif", le système doit générer les échéances (jusqu'à la fin de l'année civile en cours, ou jusqu'à la fin du contrat s'il a une durée déterminée).

* L'échéance couvre généralement du 1er au dernier jour du mois (28, 29, 30 ou 31).  
* La date limite (dueDate) est calculée en fonction du paymentDay défini dans le bail.

### **Règle 2 : Le Prorata Temporis (Premier mois)**

Si un locataire entre dans les lieux en cours de mois (ex: le 15 Mars) :

* La première échéance doit aller du 15 Mars au 31 Mars.  
* Son montant doit être calculé au prorata des jours réels occupés : (Loyer / Nombre de jours dans le mois) \* Nombre de jours occupés.  
* Les échéances suivantes reprendront un cycle normal (du 1er au 30/31) avec le loyer plein.

### **Règle 3 : Le Calcul Automatique des Statuts**

Le statut d'une échéance (ScheduleStatus) n'est jamais défini manuellement par l'utilisateur. Il est calculé dynamiquement par le système :

1. **PENDING (En attente) :** amountPaid \== 0 ET la date du jour est \<= dueDate.  
2. **PARTIAL (Paiement partiel) :** amountPaid \> 0 ET amountPaid \< amount.  
3. **PAID (Payé) :** amountPaid \>= amount.  
4. **OVERDUE (En retard) :** amountPaid \< amount ET la date du jour est \> dueDate.

### **Règle 4 : Immutabilité et Verrouillage (isLocked)**

Pour des raisons de cohérence comptable :

* Dès qu'au moins un Payment est lié à une échéance, l'échéance devient **verrouillée** (isLocked \= true).  
* Une échéance verrouillée ne peut plus voir son montant attendu (amount) ni ses dates (periodStart, periodEnd) modifiés, sauf par un Administrateur qui supprime explicitement les paiements associés.

## **5\. Parcours Utilisateur Cible (User Flow)**

1. **L'Agent immobilier** crée un Lease (Bail), fixe le loyer à 100 000 FCFA, et indique un paiement mensuel exigible le 5 du mois.  
2. **Le Système** génère automatiquement les RentSchedule (Échéances) pour les mois à venir.  
3. **Le Locataire** se présente à l'agence le 3 du mois avec 60 000 FCFA en espèces.  
4. **L'Agent** sélectionne l'échéance du mois en cours et ajoute un Payment de 60 000 FCFA.  
5. **Le Système** verrouille l'échéance, met à jour le montant payé (amountPaid \= 60 000), et passe le statut de l'échéance à PARTIAL.  
6. **Le Locataire** envoie les 40 000 FCFA restants le lendemain par Mobile Money.  
7. **L'Agent** ajoute ce second Payment.  
8. **Le Système** constate que amountPaid (100 000\) atteint le loyer attendu. Le statut passe définitivement à PAID. Une quittance globale peut alors être téléchargée.