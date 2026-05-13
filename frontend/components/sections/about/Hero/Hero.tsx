
import Container from "@/components/layout/Container";
import style from './Hero.module.scss';

export default function Hero(){
    return(
        <div className={style.hero}>
            <Container>
                <div className={style.hero__content}>
                    <h2 className={style.hero__title}>
                        Оптимальный выбор строительных материалов — быстрее, проще, выгоднее
                    </h2>
                    <div className={style.hero__line}></div>
                    <p className={style.hero__description}>
                        Veltrix помогает частным клиентам, подрядчикам и строительным компаниям быстрее находить строительные материалы, сравнивать предложения поставщиков и выбирать наиболее выгодные решения. Сервис анализирует цену, характеристики, наличие и условия доставки в одном интерфейсе.
                    </p>
                </div>
            </Container>
        </div>
    )
}
