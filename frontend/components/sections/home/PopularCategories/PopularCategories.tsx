
import style from './PopularCategories.module.scss';
import Container from "@/components/layout/Container";
import Slider from "@/components/ui/slider";

export default function PopularCategories() {
    return (
        <div className={style.catalog}>
            <Container>
                <div className={style.catalog__content}>
                    <div className={style.catalog__title}>
                        <h2 className={style.catalog__name}>Популярные категории <br/>материалов</h2>
                        <p className={style.catalog__description}>
                            Небольшой слайдер с примерами направлений для быстрого перехода к подбору.
                        </p>
                    </div>
                    <Slider/>
                </div>
            </Container>
        </div>
    )
}