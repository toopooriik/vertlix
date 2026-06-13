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

type ProductFilterOptionsParams = {
    categoryId?: number | string;
    site?: string;
};

type TrackViewOptions = {
    signal?: AbortSignal;
};

export type ContactRequestPayload = {
    fullName: string;
    email: string;
    comment: string;
    website?: string;
};

export type ContactRequestErrors = Partial<Record<'fullName' | 'email' | 'comment', string>>;

type ContactRequestResponse = {
    message: string;
    errors?: ContactRequestErrors;
};

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await apiFetch(path, options);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

export function getCategories() {
    return requestJson<CategoryType[]>('/categories');
}

export function getPopularCategories(limit = 5) {
    return requestJson<CategoryType[]>(`/categories/popular?limit=${limit}`);
}

export function getCategoryProducts(categoryId: number) {
    return requestJson<CategoryProductsResponse>(`/categories/${categoryId}/products`);
}

export function getProduct(productId: number) {
    return requestJson<ProductType>(`/products/${productId}`);
}

export function getPopularProducts(limit = 15) {
    return requestJson<ProductType[]>(`/products/popular?limit=${limit}`);
}

export function searchProducts(query: string) {
    return requestJson<ProductType[]>(`/products/search?q=${encodeURIComponent(query)}`);
}

export function trackCategoryView(categoryId: number, options: TrackViewOptions = {}) {
    return requestJson<{ status: string }>(`/categories/${categoryId}/view`, {
        method: 'POST',
        signal: options.signal,
    });
}

export function trackProductView(productId: number, options: TrackViewOptions = {}) {
    return requestJson<{ status: string }>(`/products/${productId}/view`, {
        method: 'POST',
        signal: options.signal,
    });
}

export async function sendContactRequest(payload: ContactRequestPayload) {
    const response = await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    const data = await response.json() as ContactRequestResponse;

    if (!response.ok) {
        const error = new Error(data.message || 'Не удалось отправить заявку.') as Error & {
            errors?: ContactRequestErrors;
        };
        error.errors = data.errors;

        throw error;
    }

    return data;
}

export function getProductFilterOptions(params: ProductFilterOptionsParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.categoryId) {
        searchParams.set('categoryId', String(params.categoryId));
    }

    if (params.site) {
        searchParams.set('site', params.site);
    }

    const query = searchParams.toString();

    return requestJson<ProductFilterOptionsResponse>(
        `/products/filter-options${query ? `?${query}` : ''}`
    );
}
