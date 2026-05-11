import Image from "next/image";

import style from './Hero.module.scss';
import Container from "@/components/layout/Container";

export default function Hero() {
    return (
        <div className={style.hero}>
            <Container>
                <div className={style.hero__content}>
                    <div className={style.hero__left}>
                        <Image
                            src='/hero.png'
                            alt='Hero-banner'
                            width={400}
                            height={300}
                        />
                    </div>
                    <div className={style.hero__right}>
                        <p className={style.hero__top_text}>
                            <span>
                                Сервис подбора стройматериалов
                            </span>
                        </p>

                        <h2 className={style.hero__title}>
                            Оптимальный выбор строительных материалов без лишних затрат
                        </h2>
                        <p className={style.hero__description}>
                            Сравниваем предложения, учитываем ваши предпочтения и помогаем подобрать материалы по цене,
                            качеству, наличию и условиям доставки.
                        </p>

                    </div>
                </div>
            </Container>
        </div>
    )
}