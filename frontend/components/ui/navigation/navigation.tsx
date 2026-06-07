'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import style from './navigation.module.scss';
import Checkbox from '@/components/ui/burgerMenu';

import { LinkType } from '@/types/link';

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
        label: 'О сервисе',
        href: '/about',
    },
    {
        label: 'Контакты',
        href: '/contacts',
    },
    {
        label: 'FAQ',
        href: '/FAQ',
    },
];

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const media = window.matchMedia('(max-width: 480px)');

        const update = () => {
            setIsMobile(media.matches);
        };

        const handleScroll = () => {
            if (media.matches) return;

            setIsMenuOpen(false);
        };

        update();

        media.addEventListener('change', update);
        window.addEventListener('scroll', handleScroll);

        return () => {
            media.removeEventListener('change', update);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!isMobile) return;

        setIsMenuOpen(false);
    }, [pathname, isMobile]);

    useEffect(() => {
        if (!isMenuOpen) return;
        if (!isMobile) return;

        const scrollY = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.documentElement.style.overflow = '';

            window.scrollTo(0, scrollY);
        };
    }, [isMenuOpen, isMobile]);

    const menuVariants = {
        closed: {
            left: '-150%',
        },
        open: (isMobileValue: boolean) => ({
            left: isMobileValue ? '0' : '2%',
        }),
    };

    return (
        <>
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            className={`${style.interlayer} ${style.interlayerActive}`}
                            onClick={() => setIsMenuOpen(false)}
                        />

                        <motion.div
                            className={style.header__navList}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <motion.ul
                                className={style.header__navList_ul}
                                custom={isMobile}
                                variants={menuVariants}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                            >
                                {navLinks.map((link: LinkType) => (
                                    <Link
                                        href={link.href}
                                        className={link.href === pathname ? style.header__active : ''}
                                        key={link.href}
                                        onClick={() => {
                                            if (isMobile) {
                                                setIsMenuOpen(false);
                                            }
                                        }}
                                    >
                                        <li className={style.header__navList_li}>
                                            {link.label}
                                        </li>
                                    </Link>
                                ))}
                            </motion.ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Checkbox
                isOpen={isMenuOpen}
                onToggle={() => setIsMenuOpen((prev) => !prev)}
            />
        </>
    );
}