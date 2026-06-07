
import Container from "@/components/layout/Container";
import style from './Reasons.module.scss';
import CardType from "@/components/sections/about/Reasons/cardType";

const cards:CardType[] = [
    {
        name:'Поиск на разных сайтах',
    },
    {
        name:'Ручное сравнение',
    },
    {
        name:'Проверка цен',
    },
    {
        name:'Анализ качества',
    },
    {
        name:'Потеря времени',
    },
    {
        name:'Сложность выбора',
    },

]

export default function Reasons(){
    return(
        <div className={style.reasons}>
            <Container>
                <div className={style.reasons__content}>
                    <h2 className={style.reasons__title}>
                        Почему появился Veltrix?
                    </h2>
                    <div className={style.reasons__cards}>
                        {cards.map((item, index) => {
                            return(
                                <div className={`${style.reasons__card} ${index%2!==0? style.reasons__alt_bg:''}`} key={item.name}>
                                    <h4 className={`${style.reasons__card_title} ${index%2!==0? style.reasons__alt_color:''}`}>
                                        {item.name}
                                    </h4>
                                </div>
                            )
                        })}
                    </div>
                    <h3 className={style.reasons__footnote}>
                        <span>Veltrix</span> объединяет предложения поставщиков в одном месте и упрощает процесс выбора материалов, сокращая время поиска.
                    </h3>
                </div>
            </Container>
        </div>
    )
}