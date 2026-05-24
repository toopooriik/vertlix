'use client';

import {useState, useEffect} from "react";
import {useRef} from "react";
import style from './selector.module.scss';
import {SelectorItem} from './type';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleDown} from '@fortawesome/free-solid-svg-icons';

type Arguments = {
    items: SelectorItem[],
    value: SelectorItem | string,
    onChangeAction: (item: SelectorItem) => void,
}

export default function Selector({items, value, onChangeAction}: Arguments) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdown = useRef<(HTMLDivElement | null)>(null);
    const selector = useRef<(HTMLDivElement | null)>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (selector.current && !selector.current.contains(target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.addEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return (
        <div className={style.selector} ref={selector}>
            <div className={`${style.selector__main_block} ${isOpen ? style.selector__main_block_focus : ''}`}
                 onClick={() => setIsOpen(!isOpen)}
            >
                {typeof value === 'string' ? value : value.name}
                <FontAwesomeIcon icon={faAngleDown} className={style.selector__main_block_arrow} width={20} height={16}/>
            </div>
            <div className={`${style.selector__dropdown} ${isOpen ? style.selector__dropdown_open : ''}`} ref={dropdown}>
                {items.map((item) => {
                    return (
                        <div
                            className={style.selector__dropdown_point}
                            key={item.id}
                            onClick={() => onChangeAction(item)}
                        >
                            {item.name}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}