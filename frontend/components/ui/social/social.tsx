import style from './social.module.scss';

export default function Social() {
    return (
        <ul className={style.social}>
            <li className={`${style.social__icon} ${style.social__github}`}>
                <a
                    href='https://github.com/toopooriik'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='GitHub'
                >
                    <span className={style.social__tooltip}>GitHub</span>

                    <svg
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path d='M12 0C5.37 0 0 5.37 0 12C0 17.3 3.438 21.8 8.205 23.385C8.805 23.497 9.025 23.13 9.025 22.815C9.025 22.53 9.015 21.585 9.01 20.33C5.672 21.055 4.968 18.74 4.968 18.74C4.422 17.355 3.633 16.985 3.633 16.985C2.545 16.24 3.717 16.255 3.717 16.255C4.922 16.34 5.555 17.495 5.555 17.495C6.625 19.33 8.365 18.8 9.05 18.495C9.158 17.72 9.467 17.19 9.81 16.89C7.145 16.59 4.343 15.555 4.343 10.935C4.343 9.615 4.815 8.535 5.588 7.68C5.468 7.38 5.055 6.165 5.7 4.515C5.7 4.515 6.705 4.2 9 5.76C9.96 5.49 10.98 5.355 12 5.355C13.02 5.355 14.04 5.49 15 5.76C17.295 4.2 18.3 4.515 18.3 4.515C18.945 6.165 18.532 7.38 18.412 7.68C19.185 8.535 19.657 9.615 19.657 10.935C19.657 15.57 16.85 16.59 14.175 16.885C14.61 17.265 15 18.015 15 19.155C15 20.79 14.985 22.365 14.985 22.815C14.985 23.13 15.205 23.505 15.81 23.385C20.565 21.795 24 17.295 24 12C24 5.37 18.63 0 12 0Z' />
                    </svg>
                </a>
            </li>

            <li className={`${style.social__icon} ${style.social__telegram}`}>
                <a
                    href='https://t.me/shelyuta'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Telegram'
                >
                    <span className={style.social__tooltip}>Telegram</span>

                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M22.05 2.18C21.78 1.96 21.39 1.91 21.07 2.05L2.6 9.7C2.24 9.85 2 10.2 2 10.59C2 10.98 2.24 11.34 2.6 11.49L7.52 13.53L9.43 19.52C9.55 19.9 9.87 20.18 10.26 20.24C10.65 20.3 11.04 20.12 11.27 19.8L14.13 15.79L19.16 19.49C19.45 19.7 19.83 19.75 20.16 19.61C20.49 19.47 20.72 19.16 20.77 18.8L22.39 3.1C22.43 2.75 22.31 2.4 22.05 2.18ZM19.63 5.16L10.77 13.18C10.56 13.37 10.42 13.63 10.37 13.91L10.02 16.12L8.87 12.48L16.72 7.57C16.95 7.43 17.02 7.13 16.88 6.9C16.74 6.67 16.45 6.59 16.21 6.72L6.86 11.52L4.02 10.34L19.63 5.16Z" />
                    </svg>
                </a>
            </li>

            <li className={`${style.social__icon} ${style.social__vk}`}>
                <a
                    href='https://vk.com/toopoorik'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='VK'
                >
                    <span className={style.social__tooltip}>VK</span>

                    <svg
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path d='M12.785 17C7.393 17 4.318 13.302 4.19 7.143H6.89C6.978 11.666 8.97 13.58 10.55 13.975V7.143H13.09V11.042C14.65 10.875 16.29 9.098 16.84 7.143H19.38C18.957 9.553 17.177 11.33 15.91 12.06C17.177 12.653 19.21 14.204 20 17H17.2C16.6 15.14 15.1 13.69 13.09 13.49V17H12.785Z' />
                    </svg>
                </a>
            </li>
        </ul>
    );
}