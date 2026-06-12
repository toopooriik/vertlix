'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/layout/Container';
import style from './OriginalSite.module.scss';

type Banner = {
    id: number;
    image: string;
    alt: string;
    href: string;
};

const banners: Banner[] = [
    {
        id: 1,
        image: '/banner1.png',
        alt: 'Подберите материалы быстрее',
        href: '/catalog',
    },
    {
        id: 2,
        image: '/banner2.png',
        alt: 'Каталог строительных материалов Veltrix',
        href: '/catalog',
    },
    {
        id: 3,
        image: '/banner3.png',
        alt: 'Быстрый переход к подбору материалов',
        href: '/catalog',
    },
];

const SLIDE_DELAY = 5000;

export default function OriginalSite() {
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setActiveSlide((currentSlide) => (currentSlide + 1) % banners.length);
        }, SLIDE_DELAY);

        return () => window.clearTimeout(timeoutId);
    }, [activeSlide]);

    return (
        <section className={style.original_site} aria-label="Баннеры">
            <Container>
                <div className={style.original_site__slider}>
                    <div className={style.original_site__viewport}>
                        <div
                            className={style.original_site__track}
                            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                        >
                            {banners.map((banner, index) => (
                                <Link
                                    href={banner.href}
                                    className={style.original_site__slide}
                                    key={banner.id}
                                    aria-hidden={activeSlide !== index}
                                    tabIndex={activeSlide === index ? 0 : -1}
                                >
                                    <Image
                                        src={banner.image}
                                        alt={banner.alt}
                                        fill
                                        priority={index === 0}
                                        sizes="(max-width: 480px) calc(100vw - 32px), (max-width: 1024px) calc(100vw - 80px), 1320px"
                                        className={style.original_site__image}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className={style.original_site__dots} aria-label="Переключение баннеров">
                        {banners.map((banner, index) => {
                            const isActive = activeSlide === index;
                            const dotClassName = isActive
                                ? `${style.original_site__dot} ${style['original_site__dot--active']}`
                                : style.original_site__dot;

                            return (
                                <button
                                    type="button"
                                    className={dotClassName}
                                    key={banner.id}
                                    onClick={() => setActiveSlide(index)}
                                    aria-label={`Показать баннер ${index + 1}`}
                                    aria-current={isActive}
                                />
                            );
                        })}
                    </div>
                </div>
            </Container>
        </section>
    );
}
