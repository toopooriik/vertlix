import style from './Hero.module.scss';
import Container from '@/components/layout/Container';

export default function Hero() {
    return (
        <section className={style.hero}>
            <Container>
                <div className={style.hero__content}>
                    <h1 className={style.hero__title}>
                        Найдите материалы, которые подходят именно вам
                    </h1>

                    <p className={style.hero__description}>
                        Veltrix помогает упростить выбор строительных материалов, объединяя полезную информацию в одном месте. Сервис делает поиск понятнее, быстрее и удобнее, чтобы пользователь мог сосредоточиться на решении своей строительной задачи.
                    </p>
                </div>
            </Container>
        </section>
    );
}