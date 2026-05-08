import style from './burgerMenu.module.scss';

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
            aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isOpen}
        >
            <span />
            <span />
            <span />
        </button>
    );
}