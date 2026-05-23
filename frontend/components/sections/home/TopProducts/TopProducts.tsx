'use client';
import Image from "next/image";
import style from './TopProducts.module.scss';
import Container from "@/components/layout/Container";
import {useState, useEffect} from "react";
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
    const [itemsPerCard, setItemsPerCard] = useState(4);
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const getProductTitle = (name: string, isExpanded: boolean) => {
        if (isExpanded || name.length <= 18) {
            return name;
        }

        return `${name.slice(0, 18)}...`;
    };
    useEffect(() => {
        const checkScreen = () => {
            if (window.innerWidth <= 1920) {
                setItemsPerCard(4);
            }
            if (window.innerWidth <= 1300) {
                setItemsPerCard(3);
            }
            if (window.innerWidth <= 1024) {
                setItemsPerCard(2);
            }
            if (window.innerWidth <= 580) {
                setItemsPerCard(1);
            }
        };

        checkScreen();

        window.addEventListener('resize', checkScreen);

        return () => {
            window.removeEventListener('resize', checkScreen);
        };
    }, []);
    const grouped = [];

    for (let i = 0; i < products.length; i += itemsPerCard) {
        grouped.push(products.slice(i, i + itemsPerCard));
    }
    useEffect(() => {
        if (!grouped.length) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % grouped.length);
        }, 5000); // скорость автопрокрутки

        return () => clearInterval(interval);
    }, [grouped.length]);
    return (
        <div className={style.top_production}>
            <Container>
                <div className={style.top_production__content}>
                    <h2 className={style.top_production__title}>Ищут чаще всего</h2>
                    <div className={style.top_production__slider}>
                        <div
                            className={style.top_production__slider_wrapper}
                            style={{
                                transform: `translateX(-${currentSlide * 100}%)`,
                                transition: 'transform 0.6s ease',
                            }}
                        >
                            {grouped.map((group, index) => (
                                <div className={style.top_production__card} key={index}>
                                    {group.map((product) => (
                                        <div key={product.id} className={style.top_production__product}>
                                            <Image
                                                src={'/tipoProduct.svg'}
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
                                                           setExpandedProductId((prev) => (prev === product.id ? null : product.id));
                                                       }}
                                                       title={product.name}
                                                       style={{cursor: product.name.length > 18 ? 'pointer' : 'default'}}
                                                   >
                                                       {getProductTitle(product.name, expandedProductId === product.id)}
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
                                                <a href={product.link} className={style.top_production__product_link}>
                                                    Перейти к товару
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}