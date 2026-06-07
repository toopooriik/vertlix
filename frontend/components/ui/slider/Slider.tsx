'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import CategoryType from '@/types/categoryType';
import style from './Slider.module.scss';

import 'swiper/css';

const categories: CategoryType[] = [
    {
        id: 1,
        image: '/categories/cement.png',
        name: 'Цемент и сухие смеси',
        description: 'Цемент, штукатурка, шпаклёвка, клеевые смеси, наливные полы и другие материалы для строительных и отделочных работ.',
    },
    {
        id: 2,
        image: '/categories/kirpichi.png',
        name: 'Кирпич и блоки',
        description: 'Керамический кирпич, газобетонные блоки, пеноблоки, шлакоблоки и материалы для возведения стен.',
    },
    {
        id: 3,
        image: '/categories/plitca.png',
        name: 'Плитка и керамогранит',
        description: 'Напольная и настенная плитка, керамогранит, декоративные покрытия для внутренних и наружных работ.',
    },
    {
        id: 4,
        image: '/categories/derevo.png',
        name: 'Пиломатериалы',
        description: 'Доски, брус, фанера, OSB-плиты и древесные материалы для строительства и ремонта.',
    },
    {
        id: 5,
        image: '/categories/metal.png',
        name: 'Металлопрокат',
        description: 'Арматура, профили, трубы, листовой металл и комплектующие для строительных конструкций.',
    },
    {
        id: 6,
        image: '/categories/crovlia.png',
        name: 'Кровельные материалы',
        description: 'Металлочерепица, профнастил, мягкая кровля, утеплители и комплектующие для крыши.',
    },
    {
        id: 7,
        image: '/categories/otdelka.png',
        name: 'Отделочные материалы',
        description: 'Краски, обои, декоративные панели, ламинат и другие решения для финальной отделки.',
    },
    {
        id: 8,
        image: '/categories/izolica.png',
        name: 'Изоляционные материалы',
        description: 'Теплоизоляция, гидроизоляция, шумоизоляция и материалы для защиты конструкций.',
    },
    {
        id: 9,
        image: '/categories/santehnica.png',
        name: 'Сантехника и инженерия',
        description: 'Трубы, фитинги, сантехнические комплектующие и материалы для инженерных систем.',
    },
    {
        id: 10,
        image: '/categories/bolti.png',
        name: 'Крепеж и расходники',
        description: 'Саморезы, анкеры, гвозди, крепёжные элементы и сопутствующие строительные товары.',
    },
];

export default function Slider() {
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const updateButtonsState = (swiper: SwiperType) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const handleSwiperInit = (swiper: SwiperType) => {
        swiperRef.current = swiper;
        updateButtonsState(swiper);
    };

    return (
        <div className={style.slider}>
            <button
                type="button"
                className={`${style.slider__button} ${isBeginning ? style.slider__button_disabled : ''}`}
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
                className={style.slider__swiper}
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
                {categories.map((item) => (
                    <SwiperSlide key={item.id} className={style.slider__slide}>
                        <div className={style.slider__card}>
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={250}
                                height={120}
                            />

                            <div className={style.slider__card_title}>
                                <h4 className={style.slider__card_name}>
                                    {item.name}
                                </h4>

                                <p className={style.slider__card_description}>
                                    {item.description}
                                </p>
                            </div>

                            <Link
                                href={`/catalog/${item.id}`}
                                className={style.slider__card_link}
                            >
                                Перейти к категории
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className={style.slider__card_link_arrow}
                                />
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                type="button"
                className={`${style.slider__button} ${isEnd ? style.slider__button_disabled : ''}`}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                aria-label="Следующие категории"
            >
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    );
}