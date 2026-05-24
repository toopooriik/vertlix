import style from './input.module.scss';
import React from "react";

type ValueType = 'text' | 'number';

type Arguments = {
    placeholder: string,
    typeValue?: ValueType,
    value: string,
    setValue: (value: string) => void,
    maxWidth: string,
    height: string,
}
export default function Input({placeholder, value, setValue, maxWidth, height, typeValue = 'text'}: Arguments) {

    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;

        if (typeValue === 'number') {
            if (/^\d*$/.test(next)) setValue(next);
            return;
        }

        setValue(next);
    }
    return (
        <div className={style.input} style={{maxWidth: maxWidth, height:height}}>
            <input type="text"
                   className={style.input__block}
                   value={value}
                   placeholder={placeholder}
                   onChange={changeValue}
            />
        </div>
    )
}