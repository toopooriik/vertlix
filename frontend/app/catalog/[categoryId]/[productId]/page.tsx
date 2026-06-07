import ProductDetails from '@/components/sections/catalog/ProductDetails';

type ProductDetailsPageProps = {
    params: Promise<{
        categoryId: string;
        productId: string;
    }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { categoryId, productId } = await params;

    return (
        <main>
            <ProductDetails
                categoryId={Number(categoryId)}
                productId={Number(productId)}
            />
        </main>
    );
}