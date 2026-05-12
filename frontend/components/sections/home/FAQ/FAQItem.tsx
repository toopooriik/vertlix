'use client';
import { useState } from 'react';

import style from './FAQ.module.scss';
import FAQTypes from "@/types/FAQ";
export default function FAQItem({ item }: { item: FAQTypes }){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <div className={`${style.FAQ__question_block}`}>
            <div
                className={style.FAQ__questions_top}
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'pointer' }}
            >
                <h4 className={style.FAQ__question}>{item.question}</h4>
                <p className={`${style.FAQ__close_open}`}>
                    <span className={`${style.FAQ__vertical} ${isOpen ? style.open : ''}`}></span>
                    <span className={style.FAQ__horizontal}></span>
                </p>
            </div>

            {isOpen && (
                <div className={style.FAQ__question_bottom}>
                    <p className={style.FAQ__answer}>{item.answer}</p>
                </div>
            )}
        </div>
    )
}