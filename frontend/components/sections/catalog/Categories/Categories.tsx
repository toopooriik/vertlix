import style from './Categories.module.scss';
import Container from '@/components/layout/Container';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/src/shared/api/catalog';

export default async function Categories() {
    const categories = await getCategories();

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