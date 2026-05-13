
import style from './Description.module.scss';
import Container from "@/components/layout/Container";
export default function Description(){
    return(
        <div className={style.description}>
            <Container>
                <div className={style.description__content}>
                    <h3 className={style.description__text}>
                        Мы стремимся сделать рынок строительных материалов более прозрачным и удобным. Пользователи получают актуальную информацию, экономят время на поиске и могут принимать более обоснованные решения при покупке.
                    </h3>
                </div>
            </Container>
        </div>
    )
}