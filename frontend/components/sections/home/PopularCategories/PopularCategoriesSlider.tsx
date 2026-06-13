'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import CategoryType from '@/types/categoryType';
import style from './PopularCategories.module.scss';

import 'swiper/css';

type PopularCategoriesSliderProps = {
    categories: CategoryType[];
};

export default function PopularCategoriesSlider({
    categories,
}: PopularCategoriesSliderProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(categories.length <= 3);

    const updateButtonsState = (swiper: SwiperType) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const handleSwiperInit = (swiper: SwiperType) => {
        swiperRef.current = swiper;
        updateButtonsState(swiper);
    };

    return (
        <div className={style.catalog__slider}>
            <button
                type="button"
                className={`${style.catalog__slider_button} ${isBeginning ? style.catalog__slider_button_disabled : ''}`}
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                aria-label="Предыдущие категории"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <Swiper
                onSwiper={handleSwiperInit}
                onSlideChange={updateButtonsState}
                onResize={updateButtonsState}
                watchOverflow
                spaceBetween={40}
                slidesPerView={3}
                className={style.catalog__swiper}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    580: {
                        slidesPerView: 2,
                        spaceBetween: 25,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                    },
                }}
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.id} className={style.catalog__slide}>
                        <article className={style.catalog__card}>
                            <Image
                                src={category.image || '/categories/cement.png'}
                                alt={category.name}
                                width={250}
                                height={120}
                                className={style.catalog__card_image}
                            />

                            <div className={style.catalog__card_title}>
                                <h4 className={style.catalog__card_name}>
                                    {category.name}
                                </h4>

                                <p className={style.catalog__card_description}>
                                    {category.description}
                                </p>
                            </div>

                            <Link
                                href={`/catalog/${category.id}`}
                                className={style.catalog__card_link}
                            >
                                Перейти в категорию
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className={style.catalog__card_link_arrow}
                                />
                            </Link>
                        </article>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                type="button"
                className={`${style.catalog__slider_button} ${isEnd ? style.catalog__slider_button_disabled : ''}`}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                aria-label="Следующие категории"
            >
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    );
}
