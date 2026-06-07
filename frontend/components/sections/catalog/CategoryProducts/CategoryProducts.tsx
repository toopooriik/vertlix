import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/layout/Container';
import CategoryType from '@/types/categoryType';
import { productsByCategory } from '@/data/mok/product';
import style from './CategoryProducts.module.scss';
import CategoryMenu from '@/components/sections/catalog/CategoryMenu';

type CategoryProductsProps = {
    activeCategoryId: number;
};

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

export default function CategoryProducts({ activeCategoryId }: CategoryProductsProps) {
    const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? categories[0];
    const products = productsByCategory[activeCategory.id] ?? [];

    return (
        <section className={style.category_products}>
            <Container>
                <div className={style.category_products__content}>
                    <CategoryMenu
                        categories={categories}
                        activeCategoryId={activeCategory.id}
                    />

                    <div className={style.category_products__main}>
                        <div className={style.category_products__head}>
                            <h1 className={style.category_products__title}>
                                {activeCategory.name}
                            </h1>

                            <p className={style.category_products__description}>
                                {activeCategory.description}
                            </p>
                        </div>

                        <div className={style.category_products__list}>
                            {products.map((product) => (
                                <article
                                    className={style.category_products__product}
                                    key={product.id}
                                >
                                    <Link
                                        href={`/catalog/${product.categoryId}/${product.id}`}
                                        className={style.category_products__product_image_link}
                                    >
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={300}
                                            height={300}
                                            className={style.category_products__product_img}
                                        />
                                    </Link>

                                    <div className={style.category_products__product_info}>
                                        <h4 className={style.category_products__product_name}>
                                            <Link href={`/catalog/${product.categoryId}/${product.id}`}>
                                                {product.name}
                                            </Link>
                                        </h4>

                                        <p className={style.category_products__product_description}>
                                            {product.description}
                                        </p>

                                        <div className={style.category_products__product_meta}>
                                            <p>Категория: {product.category}</p>
                                            <p>С сайта: {product.site}</p>
                                            <p>Поставщик: {product.source}</p>
                                            <p>Цена: {product.price} ₽</p>
                                        </div>

                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={style.category_products__original_link}
                                        >
                                            Перейти на оригинал товара
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}