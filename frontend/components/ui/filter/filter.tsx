'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { getCategories, getProductFilterOptions } from '@/src/shared/api/catalog';
import CategoryType from '@/types/categoryType';
import style from './filter.module.scss';

type FilterProps = {
    onSubmitted?: () => void;
};

function normalizePriceInput(value: string) {
    return value.replace(/[^\d]/g, '');
}

function getCurrentCategoryId(pathname: string) {
    const match = pathname.match(/^\/catalog\/(\d+)/);

    return match?.[1] ?? '';
}

export default function Filter({ onSubmitted }: FilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [sites, setSites] = useState<string[]>([]);
    const [sources, setSources] = useState<string[]>([]);
    const [categoryId, setCategoryId] = useState('');
    const [site, setSite] = useState('');
    const [source, setSource] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        async function loadOptions() {
            setIsLoading(true);

            try {
                const [loadedCategories, filterOptions] = await Promise.all([
                    getCategories(),
                    getProductFilterOptions(),
                ]);

                if (!isActive) {
                    return;
                }

                setCategories(loadedCategories);
                setSites(filterOptions.sites);
                setSources(filterOptions.sources);
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        loadOptions();

        return () => {
            isActive = false;
        };
    }, []);

    const currentCategoryId = getCurrentCategoryId(pathname);
    const targetCategoryId = useMemo(() => {
        return categoryId || currentCategoryId;
    }, [categoryId, currentCategoryId]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!targetCategoryId) {
            return;
        }

        const params = new URLSearchParams();

        if (site) {
            params.set('site', site);
        }

        if (source) {
            params.set('source', source);
        }

        if (minPrice) {
            params.set('minPrice', minPrice);
        }

        if (maxPrice) {
            params.set('maxPrice', maxPrice);
        }

        const query = params.toString();
        router.push(`/catalog/${targetCategoryId}${query ? `?${query}` : ''}`);
        onSubmitted?.();
    };

    const resetFilters = () => {
        setSite('');
        setSource('');
        setMinPrice('');
        setMaxPrice('');

        if (targetCategoryId) {
            router.push(`/catalog/${targetCategoryId}`);
            onSubmitted?.();
        }
    };

    return (
        <form className={style.filter} onSubmit={handleSubmit}>
            <div className={style.filter__control}>
                <label className={style.filter__field}>
                    <span>Категория</span>
                    <select
                        value={categoryId || currentCategoryId}
                        onChange={(event) => setCategoryId(event.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category) => (
                            <option value={category.id} key={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={style.filter__field}>
                    <span>Сайт</span>
                    <select
                        value={site}
                        onChange={(event) => setSite(event.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">Все сайты</option>
                        {sites.map((option) => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={style.filter__field}>
                    <span>Поставщик</span>
                    <select
                        value={source}
                        onChange={(event) => setSource(event.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">Все поставщики</option>
                        {sources.map((option) => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <div className={style.filter__min_max_price}>
                    <p>Диапазон цены</p>
                    <div className={style.filter__min_max_price_inputs}>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={minPrice}
                            placeholder="От"
                            onChange={(event) => setMinPrice(normalizePriceInput(event.target.value))}
                        />
                        <input
                            type="text"
                            inputMode="numeric"
                            value={maxPrice}
                            placeholder="До"
                            onChange={(event) => setMaxPrice(normalizePriceInput(event.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className={style.filter__actions}>
                <button
                    type="button"
                    className={style.filter__button_secondary}
                    onClick={resetFilters}
                    disabled={!targetCategoryId}
                >
                    Сбросить
                </button>

                <button
                    type="submit"
                    className={style.filter__button}
                    disabled={!targetCategoryId || isLoading}
                >
                    Найти
                </button>
            </div>
        </form>
    );
}
