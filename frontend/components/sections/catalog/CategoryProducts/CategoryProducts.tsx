import Container from '@/components/layout/Container';
import { getCategories, getCategoryProducts } from '@/src/shared/api/catalog';
import style from './CategoryProducts.module.scss';
import CategoryMenu from '@/components/sections/catalog/CategoryMenu';
import CategoryProductsList, { ProductFilterValues } from './CategoryProductsList';

type CategoryProductsProps = {
    activeCategoryId: number;
    initialFilters?: ProductFilterValues;
};

export default async function CategoryProducts({
    activeCategoryId,
    initialFilters,
}: CategoryProductsProps) {
    const categories = await getCategories();
    const fallbackCategory = categories[0];
    const categoryId = categories.some((category) => category.id === activeCategoryId)
        ? activeCategoryId
        : fallbackCategory?.id;

    if (!categoryId) {
        return null;
    }

    const { category: activeCategory, products } = await getCategoryProducts(categoryId);
    const filtersKey = JSON.stringify(initialFilters ?? {});

    return (
        <section className={style.category_products}>
            <Container>
                <div className={style.category_products__content}>
                    <CategoryMenu
                        categories={categories}
                        activeCategoryId={activeCategory.id}
                    />

                    <div className={style.category_products__main}>
                        <div className={style.category_products__head}>
                            <h1 className={style.category_products__title}>
                                {activeCategory.name}
                            </h1>

                            <p className={style.category_products__description}>
                                {activeCategory.description}
                            </p>
                        </div>

                        <CategoryProductsList
                            key={filtersKey}
                            products={products}
                            initialFilters={initialFilters}
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}
