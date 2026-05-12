import Container from '@/components/layout/Container';
import style from './FAQ.module.scss';
import FAQTypes from "@/types/FAQ";
import FAQItem from "@/components/sections/home/FAQ/FAQItem";

const questions: FAQTypes[] = [
    {
        question: 'Как сервис выбирает оптимальный материал?',
        answer: 'Сервис сравнивает цену, характеристики, наличие, условия доставки и выбранные вами приоритеты.',
    },
    {
        question: 'Можно ли задать собственные критерии?',
        answer: 'Да, подбор можно настроить по бюджету, бренду, параметрам качества и другим предпочтениям.',
    },
    {
        question: 'Сервис продаёт материалы напрямую?',
        answer: 'Нет, сервис помогает выбрать подходящее предложение и перейти к поставщику или магазину.',
    },
    {
        question: 'Подходит ли сервис для частного ремонта?',
        answer: 'Да, он полезен как для небольшого ремонта, так и для закупки материалов под крупный проект.',
    },

]
export default function FAQ() {
    return (
        <div className={style.FAQ}>
            <Container>
                <div className={style.FAQ__content}>
                    <div className={style.FAQ__title}>
                        <h2 className={style.FAQ__name}>FAQ</h2>
                        <p className={style.FAQ__description}>Ответы на частые вопросы о подборе и сравнении <br/>материалов.</p>
                    </div>
                    <div className={style.FAQ__questions}>
                        {questions.map((item) => {
                            return (
                                <FAQItem
                                    key={item.question}
                                    item={item}
                                />
                            )
                        })}
                    </div>
                </div>
            </Container>
        </div>
    )
}