import Container from "@/components/layout/Container";
import style from './Works.module.scss';
import WorkType from "@/components/sections/about/Works/WorkType";

const works: WorkType[] = [
    {
        text: 'Выбираете категорию',
    },
    {
        text: 'Настраиваете параметры',
    },
    {
        text: 'Сравниваете предложения',
    },
    {
        text: 'Выбираете лучшее',
    },

]

export default function Works() {
    return (
        <div className={style.works}>
            <Container>
                <div className={style.works__content}>
                    <h2 className={style.works__title}>
                        Как работает Veltrix?
                    </h2>
                    <div className={style.works__cards}>
                        {works.map((item, index) => {
                            return (
                                <div className={`${index % 2 === 0 ? style.works__left : style.works__right}`} key={index}>
                                    <div className={style.works__card}>
                                        <h4 className={style.works__number}>
                                            {index+1}
                                        </h4>
                                        <h3 className={style.works__text}>
                                            {item.text}
                                        </h3>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Container>
        </div>
    )
}