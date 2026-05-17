import style from './burgerMenu.module.scss';
import {useEffect, useRef} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';

type CheckboxProps = {
    isOpen: boolean;
    onToggle: () => void;
};

export default function Checkbox({isOpen, onToggle}: CheckboxProps) {
    return (
        <button
            type="button"
            className={`${style.burger} ${isOpen ? style.burgerActive : ''}`}
            onClick={onToggle}
        >
            Меню
        </button>
    );
}