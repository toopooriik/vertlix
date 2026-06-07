
import Container from "@/components/layout/Container";
import style from './Contacts.module.scss';
import Social from '@/components/ui/social'
export default function Contacts(){
    return(
        <div className={style.contacts}>
            <Container>
                <div className={style.contacts__content}>
                    <div className={style.contacts__left}>
                        <h2 className={style.contacts__title}>Контакты</h2>
                        <div className={style.contacts__author}>
                            <p className={style.contacts__author_name}>Шелюта Дмитрий Игоревич</p>
                            <p className={style.contacts__author_email}>is511723@gmail.com</p>
                            <p className={style.contacts__author_phone}>+7(914)428-47-34</p>
                        </div>
                        <Social/>
                    </div>
                    <div className={style.contacts__right}>
                        <form action="" className={style.contacts__form}>
                            <div className={`${style.contacts__full_name} ${style.contacts__form_input}`}>
                                <label htmlFor={'full-name'}><span>ФИО</span></label>
                                <input type="text" id={'full-name'} placeholder={'Иванов Иван Иванович'}/>
                            </div>
                            <div className={`${style.contacts__email} ${style.contacts__form_input}`}>
                                <label htmlFor={'email'}><span>Почта</span></label>
                                <input type="text" id={'email'} placeholder={'example@gmail.com'}/>
                            </div>
                            <div className={`${style.contacts__comment} ${style.contacts__form_input}`}>
                                <label htmlFor={'comment'}><span>Вопрос?</span></label>
                                <input type="text" id={'comment'} placeholder={'Вопрос'}/>
                            </div>
                            <button type={'submit'} className={style.contacts__submit}>Отправить</button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    )
}