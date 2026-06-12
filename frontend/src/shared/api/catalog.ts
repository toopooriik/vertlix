import CategoryType from '@/types/categoryType';
import ProductType from '@/types/productType';
import { apiFetch } from './apiClient';

type CategoryProductsResponse = {
    category: CategoryType;
    products: ProductType[];
};

type ProductFilterOptionsResponse = {
    sites: string[];
    sources: string[];
};

async function requestJson<T>(path: string): Promise<T> {
    const response = await apiFetch(path);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export function getCategories() {
    return requestJson<CategoryType[]>('/categories');
}

export function getCategoryProducts(categoryId: number) {
    return requestJson<CategoryProductsResponse>(`/categories/${categoryId}/products`);
}

export function getProduct(productId: number) {
    return requestJson<ProductType>(`/products/${productId}`);
}

export function searchProducts(query: string) {
    return requestJson<ProductType[]>(`/products/search?q=${encodeURIComponent(query)}`);
}

export function getProductFilterOptions() {
    return requestJson<ProductFilterOptionsResponse>('/products/filter-options');
}
