import Image from 'next/image';

import style from './Header.module.scss';
import Navigation from "@/components/ui/navigation";

export default function Header() {
    return (
        <header className={style.header}>

            <div className={style.header__logo}>
                <Image
                    src='/veltrix-logo.svg'
                    alt='Veltrix-logo'
                    width={170}
                    height={80}
                />
            </div>
            <Navigation/>
        </header>
    );
}