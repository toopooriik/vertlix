import CategoryProducts from '@/components/sections/catalog/CategoryProducts';

type CatalogCategoryPageProps = {
    params: Promise<{
        categoryId: string;
    }>;
    searchParams: Promise<{
        q?: string | string[];
        site?: string | string[];
        source?: string | string[];
        minPrice?: string | string[];
        maxPrice?: string | string[];
    }>;
};

function getSearchValue(value?: string | string[]) {
    return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function CatalogCategoryPage({
    params,
    searchParams,
}: CatalogCategoryPageProps) {
    const { categoryId } = await params;
    const filters = await searchParams;

    return (
        <main>
            <CategoryProducts
                activeCategoryId={Number(categoryId)}
                initialFilters={{
                    query: getSearchValue(filters.q),
                    site: getSearchValue(filters.site),
                    source: getSearchValue(filters.source),
                    minPrice: getSearchValue(filters.minPrice),
                    maxPrice: getSearchValue(filters.maxPrice),
                }}
            />
        </main>
    );
}
