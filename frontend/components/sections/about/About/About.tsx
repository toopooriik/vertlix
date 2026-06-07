import style from './About.module.scss';
import Container from '@/components/layout/Container';
import CardType from './types';
const cards:CardType[] = [
    {
        id:1,
        title: 'Собираем предложения',
        description:'Анализируем данные с разных площадок и поставщиков, чтобы показать больше доступных вариантов.',
    },
    {
        id:2,
        title: 'Фильтруем по предпочтениям',
        description:'Учитываем бюджет, характеристики, производителя.',
    },
    {
        id:3,
        title: 'Сравниваем характеристики',
        description:'Показываем различия по цене, качеству и условиям покупки в понятном виде.',
    },
    {
        id:4,
        title: 'Находим оптимальный вариант',
        description:'Рекомендуем материалы, которые лучше всего подходят под ваши требования и ограничения.',
    },
];

export default function About(){
    return(
        <div className={style.about}>
            <Container>
                <div className={style.about__content}>
                    <div>
                        <h2 className={style.about__title}>Что мы делаем</h2>
                        <p className={style.about__description}>Берём на себя рутину поиска и сравнения, чтобы вы быстрее приняли выгодное решение.</p>
                    </div>
                    <div className={style.about__cards}>
                        {cards.map((item:CardType, index:number) => {
                            return(
                                <div className={style.about__card} key={item.id}>
                                    <p className={style.about__account}>
                                        <span>
                                            0{index+1}
                                        </span>
                                    </p>
                                    <div className={style.about__card_text}>
                                        <h4 className={style.about__name}>{item.title}</h4>
                                        <p className={style.about__card_description}>{item.description}</p>
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