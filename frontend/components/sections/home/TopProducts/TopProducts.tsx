import Container from '@/components/layout/Container';
import { getPopularProducts } from '@/src/shared/api/catalog';
import style from './TopProducts.module.scss';
import TopProductsSlider from './TopProductsSlider';

export default async function TopProducts() {
    const products = await getPopularProducts(15).catch(() => []);

    return (
        <section className={style.top_production}>
            <Container>
                <div className={style.top_production__content}>
                    <h2 className={style.top_production__title}>Ищут чаще всего</h2>

                    <div className={style.top_production__slider}>
                        {products.length > 0 ? (
                            <TopProductsSlider products={products} />
                        ) : (
                            <p className={style.top_production__empty}>
                                Популярные товары появятся после первых посещений.
                            </p>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}
