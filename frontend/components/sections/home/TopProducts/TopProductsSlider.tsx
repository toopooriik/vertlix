'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import ProductType from '@/types/productType';
import style from './TopProducts.module.scss';

import 'swiper/css';
import 'swiper/css/free-mode';

type TopProductsSliderProps = {
    products: ProductType[];
};

function formatPrice(price: number) {
    return `${new Intl.NumberFormat('ru-RU').format(price)} ₽`;
}

export default function TopProductsSlider({ products }: TopProductsSliderProps) {
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const sliderProducts = useMemo(() => {
        if (products.length === 0) {
            return [];
        }

        if (products.length >= 4) {
            return products;
        }

        const repeatCount = Math.ceil(4 / products.length) + 1;

        return Array.from({ length: repeatCount }, () => products).flat();
    }, [products]);
    const shouldLoop = sliderProducts.length > 4;

    const getProductTitle = (name: string, isExpanded: boolean) => {
        if (isExpanded || name.length <= 28) {
            return name;
        }

        return `${name.slice(0, 28)}...`;
    };

    return (
        <Swiper
            modules={[Autoplay, FreeMode]}
            loop={shouldLoop}
            loopAdditionalSlides={sliderProducts.length}
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
                    <article className={style.top_production__product}>
                        <Link
                            href={`/catalog/${product.categoryId}/${product.id}`}
                            className={style.top_production__product_image_link}
                        >
                            <Image
                                src={product.image || '/tipoProduct.svg'}
                                alt={product.name}
                                width={300}
                                height={300}
                                className={style.top_production__product_img}
                            />
                        </Link>

                        <div className={style.top_production__product_info}>
                            <h4 className={style.top_production__product_name}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (product.name.length <= 28) {
                                            return;
                                        }

                                        setExpandedProductId((prev) =>
                                            prev === product.id ? null : product.id
                                        );
                                    }}
                                    title={product.name}
                                    className={style.top_production__product_title_button}
                                >
                                    {getProductTitle(
                                        product.name,
                                        expandedProductId === product.id
                                    )}
                                </button>
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
                                Цена: {formatPrice(product.price)}
                            </p>

                            <Link
                                href={`/catalog/${product.categoryId}/${product.id}`}
                                className={style.top_production__product_link}
                            >
                                Перейти к товару
                            </Link>
                        </div>
                    </article>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
