# **Cahier des Charges : Module Gestion des Charges (Bailkey)**

## **1\. Objectif du Module**

Permettre d'ajouter des charges additionnelles (fixes ou variables) au loyer de base d'un locataire, de les automatiser lors de la génération des échéances, et de préparer le terrain pour le Compte Rendu de Gestion (CRG) destiné aux propriétaires.

## **2\. Concepts Clés**

### **2.1. Le Type de Charge (ChargeType)**

C'est le catalogue de l'agence. Chaque charge créée ici a un comportement comptable strict :

* **Mode Crédit (Encaissement) :** Une charge payée par le locataire qui doit être reversée au propriétaire (ex: Provision sur charges communes).  
* **Mode Débit (Dépense/Travaux) :** Une charge qui sera déduite de ce que l'agence doit verser au propriétaire (ex: Frais de réparation payés par l'agence, à retenir sur le loyer).  
* **Par défaut (isDefault) :** Si vrai, cette charge s'ajoute automatiquement à la création d'un nouveau bail (ex: Entretien des parties communes).  
* **Utilitaire (isUtility) :** Identifie les charges d'eau/électricité (ex: SEEG au Gabon, ENEO au Cameroun) pour des rapports spécifiques.

### **2.2. La Charge au niveau du Bail (LeaseCharge)**

C'est le **modèle/référentiel**.

Lors de la création du bail, on associe des types de charges et on y définit un montant par défaut.

*Exemple : Le bail de M. Dupont a une charge "Gardiennage" de 15 000 FCFA/mois.*

### **2.3. La Charge au niveau de l'Échéance (ScheduleCharge)**

C'est la **facturation réelle**.

Chaque mois, lors de la génération de l'échéance, le système copie les LeaseCharge actives pour créer des ScheduleCharge.

*Pourquoi séparer ?* Parce que si le gardiennage passe à 20 000 FCFA en cours d'année, on modifie la charge sur le bail, mais cela ne doit **pas** altérer les échéances passées qui ont déjà été verrouillées et payées.

## **3\. Règles Métier (Business Rules)**

### **Règle 1 : Calcul du Montant de l'Échéance**

L'échéance (RentSchedule) ne contient plus un simple amount. Elle contient désormais :

* rentAmount : Le loyer de base.  
* chargesAmount : La somme de toutes les ScheduleCharge liées à cette échéance.  
* totalAmount : rentAmount \+ chargesAmount. C'est cette valeur qui doit être recouverte par les paiements.

### **Règle 2 : Le Prorata Temporis sur les charges**

Si le bail inclut une règle de prorata (premier mois incomplet) :

* Le rentAmount est calculé au prorata des jours.  
* Les ScheduleCharge sont également calculées au prorata (selon la logique Odoo d'origine), SAUF si la charge est marquée comme "Forfaitaire unique" (hors périmètre pour le moment, on applique le prorata à tout).

### **Règle 3 : Édition Manuelle des Charges**

Un agent immobilier doit pouvoir modifier le montant d'une ScheduleCharge sur l'échéance du mois en cours (ex: facture d'eau variable reçue ce mois-là), **tant que l'échéance n'est pas verrouillée** (aucun paiement lié).

## **4\. Impact sur le Compte Rendu de Gestion (CRG) \- *Pour plus tard***

Ce module prépare l'avenir. Quand on générera le CRG pour le propriétaire, le système fera ce calcul :

Loyer encaissé

\+ Somme des charges encaissées (Mode CREDIT)

\- Somme des charges (Mode DEBIT)

\- Commission de l'agence

\= Montant net à reverser au propriétaire.