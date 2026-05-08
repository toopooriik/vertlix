'use client';

import {usePathname} from 'next/navigation';
import {useState} from 'react';
import Link from 'next/link';

import style from './navigation.module.scss';
import Checkbox from "@/components/ui/burgerMenu";

import {LinkType} from '@/types/link';

const navLinks: LinkType[] = [
    {
        label: 'Главная',
        href: '/',
    },
    {
        label: 'Каталог',
        href: '/catalog',
    },
    {
        label: 'Подбор',
        href: '/selection',
    },
    {
        label: 'Сравнение',
        href: '/comparison',
    },
    {
        label: 'О сервисе',
        href: '/about',
    },
    {
        label: 'FAQ',
        href: '/FAQ',
    }
];
export default function Navigation(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    return(
        <>
            {isMenuOpen && (
                <div
                    className={`${style.interlayer} ${style.interlayerActive}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}
            <div className={style.header__navList}>
                <Checkbox
                    isOpen={isMenuOpen}
                    onToggle={() => setIsMenuOpen(prev => !prev)}
                />
                <ul className={`${style.header__navList_ul} ${isMenuOpen ? style.header__navList_ulOpen : ''}`}>

                    {navLinks.map((link: LinkType) => {
                        return (
                            <li key={link.href}>
                                <Link href={link.href}
                                      className={link.href === pathname ? style.header__active : ''}>
                                    {link.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>

    )
}