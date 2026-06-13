'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
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
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
    const [isOptionsLoading, setIsOptionsLoading] = useState(false);

    useEffect(() => {
        let isActive = true;

        async function loadCategories() {
            setIsCategoriesLoading(true);

            try {
                const loadedCategories = await getCategories();

                if (!isActive) {
                    return;
                }

                setCategories(loadedCategories);
            } finally {
                if (isActive) {
                    setIsCategoriesLoading(false);
                }
            }
        }

        loadCategories();

        return () => {
            isActive = false;
        };
    }, []);

    const currentCategoryId = getCurrentCategoryId(pathname);
    const targetCategoryId = useMemo(() => {
        return categoryId || currentCategoryId;
    }, [categoryId, currentCategoryId]);
    const isLoading = isCategoriesLoading || isOptionsLoading;
    const isCategorySelectDisabled = isCategoriesLoading || categories.length === 0;
    const isSiteSelectDisabled = isOptionsLoading || sites.length === 0;
    const isSourceSelectDisabled = isOptionsLoading || sources.length === 0;

    useEffect(() => {
        let isActive = true;

        async function loadFilterOptions() {
            setIsOptionsLoading(true);

            try {
                const filterOptions = await getProductFilterOptions({
                    categoryId: targetCategoryId,
                    site,
                });

                if (!isActive) {
                    return;
                }

                setSites(filterOptions.sites);
                setSources(filterOptions.sources);
                setSource((currentSource) => (
                    currentSource && !filterOptions.sources.includes(currentSource)
                        ? ''
                        : currentSource
                ));
            } finally {
                if (isActive) {
                    setIsOptionsLoading(false);
                }
            }
        }

        loadFilterOptions();

        return () => {
            isActive = false;
        };
    }, [site, targetCategoryId]);

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCategoryId(event.target.value);
        setSite('');
        setSource('');
    };

    const handleSiteChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSite(event.target.value);
        setSource('');
    };

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
                        onChange={handleCategoryChange}
                        disabled={isCategorySelectDisabled}
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
                        onChange={handleSiteChange}
                        disabled={isSiteSelectDisabled}
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
                        disabled={isSourceSelectDisabled}
                    >
                        <option value="">
                            {sources.length > 0 ? 'Все поставщики' : 'Нет поставщиков'}
                        </option>
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
