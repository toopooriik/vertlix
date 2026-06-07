import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from '@/components/layout/Container';
import { productsByCategory } from '@/data/mok/product';
import style from './ProductDetails.module.scss';

type ProductDetailsProps = {
    categoryId: number;
    productId: number;
};

export default function ProductDetails({ categoryId, productId }: ProductDetailsProps) {
    const products = productsByCategory[categoryId] ?? [];
    const product = products.find((item) => item.id === productId);

    if (!product) {
        notFound();
    }

    return (
        <section className={style.product_details}>
            <Container>
                <div className={style.product_details__content}>
                    <div className={style.product_details__left}>
                        <div className={style.product_details__image_box}>
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={500}
                                height={500}
                                className={style.product_details__image}
                                priority
                            />
                        </div>

                        <div className={style.product_details__characteristics}>
                            <h3 className={style.product_details__subtitle}>
                                Характеристики
                            </h3>

                            <ul className={style.product_details__characteristics_list}>
                                {Object.entries(product.characteristics).map(([name, value]) => (
                                    <li
                                        className={style.product_details__characteristics_item}
                                        key={name}
                                    >
                                        <span>{name}</span>
                                        <p>{value}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={style.product_details__right}>
                        <div className={style.product_details__info}>
                            <p className={style.product_details__category}>
                                {product.category}
                            </p>

                            <h1 className={style.product_details__title}>
                                {product.name}
                            </h1>

                            <p className={style.product_details__description}>
                                {product.description}
                            </p>

                            <div className={style.product_details__meta}>
                                <p>
                                    <span>Сайт:</span> {product.site}
                                </p>

                                <p>
                                    <span>Поставщик:</span> {product.source}
                                </p>

                                <p>
                                    <span>Цена:</span> {product.price} ₽
                                </p>
                            </div>
                        </div>

                        <div className={style.product_details__actions}>
                            <a
                                href={product.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={style.product_details__primary_link}
                            >
                                Перейти на оригинальный сайт
                            </a>

                            <Link
                                href={`/catalog/${product.categoryId}`}
                                className={style.product_details__secondary_link}
                            >
                                Вернуться в раздел каталога
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}