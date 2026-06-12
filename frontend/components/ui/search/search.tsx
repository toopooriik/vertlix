'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { searchProducts } from '@/src/shared/api/catalog';
import ProductType from '@/types/productType';
import style from './search.module.scss';

export default function Search() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const normalizedQuery = query.trim();

        if (!normalizedQuery) {
            setProducts([]);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(async () => {
            setIsLoading(true);

            try {
                const result = await searchProducts(normalizedQuery);

                if (!controller.signal.aborted) {
                    setProducts(result);
                }
            } catch {
                if (!controller.signal.aborted) {
                    setProducts([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }, 250);

        return () => {
            controller.abort();
            window.clearTimeout(timeoutId);
        };
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (searchRef.current && !searchRef.current.contains(target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        setIsOpen(true);
    };

    return (
        <div className={style.search} ref={searchRef}>
            <input
                type="search"
                name="veltrix-search"
                id="veltrix-search"
                value={query}
                placeholder="Найти..."
                className={style.search__input}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                onChange={handleChange}
                onFocus={() => {
                    if (query.trim()) {
                        setIsOpen(true);
                    }
                }}
            />

            {isOpen && query.trim() && (
                <div className={style.search__dropdown}>
                    {isLoading ? (
                        <p className={style.search__empty}>Идет поиск...</p>
                    ) : products.length > 0 ? (
                        <div className={style.search__list}>
                            {products.map((product) => (
                                <Link
                                    href={`/catalog/${product.categoryId}/${product.id}`}
                                    className={style.search__item}
                                    key={`${product.categoryId}-${product.id}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={52}
                                        height={52}
                                        className={style.search__image}
                                    />

                                    <div className={style.search__info}>
                                        <h4 className={style.search__name}>
                                            {product.name}
                                        </h4>

                                        <p className={style.search__meta}>
                                            {product.category}
                                        </p>

                                        <p className={style.search__price}>
                                            {product.price} ₽
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className={style.search__empty}>
                            Ничего не найдено
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}