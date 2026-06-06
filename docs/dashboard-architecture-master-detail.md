# Architecture et Standards des Tableaux de Bord (Modèle Master-Detail)

Ce document décrit les standards techniques et les bonnes pratiques à respecter lors de la création de pages de type "Tableau de bord" avec un affichage liste (gauche) / détails (droite) dans l'application Bailkey.

Il garantit la cohérence UI/UX, les performances (pagination côté serveur) et la stabilité (gestion correcte des hooks Next.js 15+).

## 1. Architecture Générale

Chaque module de type Dashboard doit être divisé en trois couches principales :

1. **La Couche d'Accès aux Données (DAL)** : Effectue les requêtes Prisma, la pagination, les agrégations globales et la sérialisation.
2. **Le Composant Serveur (Page / Container)** : Récupère les `searchParams` de l'URL de manière asynchrone, appelle la DAL et gère la `<Suspense>`.
3. **Le Composant Client (Dashboard)** : Gère l'interactivité (changement de page, de filtre, clic sur une ligne) uniquement via la modification de l'URL (`useRouter`, `useSearchParams`), sans dupliquer l'état dans un contexte React.

---

## 2. La Couche DAL (Data Access Layer)

### 2.1. Requête principale (Liste paginée)

La requête retournant la liste des éléments doit accepter les paramètres `page`, `pageSize`, `search`, et `status`.
Elle doit utiliser `prisma.$transaction` pour récupérer :

- Les éléments paginés via `skip` et `take`.
- Le nombre total d'éléments (obligatoire pour le calcul de la pagination).
- Les agrégations nécessaires (ex: sommes totales, totaux par statut) en ignorant la pagination pour que ces chiffres reflètent toujours la réalité globale.

### 2.2. Récupération de l'élément sélectionné

**Règle d'Or :** Ne comptez **jamais** sur la liste paginée pour trouver l'élément actuellement sélectionné.
Si l'utilisateur sélectionne un élément, puis change de page, cet élément ne sera plus présent dans le tableau des 10 résultats actuels.

- Créez toujours une fonction dédiée `get[Entity]ById(id: string)` dans la DAL.

### 2.3. Sérialisation des Types Prisma Spécifiques

Next.js (Server Components) ne peut pas transférer d'objets complexes provenant de bibliothèques tierces (comme les instances `Decimal` de Prisma) vers les Client Components.

- **Action Requise :** Implémentez une fonction de sérialisation récursive (ou un DTO mapper strict) pour convertir systématiquement tous les types `Decimal` en `number` (via `.toNumber()`) avant de retourner l'objet.

---

## 3. Le Composant Serveur (`page.tsx`)

### 3.1. Gestion asynchrone des `searchParams` (Spécificité Next.js 15+)

Depuis Next.js 15, `searchParams` est officiellement une Promise. Elle doit obligatoirement être précédée d'un `await` avant toute lecture.

```tsx
export default async function MyDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    status?: string;
    selectedId?: string;
  }>;
}) {
  // Await obligatoire
  const params = await searchParams;

  const page = parseInt(params?.page || "1", 10);
  const pageSize = parseInt(params?.pageSize || "10", 10);
  const selectedId = params?.selectedId;
  // ...
}
```

### 3.2. Chargement Parallèle (`Promise.all`)

Pour ne pas pénaliser le temps de chargement, chargez la liste paginée ET l'entité sélectionnée simultanément.

```tsx
const [listRes, selectedRes] = await Promise.all([
  getEntities({ page, pageSize }),
  selectedId ? getEntityById(selectedId) : Promise.resolve({ entity: null }),
]);
```

### 3.3. Isolation avec Suspense

Le rendu du Client Component doit toujours être enveloppé d'une balise `<Suspense>` avec une Skeleton.
Utilisez `key={JSON.stringify(params)}` pour garantir que Next.js force l'affichage du fallback pendant la résolution des données lors de modifications de l'URL.

---

## 4. Le Composant Client (UI & Interaction)

### 4.1. Source de Vérité : L'URL

Tout état d'interface (page actuelle, ligne sélectionnée, filtres actifs) doit **exclusivement** vivre dans l'URL. N'utilisez **pas** de `useState` pour cela.

```tsx
const router = useRouter();
const pathname = usePathname();
const searchParams = useSearchParams();

// Exemple de fonction d'action
const handleAction = (key: string, value: string) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set(key, value);
  router.replace(`${pathname}?${params.toString()}`, { scroll: false });
};
```

### 4.2. Composant de Pagination Standard

Utilisez toujours le composant unifié `<TablePagination>`. Il doit recevoir toutes ses props depuis le Client Component :

```tsx
<TablePagination
  total={totalCount}
  currentPage={currentPage}
  totalPages={totalPages}
  pageSize={pageSize}
  onPageChange={(page) => handleAction("page", page.toString())}
  onPageSizeChange={(size) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("pageSize", size.toString());
    p.set("page", "1"); // Toujours réinitialiser à la page 1
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }}
/>
```

### 4.3. UI/UX : Indicateurs et Adhérence ("Sticky")

Un dashboard professionnel doit offrir un confort visuel maximal :

- **Tableau (En-têtes)** : Les en-têtes de colonnes doivent rester visibles lors du défilement vertical du tableau.
  - S'assurer que le container le permet (`overflow-auto`) et appliquer `sticky top-0`.
- **Indicateur de Sélection** : La ligne actuellement active (`TableRow`) doit se démarquer visuellement (par exemple, via un fond teinté `bg-primary/5`).
- **Panneau Latéral (Détails)** : Le panneau de droite doit être "sticky" pour ne pas disparaître quand on scrolle tout en bas du grand tableau central.
  - Utilisez `className="sticky top-4 h-[calc(100vh-120px)]"`.

### 4.4. L'État Vide (Empty State) du panneau de détails

Ne laissez jamais le panneau latéral avec un simple fond gris basique. Le design doit être premium.

- Intégrez un fond subtil (ex: `bg-gradient-to-br from-primary/5 to-transparent`).
- Utilisez une icône de grande taille encerclée (`ring-4 ring-primary/5`).
- Rédigez un texte clair invitant à l'action.

---

## 5. Gestion des Formulaires (React 19 / Next.js 15)

### 5.1. Abandon des `useState` superflus
L'utilisation de multiples `useState` pour contrôler manuellement chaque champ (ex: `const [amount, setAmount] = useState("")`) est **interdite** pour les formulaires standards soumis au serveur.
- Laissez les inputs non contrôlés (ou utilisez `defaultValue` pour les pré-remplir).
- Utilisez des balises `<form action={formAction}>` natives.

### 5.2. Utilisation de `useActionState`
Chaque formulaire (Création, Mise à jour, Paiement, etc.) doit être géré par le hook `useActionState`.
```tsx
import { useActionState } from "react";
import { createEntityAction } from "@/lib/actions/entity.actions";

// Dans le composant
const [state, formAction, isPending] = useActionState(createEntityAction, null);

<form action={formAction}>
  <input name="amount" defaultValue={entity?.amount} />
  {state?.errors?.amount && <p className="text-error">{state.errors.amount[0]}</p>}
  <button type="submit" disabled={isPending}>Enregistrer</button>
</form>
```

### 5.3. Routage Dynamique d'Action (Création vs Edition)
Si un même composant gère la création ET l'édition, utilisez un wrapper dans le hook pour diriger vers la bonne Server Action :
```tsx
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    if (selectedEntity) return updateEntityAction(selectedEntity.id, prevState, formData);
    return createEntityAction(prevState, formData);
  },
  null
);
```

### 5.4. Validation Serveur avec Zod
Toutes les Server Actions liées à des formulaires **doivent** utiliser Zod pour extraire et valider les données issues du `FormData`.
```ts
// Signature requise
export async function createEntityAction(prevState: any, formData: FormData) {
  const validatedFields = Schema.safeParse({
    amount: formData.get("amount"),
    // ...
  });

  if (!validatedFields.success) {
    return { success: false, error: "Certains champs sont invalides.", errors: validatedFields.error.flatten().fieldErrors };
  }
  
  // Logique Prisma...
  return { success: true };
}
```

### 5.5. Gestion Globale des Erreurs et Retours UI
L'application utilise le composant `sonner` via notre wrapper personnalisé `<Toaster />` (situé dans `components/ui/sonner.tsx`) pour afficher les succès et erreurs. Ce composant est déjà monté globalement dans `app/layout.tsx`.

- Tout composant utilisant `useActionState` doit impérativement avoir un `useEffect` pour surveiller l'état et afficher des toasts :
```tsx
import { toast } from "sonner";

// ...
const [state, formAction, isPending] = useActionState(createEntityAction, null);

useEffect(() => {
  if (state?.success) {
    toast.success("Action réalisée avec succès.");
    // Réinitialisation d'état, fermeture modale, router.refresh()...
  } else if (state?.error) {
    toast.error(state.error);
  }
}, [state]);
```

---

## 6. Navigation Relationnelle et Filtres Avancés

### 6.1. Liens Inter-Entités (Relational Links)
Pour faciliter la navigation transversale, tout champ de formulaire ou affichage textuel référençant une autre entité doit intégrer un lien relationnel.

- **Composants d'UI :** Utilisez `RelationalLink` (bouton icône) et `RelationalFieldWrapper` (encapsuleur pour les Selects) depuis `@/components/ui/relational-link`.
- **Mécanisme :** Ces composants mettent à jour l'URL (ex: `?selectedId=...` ou en ajoutant un paramètre relationnel spécifique comme `ownerId=...`) pour basculer la vue latérale ou filtrer le tableau principal, sans rechargement lourd.
- **Paramètres croisés :** Lors de l'implémentation de relations (ex: "Voir les propriétés d'un propriétaire"), ajoutez un paramètre de filtre dédié (ex: `ownerId`) lu par le composant serveur de la page ciblée (ici `properties-table-server.tsx`).

### 6.2. Filtres Avancés (AdvancedFilterDialog)
Afin d'éviter de surcharger la barre de recherche (`SearchPanel`), regroupez les filtres secondaires (ex: type, propriétaire, plage de dates) dans le composant `AdvancedFilterDialog`.

- **Utilisation :** Placez le composant dans le `SearchPanel`.
- **État URL :** Comme tout composant client, la modale modifie directement les paramètres de recherche de l'URL (`searchParams.set()`) lors de l'application des filtres.
- **Interface Globale :** L'indicateur dynamique (pastille numérique) renseigne l'utilisateur sur le nombre de filtres actifs cachés.
