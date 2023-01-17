import { MouseEventHandler } from 'react';

export interface IButtonType {
    text?: string;
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    disabled?: boolean;
    hasShadow?: boolean;
    size?: "small" | "medium" | "large";
    borderWidth?: "thin" | "medium" | "large"
    onClick?: MouseEventHandler<HTMLButtonElement>;
}