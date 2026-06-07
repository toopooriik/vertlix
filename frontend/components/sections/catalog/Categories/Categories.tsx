import style from './Categories.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import Link from 'next/link';
import CategoryType from '@/types/categoryType';

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

export default function Categories() {
    return (
        <div className={style.categories}>
            <Container>
                <div className={style.categories__content}>
                    <div className={style.categories__title}>
                        <h2 className={style.categories__title_page}>Каталог</h2>
                    </div>

                    <div className={style.categories__list_categories}>
                        {categories.map((item) => (
                            <Link
                                href={`/catalog/${item.id}`}
                                className={style.categories__card_link}
                                key={item.id}
                            >
                                <div className={style.categories__card}>
                                    <div className={style.categories__card_image}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={250}
                                            height={120}
                                        />
                                    </div>

                                    <div className={style.categories__card_title}>
                                        <h4 className={style.categories__card_name}>
                                            {item.name}
                                        </h4>

                                        <p className={style.categories__card_description}>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}