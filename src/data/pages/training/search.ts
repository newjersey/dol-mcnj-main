import { AlertProps } from "@components/modules/Alert";

export const SEARCH_RESULTS_PAGE_DATA = {
  breadcrumbs: {
    style: { marginBottom: "1rem" },
    pageTitle: "Search",
    crumbs: [
      {
        copy: "Home",
        url: "/",
      },
      {
        copy: "Training Explorer",
        url: "/training",
      },
    ],
  },
  sortOptions: [
    {
      key: "Best Match",
      value: "",
    },
    {
      key: "Cost: Low to High",
      value: "low",
    },
    {
      key: "Cost: High to Low",
      value: "high",
    },
    {
      key: "Employment Rate",
      value: "rate",
    },
  ],
  perPageOptions: [
    {
      key: "10",
      value: "",
    },
    {
      key: "20",
      value: "20",
    },
    {
      key: "50",
      value: "50",
    },
    {
      key: "100",
      value: "100",
    },
  ],
  en: {
    searchHelp: {
      collapsable: true,
      type: "info",
      copy: `*   Check your spelling to ensure it is correct.\n*   Verify and adjust any filters that you might have applied to your search.\n*   Are your search results too small? Your search may be too specific. Try searching with fewer words.\n\n### Here are some examples that may improve your search results:\n\n*   **Training Providers**: If you're searching for a training provider, try using only the provider's name and exclude words like "university" or "college".\n*   **Occupations**: If you're looking for training for a job, you can type the job directly into the search box.\n*   **License**: If you know the name of the license you're training for, use the acronym to see more results. For example, for the commercial driving license, try searching for "CDL".`,
      heading: "Not seeing the results you were looking for?",
    } as AlertProps,
  },
  es: {
    searchHelp: {
      collapsable: true,
      type: "info",
      copy: `*   Verifica la ortografía para asegurarte de que sea correcta.\n*   Revisa y ajusta cualquier filtro que hayas aplicado a tu búsqueda.\n*   ¿Tus resultados de búsqueda son muy pocos? Puede que tu búsqueda sea demasiado específica. Intenta buscar con menos palabras.\n\n### Aquí tienes algunos ejemplos que pueden mejorar tus resultados de búsqueda:\n\n*   **Proveedores de Capacitación**: Si estás buscando un proveedor de capacitación, intenta usar solo el nombre del proveedor y excluye palabras como "universidad" o "colegio".\n*   **Ocupaciones**: Si buscas capacitación para un empleo, puedes escribir directamente el nombre del trabajo en la barra de búsqueda.\n*   **Licencias**: Si conoces el nombre de la licencia para la que estás entrenando, usa la sigla para ver más resultados. Por ejemplo, para la licencia de conducir comercial, intenta buscar "CDL".`,
      heading: "¿No ves los resultados que esperabas?",
    } as AlertProps,
  },
};
