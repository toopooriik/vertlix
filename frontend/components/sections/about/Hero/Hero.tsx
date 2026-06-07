
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

                    <p className={style.hero__description}>
                        Veltrix помогает частным клиентам, подрядчикам и строительным компаниям быстрее находить строительные материалы, сравнивать предложения разных сайтов и предприятий специализирующихся на продаже строительных материалов, и выбирать наиболее выгодные решения.
                    </p>
                </div>
            </Container>
        </div>
    )
}
