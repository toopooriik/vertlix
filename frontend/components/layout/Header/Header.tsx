'use client';
import {useState} from "react";
import Image from 'next/image';

import style from './Header.module.scss';
import Container from "@/components/layout/Container";
import Filter from "@/components/ui/filter";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className={style.header}>
            <Container>
                <div className={style.header__content}>
                    <div className={style.header__content_main}>
                        <div className={style.header__top}>
                            <div className={style.header__logo}>
                                <Image
                                    src='/veltrix-logo.svg'
                                    alt='Veltrix-logo'
                                    width={170}
                                    height={80}
                                    className={style.header__logo_desktop}
                                />
                                <Image
                                    src='/logo-mobile.png'
                                    alt='Veltrix-logo'
                                    width={70}
                                    height={30}
                                    className={style.header__logo_mobile}
                                />

                            </div>
                            <div className={style.header__search}>
                                <input type="text" name={'search'} id={'search'} placeholder={'Найти...'}/>
                            </div>
                        </div>


                        <button className={style.header__button_filter} onClick={() => setIsOpen(!isOpen)}>
                            Фильтр
                        </button>
                    </div>
                    <div className={`${style.header__filter} ${isOpen ? style.header__filter_open : ''}`}>
                        <Filter/>
                    </div>
                </div>

            </Container>
        </header>
    );
}