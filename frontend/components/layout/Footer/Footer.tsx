import Image from 'next/image';

import Social from "@/components/ui/social";
import Navigation from "@/components/ui/navigation";
import style from './Footer.module.scss'

export default function Footer(){
return(
  <footer className={style.footer}>
    <div className={style.footer__navifation}>
      <Navigation />
    </div>
    <div className={style.footer__bottom}>
      <div className={style.footer__logo}>
        <Image
            src='/veltrix-logo.svg'
            alt='Veltrix'
            width={170}
            height={80}
        />
      </div>
      <div className={style.footer__contacts}>
        <h4 className={style.footer__title}>Контакты</h4>
          <p className={style.footer__cont_info}><a href="mailto:is511723@gmail.com">is511723@gmail.com</a></p>
        <p className={style.footer__cont_info}>+7(914)428-47-34</p>
      </div>
      <div className={style.footer__social}>
        <h4 className={style.footer__title}>Социальные сети</h4>
        <Social />
      </div>
    </div>
  </footer>
);
}