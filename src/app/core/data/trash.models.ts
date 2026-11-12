export type TrashEntityType = 'product' | 'category' | 'subcategory' | 'addon' | 'banner' | 'review';

export interface TrashEntry {
  key: string;
  type: TrashEntityType;
  entityId: string;
  name: string;
  image: string;
  deletedAt: string;
}
