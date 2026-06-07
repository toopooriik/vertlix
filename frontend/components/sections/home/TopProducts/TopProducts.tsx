'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Container from '@/components/layout/Container';
import style from './TopProducts.module.scss';

import 'swiper/css';
import 'swiper/css/free-mode';

const products = [
    {
        id: 1,
        name: 'Кирпич облицовочный',
        category: 'Кирпич и блоки',
        source: 'СтройМаркет',
        site: 'Петрович',
        price: 1250,
        link: '/products/1',
    },
    {
        id: 2,
        name: 'Газобетонный блок D500',
        category: 'Кирпич и блоки',
        source: 'BuildHouse',
        site: 'ВсеИнструменты',
        price: 890,
        link: '/products/2',
    },
    {
        id: 3,
        name: 'Цемент М500',
        category: 'Цемент и сухие смеси',
        source: 'ЦементТорг',
        site: 'Leroy Merlin',
        price: 540,
        link: '/products/3',
    },
    {
        id: 4,
        name: 'Металлочерепица Classic',
        category: 'Кровельные материалы',
        source: 'RoofMaster',
        site: 'OBI',
        price: 2100,
        link: '/products/4',
    },
    {
        id: 5,
        name: 'Пеноплекс 50 мм',
        category: 'Изоляционные материалы',
        source: 'ТеплоДом',
        site: 'Максидом',
        price: 760,
        link: '/products/5',
    },
    {
        id: 6,
        name: 'Штукатурка гипсовая',
        category: 'Цемент и сухие смеси',
        source: 'MasterMix',
        site: 'Петрович',
        price: 430,
        link: '/products/6',
    },
    {
        id: 7,
        name: 'Ламинат дуб светлый',
        category: 'Отделочные материалы',
        source: 'FloorLine',
        site: 'Leroy Merlin',
        price: 1590,
        link: '/products/7',
    },
    {
        id: 8,
        name: 'Профильная труба 40x40',
        category: 'Металлопрокат',
        source: 'SteelGroup',
        site: 'ВсеИнструменты',
        price: 980,
        link: '/products/8',
    },
    {
        id: 9,
        name: 'Керамическая плитка Loft',
        category: 'Плитка и керамогранит',
        source: 'Ceramica',
        site: 'OBI',
        price: 1890,
        link: '/products/9',
    },
    {
        id: 10,
        name: 'OSB плита 12 мм',
        category: 'Пиломатериалы',
        source: 'WoodPro',
        site: 'Максидом',
        price: 1340,
        link: '/products/10',
    },
];

export default function TopProducts() {
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const sliderProducts = [...products, ...products, ...products];

    const getProductTitle = (name: string, isExpanded: boolean) => {
        if (isExpanded || name.length <= 18) {
            return name;
        }

        return `${name.slice(0, 18)}...`;
    };

    return (
        <div className={style.top_production}>
            <Container>
                <div className={style.top_production__content}>
                    <h2 className={style.top_production__title}>Ищут чаще всего</h2>

                    <div className={style.top_production__slider}>
                        <Swiper
                            modules={[Autoplay, FreeMode]}
                            loop
                            loopAdditionalSlides={products.length * 2}
                            freeMode={{
                                enabled: true,
                                momentum: false,
                            }}
                            grabCursor
                            simulateTouch
                            allowTouchMove
                            speed={6000}
                            autoplay={{
                                delay: 1,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: false,
                            }}
                            slidesPerView={4}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                    spaceBetween: 18,
                                },
                                580: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 25,
                                },
                                1300: {
                                    slidesPerView: 4,
                                    spaceBetween: 25,
                                },
                            }}
                            spaceBetween={25}
                            className={style.top_production__swiper}
                        >
                            {sliderProducts.map((product, index) => (
                                <SwiperSlide
                                    key={`${product.id}-${index}`}
                                    className={style.top_production__slide}
                                >
                                    <div className={style.top_production__product}>
                                        <Image
                                            src="/tipoProduct.svg"
                                            alt={product.name}
                                            width={300}
                                            height={300}
                                            className={style.top_production__product_img}
                                        />

                                        <div className={style.top_production__product_info}>
                                            <h4 className={style.top_production__product_name}>
                                                <span
                                                    onClick={() => {
                                                        if (product.name.length <= 18) return;

                                                        setExpandedProductId((prev) =>
                                                            prev === product.id ? null : product.id
                                                        );
                                                    }}
                                                    title={product.name}
                                                    style={{
                                                        cursor: product.name.length > 18 ? 'pointer' : 'default',
                                                    }}
                                                >
                                                    {getProductTitle(
                                                        product.name,
                                                        expandedProductId === product.id
                                                    )}
                                                </span>
                                            </h4>

                                            <p className={style.top_production__product_category}>
                                                Категория: {product.category}
                                            </p>

                                            <p className={style.top_production__product_category}>
                                                С сайта: {product.site}
                                            </p>

                                            <p className={style.top_production__product_source}>
                                                Поставщик: {product.source}
                                            </p>

                                            <p className={style.top_production__product_price}>
                                                Цена: {product.price}
                                            </p>

                                            <a
                                                href={product.link}
                                                className={style.top_production__product_link}
                                            >
                                                Перейти к товару
                                            </a>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </Container>
        </div>
    );
}