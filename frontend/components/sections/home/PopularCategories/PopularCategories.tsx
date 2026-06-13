import Container from '@/components/layout/Container';
import { getPopularCategories } from '@/src/shared/api/catalog';
import style from './PopularCategories.module.scss';
import PopularCategoriesSlider from './PopularCategoriesSlider';

export default async function PopularCategories() {
    const categories = await getPopularCategories(5).catch(() => []);

    return (
        <section className={style.catalog}>
            <Container>
                <div className={style.catalog__content}>
                    <div className={style.catalog__title}>
                        <h2 className={style.catalog__name}>
                            Популярные категории <br />товаров
                        </h2>
                        <p className={style.catalog__description}>
                            Разделы, в которые пользователи заходят чаще всего.
                        </p>
                    </div>

                    {categories.length > 0 ? (
                        <PopularCategoriesSlider categories={categories} />
                    ) : (
                        <p className={style.catalog__empty}>
                            Популярные категории появятся после первых посещений.
                        </p>
                    )}
                </div>
            </Container>
        </section>
    );
}
