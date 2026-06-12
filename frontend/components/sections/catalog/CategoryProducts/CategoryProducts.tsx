import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/layout/Container';
import { getCategories, getCategoryProducts } from '@/src/shared/api/catalog';
import style from './CategoryProducts.module.scss';
import CategoryMenu from '@/components/sections/catalog/CategoryMenu';

type CategoryProductsProps = {
    activeCategoryId: number;
};

export default async function CategoryProducts({ activeCategoryId }: CategoryProductsProps) {
    const categories = await getCategories();
    const fallbackCategory = categories[0];
    const categoryId = categories.some((category) => category.id === activeCategoryId)
        ? activeCategoryId
        : fallbackCategory?.id;

    if (!categoryId) {
        return null;
    }

    const { category: activeCategory, products } = await getCategoryProducts(categoryId);

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

                        <div className={style.category_products__list}>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <article
                                        className={style.category_products__product}
                                        key={product.id}
                                    >
                                        <Link
                                            href={`/catalog/${product.categoryId}/${product.id}`}
                                            className={style.category_products__product_image_link}
                                        >
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={300}
                                                height={300}
                                                className={style.category_products__product_img}
                                            />
                                        </Link>

                                        <div className={style.category_products__product_info}>
                                            <h4 className={style.category_products__product_name}>
                                                <Link href={`/catalog/${product.categoryId}/${product.id}`}>
                                                    {product.name}
                                                </Link>
                                            </h4>

                                            <p className={style.category_products__product_description}>
                                                {product.description}
                                            </p>

                                            <div className={style.category_products__product_meta}>
                                                <p>Категория: {product.category}</p>
                                                <p>С сайта: {product.site}</p>
                                                <p>Поставщик: {product.source}</p>
                                                <p>Цена: {product.price} ₽</p>
                                            </div>

                                            <a
                                                href={product.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={style.category_products__original_link}
                                            >
                                                Перейти на оригинал товара
                                            </a>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p>В этой категории пока нет товаров.</p>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}