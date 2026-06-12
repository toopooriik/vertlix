'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import ProductType from '@/types/productType';
import style from './CategoryProducts.module.scss';

type CategoryProductsListProps = {
    products: ProductType[];
    initialFilters?: ProductFilterValues;
};

export type ProductFilterValues = {
    query?: string;
    site?: string;
    source?: string;
    minPrice?: string;
    maxPrice?: string;
};

function uniqueSorted(values: string[]) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'ru'));
}

function normalizeSearch(value: string) {
    return value.trim().toLowerCase();
}

function normalizePriceInput(value: string) {
    return value.replace(/[^\d]/g, '');
}

function formatPrice(price: number) {
    return `${new Intl.NumberFormat('ru-RU').format(price)} ₽`;
}

export default function CategoryProductsList({
    products,
    initialFilters = {},
}: CategoryProductsListProps) {
    const [query, setQuery] = useState(initialFilters.query ?? '');
    const [site, setSite] = useState(initialFilters.site ?? '');
    const [source, setSource] = useState(initialFilters.source ?? '');
    const [minPrice, setMinPrice] = useState(initialFilters.minPrice ?? '');
    const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ?? '');

    const sites = useMemo(() => uniqueSorted(products.map((product) => product.site)), [products]);
    const sources = useMemo(() => uniqueSorted(products.map((product) => product.source)), [products]);

    const filteredProducts = useMemo(() => {
        const search = normalizeSearch(query);
        const min = minPrice === '' ? null : Number(minPrice);
        const max = maxPrice === '' ? null : Number(maxPrice);

        return products.filter((product) => {
            if (search) {
                const searchArea = normalizeSearch([
                    product.name,
                    product.site,
                    product.source,
                ].join(' '));

                if (!searchArea.includes(search)) {
                    return false;
                }
            }

            if (site && product.site !== site) {
                return false;
            }

            if (source && product.source !== source) {
                return false;
            }

            if (min !== null && product.price < min) {
                return false;
            }

            if (max !== null && product.price > max) {
                return false;
            }

            return true;
        });
    }, [maxPrice, minPrice, products, query, site, source]);

    const hasActiveFilters = query !== '' || site !== '' || source !== '' || minPrice !== '' || maxPrice !== '';

    const resetFilters = () => {
        setQuery('');
        setSite('');
        setSource('');
        setMinPrice('');
        setMaxPrice('');
    };

    if (products.length === 0) {
        return <p className={style.category_products__empty}>В этой категории пока нет товаров.</p>;
    }

    return (
        <>
            <div className={style.category_products__filters}>
                <label className={style.category_products__filter_field}>
                    <span>Поиск</span>
                    <input
                        type="search"
                        value={query}
                        placeholder="Название, сайт, поставщик"
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </label>

                <label className={style.category_products__filter_field}>
                    <span>Сайт</span>
                    <select value={site} onChange={(event) => setSite(event.target.value)}>
                        <option value="">Все сайты</option>
                        {sites.map((option) => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={style.category_products__filter_field}>
                    <span>Поставщик</span>
                    <select value={source} onChange={(event) => setSource(event.target.value)}>
                        <option value="">Все поставщики</option>
                        {sources.map((option) => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <div className={style.category_products__price_filters}>
                    <label className={style.category_products__filter_field}>
                        <span>Цена от</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={minPrice}
                            placeholder="0"
                            onChange={(event) => setMinPrice(normalizePriceInput(event.target.value))}
                        />
                    </label>

                    <label className={style.category_products__filter_field}>
                        <span>Цена до</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={maxPrice}
                            placeholder="999999"
                            onChange={(event) => setMaxPrice(normalizePriceInput(event.target.value))}
                        />
                    </label>
                </div>

                <button
                    type="button"
                    className={style.category_products__reset}
                    onClick={resetFilters}
                    disabled={!hasActiveFilters}
                >
                    Сбросить
                </button>
            </div>

            <p className={style.category_products__filter_result}>
                Найдено: {filteredProducts.length} из {products.length}
            </p>

            <div className={style.category_products__list}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
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

                                <p className={style.category_products__product_price}>
                                    {formatPrice(product.price)}
                                </p>

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
                    <p className={style.category_products__empty}>По выбранным фильтрам товары не найдены.</p>
                )}
            </div>
        </>
    );
}
