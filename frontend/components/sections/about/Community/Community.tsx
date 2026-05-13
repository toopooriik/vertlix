
import style from './Community.module.scss';
import Container from "@/components/layout/Container";

const cards = [
    {
        name:'Частные клиенты',
    },
    {
        name:'Подрядчики',
    },
    {
        name:'Архитекторы',
    },
    {
        name:'Дизайнеры интерьеров',
    },
    {
        name:'Строительные компании',
    },
    {
        name:' Специалисты по ремонту',
    },
    {
        name:'Девелоперы',
    },

]
export default function Community(){
    return(
        <div className={style.community}>
            <Container>
                <div className={style.community__content}>
                    <h2 className={style.community__title}>
                        Кому подойдет Veltrix?
                    </h2>
                    <div className={style.community__cards}>
                        {cards.map((item) => {
                            return(
                                <div className={style.community__card} key={item.name}>
                                    <h4 className={style.community__card_title}>{item.name}</h4>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Container>
        </div>
    )
}