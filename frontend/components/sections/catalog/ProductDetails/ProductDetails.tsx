import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from '@/components/layout/Container';
import ViewTracker from '@/components/sections/catalog/ViewTracker';
import { getProduct } from '@/src/shared/api/catalog';
import style from './ProductDetails.module.scss';

type ProductDetailsProps = {
    categoryId: number;
    productId: number;
};

export default async function ProductDetails({ categoryId, productId }: ProductDetailsProps) {
    let product;

    try {
        product = await getProduct(productId);
    } catch {
        notFound();
    }

    if (product.categoryId !== categoryId) {
        notFound();
    }

    return (
        <section className={style.product_details}>
            <ViewTracker id={product.id} type="product" />
            <Container>
                <div className={style.product_details__content}>
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
            </Container>
        </section>
    );
}
