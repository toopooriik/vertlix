'use client';

import { useState } from 'react';
import Link from 'next/link';

import CategoryType from '@/types/categoryType';
import style from './CategoryMenu.module.scss';

type CategoryMenuProps = {
    categories: CategoryType[];
    activeCategoryId: number;
};

export default function CategoryMenu({ categories, activeCategoryId }: CategoryMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                className={`${style.category_menu__toggle} ${
                    isOpen ? style.category_menu__toggle_open : ''
                }`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Открыть разделы каталога"
            >
                <span />
            </button>

            <aside
                className={`${style.category_menu} ${
                    isOpen ? style.category_menu_open : ''
                }`}
            >
                <h3 className={style.category_menu__title}>
                    Разделы каталога
                </h3>

                <nav className={style.category_menu__nav}>
                    {categories.map((category) => (
                        <Link
                            href={`/catalog/${category.id}`}
                            key={category.id}
                            className={`${style.category_menu__link} ${
                                category.id === activeCategoryId
                                    ? style.category_menu__link_active
                                    : ''
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {category.name}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}