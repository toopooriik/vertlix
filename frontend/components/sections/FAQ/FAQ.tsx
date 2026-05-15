
import Container from "@/components/layout/Container";
import FAQItem from "@/components/sections/home/FAQ/FAQItem";
import { faqData } from "@/components/sections/FAQ/answer";
import style from './FAQ.module.scss';

export default function FAQ(){
    return(
        <div className={style.FAQ}>
            <Container>
                <div className={style.FAQ__content}>
                    <div className={style.FAQ__title}>
                        <h2 className={style.FAQ__name}>FAQ</h2>
                        <p className={style.FAQ__description}>
                            Здесь собраны ответы на часто задаваемые вопросы о сервисе Veltrix, его возможностях и работе. Если вы не нашли нужную информацию, вы всегда можете обратиться к нам.
                        </p>
                    </div>
                    <div className={style.FAQ__questions}>
                        {faqData.map((item) => {
                            return(
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