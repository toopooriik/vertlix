'use client';

import { FormEvent, useState } from 'react';

import Container from '@/components/layout/Container';
import Social from '@/components/ui/social';
import {
    ContactRequestErrors,
    ContactRequestPayload,
    sendContactRequest,
} from '@/src/shared/api/catalog';
import style from './Contacts.module.scss';

type ContactForm = Required<ContactRequestPayload>;

const initialForm: ContactForm = {
    fullName: '',
    email: '',
    comment: '',
    website: '',
};

function normalizeEmailInput(value: string) {
    return value.trim();
}

function validateForm(values: ContactForm): ContactRequestErrors {
    const errors: ContactRequestErrors = {};
    const fullName = values.fullName.trim();
    const email = values.email.trim();
    const comment = values.comment.trim();

    if (!fullName) {
        errors.fullName = 'Укажите ФИО.';
    } else if (fullName.length < 2 || fullName.length > 120) {
        errors.fullName = 'ФИО должно быть от 2 до 120 символов.';
    } else if (!/^[\p{L}\s.'-]+$/u.test(fullName)) {
        errors.fullName = 'ФИО может содержать только буквы, пробелы, дефис, точку и апостроф.';
    }

    if (!email) {
        errors.email = 'Укажите почту.';
    } else if (email.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Укажите корректную почту.';
    }

    if (!comment) {
        errors.comment = 'Опишите вопрос.';
    } else if (comment.length < 10 || comment.length > 2000) {
        errors.comment = 'Вопрос должен быть от 10 до 2000 символов.';
    }

    return errors;
}

export default function Contacts() {
    const [form, setForm] = useState<ContactForm>(initialForm);
    const [errors, setErrors] = useState<ContactRequestErrors>({});
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field: keyof ContactForm, value: string) => {
        setForm((current) => ({
            ...current,
            [field]: field === 'email' ? normalizeEmailInput(value) : value,
        }));

        if (field !== 'website') {
            setErrors((current) => {
                const nextErrors = { ...current };
                delete nextErrors[field];

                return nextErrors;
            });
        }

        setStatus('');
        setStatusType('');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateForm(form);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setStatus('Проверьте поля формы.');
            setStatusType('error');

            return;
        }

        setIsSubmitting(true);
        setStatus('');

        try {
            const response = await sendContactRequest({
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                comment: form.comment.trim(),
                website: form.website,
            });

            setForm(initialForm);
            setErrors({});
            setStatus(response.message || 'Заявка отправлена.');
            setStatusType('success');
        } catch (error) {
            const requestError = error as Error & { errors?: ContactRequestErrors };

            setErrors(requestError.errors || {});
            setStatus(requestError.message || 'Не удалось отправить заявку.');
            setStatusType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={style.contacts}>
            <Container>
                <div className={style.contacts__content}>
                    <div className={style.contacts__left}>
                        <h2 className={style.contacts__title}>Контакты</h2>
                        <div className={style.contacts__author}>
                            <p className={style.contacts__author_name}>Шелюта Дмитрий Игоревич</p>
                            <p className={style.contacts__author_email}>is511723@gmail.com</p>
                            <p className={style.contacts__author_phone}>+7(914)428-47-34</p>
                        </div>
                        <Social />
                    </div>
                    <div className={style.contacts__right}>
                        <form className={style.contacts__form} onSubmit={handleSubmit} noValidate>
                            <input
                                type="text"
                                name="website"
                                value={form.website}
                                className={style.contacts__hidden_field}
                                tabIndex={-1}
                                autoComplete="off"
                                onChange={(event) => updateField('website', event.target.value)}
                            />

                            <div className={`${style.contacts__full_name} ${style.contacts__form_input}`}>
                                <label htmlFor="full-name"><span>ФИО</span></label>
                                <input
                                    type="text"
                                    id="full-name"
                                    name="fullName"
                                    value={form.fullName}
                                    placeholder="Иванов Иван Иванович"
                                    maxLength={120}
                                    aria-invalid={Boolean(errors.fullName)}
                                    onChange={(event) => updateField('fullName', event.target.value)}
                                />
                                {errors.fullName && (
                                    <p className={style.contacts__field_error}>{errors.fullName}</p>
                                )}
                            </div>

                            <div className={`${style.contacts__email} ${style.contacts__form_input}`}>
                                <label htmlFor="email"><span>Почта</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    placeholder="example@gmail.com"
                                    maxLength={180}
                                    aria-invalid={Boolean(errors.email)}
                                    onChange={(event) => updateField('email', event.target.value)}
                                />
                                {errors.email && (
                                    <p className={style.contacts__field_error}>{errors.email}</p>
                                )}
                            </div>

                            <div className={`${style.contacts__comment} ${style.contacts__form_input}`}>
                                <label htmlFor="comment"><span>Вопрос?</span></label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    value={form.comment}
                                    placeholder="Опишите вопрос"
                                    minLength={10}
                                    maxLength={2000}
                                    aria-invalid={Boolean(errors.comment)}
                                    onChange={(event) => updateField('comment', event.target.value)}
                                />
                                {errors.comment && (
                                    <p className={style.contacts__field_error}>{errors.comment}</p>
                                )}
                            </div>

                            {status && (
                                <p
                                    className={`${style.contacts__status} ${
                                        statusType === 'error'
                                            ? style.contacts__status_error
                                            : style.contacts__status_success
                                    }`}
                                >
                                    {status}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={style.contacts__submit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : 'Отправить'}
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
}
