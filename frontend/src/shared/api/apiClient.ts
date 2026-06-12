const PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
const INTERNAL_API_BASE_URL = process.env.INTERNAL_API_BASE_URL || 'http://Veltrix_nginx/api';

function getApiBaseUrl() {
    if (typeof window !== 'undefined') {
        return PUBLIC_API_BASE_URL;
    }

    return PUBLIC_API_BASE_URL.startsWith('http')
        ? PUBLIC_API_BASE_URL
        : INTERNAL_API_BASE_URL;
}

export async function apiFetch(path: string, options?: RequestInit) {
    return fetch(`${getApiBaseUrl()}${path}`, {
        cache: 'no-store',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
        },
    });
}