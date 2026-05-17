import style from './burgerMenu.module.scss';

type CheckboxProps = {
    isOpen: boolean;
    onToggle: () => void;
};

export default function Checkbox({ isOpen, onToggle }: CheckboxProps) {
    return (
        <div className={style.position}>
            <button
                type="button"
                className={`${style.burger} ${isOpen ? style.burgerActive : ''}`}
                onClick={onToggle}
                aria-label="Toggle menu"
            >
                <span />
                <span />
                <span />
            </button>
        </div>
    );
}