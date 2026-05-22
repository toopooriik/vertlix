import Image from 'next/image';

import style from './Header.module.scss';
import Container from "@/components/layout/Container";

export default function Header() {
    return (
        <header className={style.header}>
            <Container>
                <div className={style.header__content}>
                    <div className={style.header__logo}>
                        <Image
                            src='/veltrix-logo.svg'
                            alt='Veltrix-logo'
                            width={170}
                            height={80}
                        />
                    </div>
                    <div className={style.header__functions}>
                        <div className={style.header__search}>
                            <input type="text" name={'search'} id={'search'}/>
                        </div>
                        <button className={style.header__button_filter}>
                            Фильтр
                        </button>
                    </div>
                </div>

            </Container>
        </header>
    );
}