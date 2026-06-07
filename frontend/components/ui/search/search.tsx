'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { productsByCategory } from '@/data/mok/product';
import style from './search.module.scss';

const products = Object.values(productsByCategory).flat();

export default function Search() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

    const filteredProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return [];
        }

        return products.filter((product) => {
            const searchText = [
                product.name,
                product.category,
                product.source,
                product.site,
            ]
                .join(' ')
                .toLowerCase();

            return searchText.includes(normalizedQuery);
        });
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
                    {filteredProducts.length > 0 ? (
                        <div className={style.search__list}>
                            {filteredProducts.map((product) => (
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