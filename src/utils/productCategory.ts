import { CATEGORIES } from '../data/categories';
import type { Category } from '../types/Category';

const flattenCategories = (categories: Category[]): Category[] =>
  categories.flatMap((category) => [
    category,
    ...flattenCategories(category.subCategories ?? []),
  ]);

const CATEGORY_INDEX = flattenCategories(CATEGORIES);

const CATEGORY_NAME_TO_ID = new Map(CATEGORY_INDEX.map((category) => [category.name, category.id]));
const CATEGORY_ID_TO_NAME = new Map(CATEGORY_INDEX.map((category) => [category.id, category.name]));

const LEGACY_CATEGORY_ID_BY_NAME: Record<string, string> = {
  여성의류: '1',
  남성의류: '2',
  신발: '3',
  패션잡화: '7',
  디지털기기: '8',
  디지털: '8',
  가전제품: '9',
  '스포츠/레저': '10',
  '취미/키덜트': '13',
  악기: '15-2',
  '도서/티켓/문구': '16',
  '뷰티/미용': '17',
  '가구/인테리어': '18',
  '생활/주방': '19',
  '생활/주방용품': '19',
};

const includesOneOf = (source: string, keywords: string[]) =>
  keywords.some((keyword) => source.includes(keyword));

const inferCategoryIdFromTitle = (title: string, fallbackId: string): string => {
  const normalizedTitle = title.toLowerCase();

  if (fallbackId === '8') {
    if (includesOneOf(normalizedTitle, ['아이폰', '갤럭시', '스마트폰'])) return '8-1-1';
    if (includesOneOf(normalizedTitle, ['아이패드', '갤럭시탭', '태블릿'])) return '8-2-1';
    if (includesOneOf(normalizedTitle, ['애플워치', '갤럭시워치', '워치', '밴드'])) return '8-3-1';
    if (includesOneOf(normalizedTitle, ['에어팟', '이어폰'])) return '8-4-1';
    if (includesOneOf(normalizedTitle, ['헤드셋', '헤드폰'])) return '8-4-2';
    if (includesOneOf(normalizedTitle, ['스피커'])) return '8-4-3';
    if (includesOneOf(normalizedTitle, ['맥북', '노트북'])) return '8-5-2';
    if (includesOneOf(normalizedTitle, ['마우스'])) return '8-5-5';
    if (includesOneOf(normalizedTitle, ['닌텐도'])) return '8-6-1';
    if (includesOneOf(normalizedTitle, ['플레이스테이션', 'ps5'])) return '8-6-2';
    if (includesOneOf(normalizedTitle, ['코닥', '필름'])) return '8-7-1';
    if (includesOneOf(normalizedTitle, ['캐논', '후지필름', '카메라'])) return '8-7-2';
  }

  if (fallbackId === '9') {
    if (includesOneOf(normalizedTitle, ['토스터'])) return '9-2-10';
    if (includesOneOf(normalizedTitle, ['커피', '네스프레소'])) return '9-2-3';
    if (includesOneOf(normalizedTitle, ['에어랩', '드라이', '고데기'])) return '9-3-3';
  }

  if (fallbackId === '10') {
    if (includesOneOf(normalizedTitle, ['골프', '드라이버'])) return '10-1-1';
    if (includesOneOf(normalizedTitle, ['캠핑', '헬리녹스', '체어'])) return '10-2-1';
    if (includesOneOf(normalizedTitle, ['자전거', '브롬톤'])) return '10-7-4';
    if (includesOneOf(normalizedTitle, ['백팩'])) return '10-8-3';
    if (includesOneOf(normalizedTitle, ['요가매트', '요가'])) return '10-9-1';
  }

  if (fallbackId === '13') {
    if (includesOneOf(normalizedTitle, ['레고'])) return '13-2';
    if (includesOneOf(normalizedTitle, ['보드게임'])) return '13-5';
  }

  if (fallbackId === '15-2') {
    if (includesOneOf(normalizedTitle, ['기타', '스트라토캐스터', '펜더'])) return '15-2-2';
    if (includesOneOf(normalizedTitle, ['피아노', '키보드'])) return '15-2-4';
  }

  if (fallbackId === '16') {
    if (includesOneOf(normalizedTitle, ['스타벅스', '커피'])) return '16-3-3';
    if (includesOneOf(normalizedTitle, ['만원권', '상품권'])) return '16-4-4';
  }

  if (fallbackId === '17') {
    if (includesOneOf(normalizedTitle, ['향수'])) return '17-5-3';
    if (includesOneOf(normalizedTitle, ['핸드밤', '핸드'])) return '17-4-7';
  }

  if (fallbackId === '19') {
    if (includesOneOf(normalizedTitle, ['텀블러'])) return '19-1-3';
  }

  if (fallbackId === '1' || fallbackId === '2') {
    if (includesOneOf(normalizedTitle, ['패딩'])) return `${fallbackId}-1-1`;
    if (includesOneOf(normalizedTitle, ['점퍼'])) return `${fallbackId}-1-2`;
    if (includesOneOf(normalizedTitle, ['코트'])) return `${fallbackId}-1-3`;
    if (includesOneOf(normalizedTitle, ['자켓'])) return `${fallbackId}-1-4`;
    if (includesOneOf(normalizedTitle, ['가디건'])) return `${fallbackId}-1-5`;
    if (includesOneOf(normalizedTitle, ['후드'])) return `${fallbackId}-2-1`;
    if (includesOneOf(normalizedTitle, ['맨투맨'])) return `${fallbackId}-2-2`;
    if (includesOneOf(normalizedTitle, ['니트'])) return `${fallbackId}-2-3`;
    if (includesOneOf(normalizedTitle, ['셔츠'])) return `${fallbackId}-2-4`;
    if (includesOneOf(normalizedTitle, ['티셔츠', '티셔츠'])) return `${fallbackId}-2-5`;
  }

  if (fallbackId === '3') {
    if (includesOneOf(normalizedTitle, ['덩크', '삼바', 'xt-6'])) return '3-1';
  }

  if (fallbackId === '7') {
    if (includesOneOf(normalizedTitle, ['비니'])) return '7-1-4';
    if (includesOneOf(normalizedTitle, ['에코백', '백', '가방'])) return '4-1-6';
    if (includesOneOf(normalizedTitle, ['지갑'])) return '4-6';
  }

  if (fallbackId === '18') {
    if (includesOneOf(normalizedTitle, ['조명', 'lamp'])) return '18-7';
  }

  return fallbackId;
};

export const resolveCategoryName = (categoryId?: string, fallbackName?: string) => {
  if (categoryId) {
    return CATEGORY_ID_TO_NAME.get(categoryId) ?? fallbackName ?? '';
  }

  return fallbackName ?? '';
};

export const findCategoryById = (categoryId?: string) => {
  if (!categoryId) return null;
  return CATEGORY_INDEX.find((category) => category.id === categoryId) ?? null;
};

export const findCategoryPathById = (categoryId?: string): Category[] => {
  if (!categoryId) return [];

  const path: Category[] = [];

  const dfs = (nodes: Category[]): boolean => {
    for (const node of nodes) {
      path.push(node);

      if (node.id === categoryId) {
        return true;
      }

      if (node.subCategories && dfs(node.subCategories)) {
        return true;
      }

      path.pop();
    }

    return false;
  };

  dfs(CATEGORIES);
  return path;
};

export const resolveCategoryId = (categoryName?: string, title = '') => {
  if (!categoryName) return '';

  const exactId = CATEGORY_NAME_TO_ID.get(categoryName);
  if (exactId) {
    return inferCategoryIdFromTitle(title, exactId);
  }

  const legacyId = LEGACY_CATEGORY_ID_BY_NAME[categoryName];
  if (legacyId) {
    return inferCategoryIdFromTitle(title, legacyId);
  }

  return '';
};

export const normalizeProductCategory = ({
  categoryId,
  categoryName,
  title = '',
}: {
  categoryId?: string;
  categoryName?: string;
  title?: string;
}) => {
  const normalizedCategoryId =
    categoryId && findCategoryById(categoryId)
      ? categoryId
      : resolveCategoryId(categoryName, title);

  const normalizedCategoryName = normalizedCategoryId
    ? resolveCategoryName(normalizedCategoryId, categoryName)
    : categoryName ?? '';

  return {
    categoryId: normalizedCategoryId,
    category: normalizedCategoryName,
  };
};

export const collectCategoryIds = (category: Category): string[] => [
  category.id,
  ...(category.subCategories ?? []).flatMap(collectCategoryIds),
];
