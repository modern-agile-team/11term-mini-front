import type { Category } from '../types/Category';

export const findCategoryPath = (categories: Category[], targetId: string): Category[] => {
  const path: Category[] = [];

  const dfs = (nodes: Category[]): boolean => {
    for (const node of nodes) {
      path.push(node);

      if (node.id === targetId) return true;

      const children = (node.subCategories ?? []) as Category[];
      if (children.length > 0) {
        if (dfs(children)) return true;
      }

      path.pop();
    }

    return false;
  };

  dfs(categories);
  return path;
};
