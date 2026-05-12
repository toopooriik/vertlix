'use client';

import {useRef, useState, useEffect} from 'react';
import Link from "next/link";
import Image from "next/image";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import CategoryType from "@/types/categoryType";
import style from './Slider.module.scss';


const categories: CategoryType[] = [
    {
        id: 1,
        image: '/categories/cement.png',
        name: 'Цемент и сухие смеси',
        description: 'Цемент, штукатурка, шпаклёвка, клеевые смеси, наливные полы и другие материалы для строительных и отделочных работ.',
        href: 'das',
    },
    {
        id: 2,
        image: '/categories/kirpichi.png',
        name: 'Кирпич и блоки',
        description: 'Керамический кирпич, газобетонные блоки, пеноблоки, шлакоблоки и материалы для возведения стен.',
        href: 'das',
    },
    {
        id: 3,
        image: '/categories/plitca.png',
        name: 'Плитка и керамогранит',
        description: 'Напольная и настенная плитка, керамогранит, декоративные покрытия для внутренних и наружных работ.',
        href: 'das',
    },
    {
        id: 4,
        image: '/categories/derevo.png',
        name: 'Пиломатериалы',
        description: 'Доски, брус, фанера, OSB-плиты и древесные материалы для строительства и ремонта.',
        href: 'das',
    },
    {
        id: 5,
        image: '/categories/metal.png',
        name: 'Металлопрокат',
        description: 'Арматура, профили, трубы, листовой металл и комплектующие для строительных конструкций.',
        href: 'das',
    },
    {
        id: 6,
        image: '/categories/crovlia.png',
        name: 'Кровельные материалы',
        description: 'Металлочерепица, профнастил, мягкая кровля, утеплители и комплектующие для крыши.',
        href: 'das',
    },
    {
        id: 7,
        image: '/categories/otdelka.png',
        name: 'Отделочные материалы',
        description: 'Краски, обои, декоративные панели, ламинат и другие решения для финальной отделки.',
        href: 'das',
    },
    {
        id: 8,
        image: '/categories/izolica.png',
        name: 'Изоляционные материалы',
        description: 'Теплоизоляция, гидроизоляция, шумоизоляция и материалы для защиты конструкций.',
        href: 'das',
    },
    {
        id: 9,
        image: '/categories/santehnica.png',
        name: 'Сантехника и инженерия',
        description: 'Трубы, фитинги, сантехнические комплектующие и материалы для инженерных систем.',
        href: 'das',
    },
    {
        id: 10,
        image: '/categories/bolti.png',
        name: 'Крепеж и расходники',
        description: 'Саморезы, анкеры, гвозди, крепёжные элементы и сопутствующие строительные товары.',
        href: 'das',
    },

]

export default function Slider() {
    const container = useRef(null);
    const card = useRef(null);
    const prevBtn = useRef(null);
    const nextBtn = useRef(null)
    const [transform, setTransform] = useState(0);

    function offsetCalculation():number{
        const styles = window.getComputedStyle(container.current);
        const gap:number = parseInt(styles.gap) || 0;
        const widthCard:number = card.current.offsetWidth;

        return gap + widthCard;
    }
    function next()
    {
        nextBtn.current.disabled = false;
        const length:number = offsetCalculation();
        const maxTranslate =
            container.current.scrollWidth -
            container.current.parentElement.offsetWidth;
        if (-maxTranslate >  transform-length){
            setTransform(-maxTranslate)
            nextBtn.current.disabled = true;
            return;
        }
        setTransform(transform-length);
    }
    function prev(){
        prevBtn.current.disabled = false;
        const length:number = offsetCalculation();
        if(transform+length > 0){
            setTransform(0);
            prevBtn.current.disabled = true;
            return;
        }

        setTransform(transform+length);
    }

    useEffect(() => {
        if(container.current){
            container.current.style.transform = `translateX(${transform}px)`;
        }
    }, [transform])
    return (
        <>
            <FontAwesomeIcon icon={faArrowLeft} className={style.slider__arrow_left} onClick={prev} ref={prevBtn}/>
            <FontAwesomeIcon icon={faArrowRight} className={style.slider__arrow_right} onClick={next} ref={nextBtn}/>
            <div className={style.slider}>
                <div className={style.slider__conteiner} ref={container}>
                    {categories.map((item) => {
                        return (
                            <div className={style.slider__card} key={item.id} ref={card}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={250}
                                    height={120}
                                />
                                <div className={style.slider__card_title}>
                                    <h4 className={style.slider__card_name}>{item.name}</h4>
                                    <p className={style.slider__card_description}>{item.description}</p>
                                </div>
                                <Link href={item.href} className={style.slider__card_link}>
                                    Перейти к категории <FontAwesomeIcon icon={faArrowRight}
                                                                         className={style.slider__card_link_arrow}/>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}