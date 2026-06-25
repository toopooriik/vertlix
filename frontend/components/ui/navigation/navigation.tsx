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
    const [menuState, setMenuState] = useState({
        isOpen: false,
        pathname: '',
    });
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const isMenuOpen = menuState.isOpen && menuState.pathname === pathname;
    const isLinkActive = (href: string) => {
        if (href === '/') {
            return pathname === href;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    useEffect(() => {
        const media = window.matchMedia('(max-width: 480px)');

        const update = () => {
            setIsMobile(media.matches);
        };

        const handleScroll = () => {
            if (media.matches) return;

            setMenuState((current) => ({
                ...current,
                isOpen: false,
            }));
        };

        update();

        media.addEventListener('change', update);
        window.addEventListener('scroll', handleScroll);

        return () => {
            media.removeEventListener('change', update);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const closeMenu = () => {
        setMenuState((current) => ({
            ...current,
            isOpen: false,
        }));
    };

    const toggleMenu = () => {
        setMenuState((current) => {
            const shouldClose = current.isOpen && current.pathname === pathname;

            return {
                isOpen: !shouldClose,
                pathname,
            };
        });
    };

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
                            onClick={closeMenu}
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
                                {navLinks.map((link: LinkType) => {
                                    const isActive = isLinkActive(link.href);

                                    return (
                                        <li
                                            className={`${style.header__navList_li} ${isActive ? style.header__navList_li_active : ''}`}
                                            key={link.href}
                                        >
                                            <Link
                                                href={link.href}
                                                className={style.header__navList_link}
                                                aria-current={isActive ? 'page' : undefined}
                                                onClick={closeMenu}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </motion.ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Checkbox
                isOpen={isMenuOpen}
                onToggle={toggleMenu}
            />
        </>
    );
}
