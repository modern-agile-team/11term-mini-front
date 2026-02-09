import type { Category } from '../types/Category';

export const findCategoryPath = (categories: Category[], targetId: string): Category[] => {
  const dfs = (nodes: Category[], path: Category[]): Category[] | null => {
    for (const node of nodes) {
      const next = [...path, node];
      if (node.id === targetId) return next;

      const children = node.subCategories ?? [];
      if (children.length > 0) {
        const found = dfs(children as Category[], next);
        if (found) return found;
      }
    }
    return null;
  };

  return dfs(categories, []) ?? [];
};
