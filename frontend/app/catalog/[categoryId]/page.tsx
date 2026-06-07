import CategoryProducts from '@/components/sections/catalog/CategoryProducts';

type CatalogCategoryPageProps = {
    params: Promise<{
        categoryId: string;
    }>;
};

export default async function CatalogCategoryPage({ params }: CatalogCategoryPageProps) {
    const { categoryId } = await params;

    return (
        <main>
            <CategoryProducts activeCategoryId={Number(categoryId)} />
        </main>
    );
}