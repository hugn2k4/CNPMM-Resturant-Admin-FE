import { apiClient } from './api-client';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoriesService = {
  getAllCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
  },
};
