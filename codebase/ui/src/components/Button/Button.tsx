import React, { FC } from 'react'
import styled from 'styled-components';

import { IButtonType } from "./Button.types"
import Helper from "../../Helper";

const helper = new Helper();

const _SMALL = ["8px", "20px", "8px"];
const _SMALLER = ["6px", "18px", "6px"];
const _MEDIUM = ["10px", "30px", "10px"];
const _MEDIUMER = ["8px", "28px", "8px"];
const _LARGE = ["14px", "30px", "14px"];
const _LARGEER = ["12px", "28px", "12px"];

const BaseButton = styled.button<IButtonType>`
    border: 0;
    font-size: 16px;
    font-weight: 500;
    border-radius: 4px;
    line-height: 1;
    font-family: "Inter";
    display: inline-block;
    color: ${(props: IButtonType) => props.textColor ? props.textColor : "#000000"};
    background-color: transparent;
    cursor: ${(props: IButtonType) => props.disabled ? "not-allowed" : "pointer"};
    opacity: ${(props: IButtonType) => props.disabled ? 0.5 : 1};
    padding: ${(props: IButtonType) => props.size === "small" ? _SMALL.join(" ") : (props.size === "medium" ? _MEDIUM.join(" ") : (props.size === "large" ? _LARGE.join(" ") : _LARGE.join(" ")))};
    transition: .1s;
    &:active {
        font-size: 14px;
    };
    &:hover {
        background-color: ${(props: IButtonType) => props.bgColor ? helper.LightenDarkenColor(props.bgColor, -20) : "rgba(85, 182, 225, .5)"};
    }
`

const FilledButtonStyle = styled(BaseButton)`
    color: ${(props: IButtonType) => props.textColor ? props.textColor : "#ffffff"};
    background-color: ${(props: IButtonType) => props.bgColor ? props.bgColor : "#55B6E1"};
    &:hover {
        background-color: ${(props: IButtonType) => props.bgColor ? helper.LightenDarkenColor(props.bgColor, -20) : helper.LightenDarkenColor("#55B6E1", -20)};
    }
    &:active {
        padding: ${props => props.size === "small" ? _SMALLER.join(" ") : (props.size === "medium" ? _MEDIUMER.join(" ") : _LARGEER.join(" "))};
        font-size: 16px;
    };
`

const OutlinedButtonStyle = styled(BaseButton)`
    border: ${props => props.borderWidth === "thin" ? "1px" : (props.borderWidth === "medium" ? "2px" : (props.borderWidth === "large" ? "4px" : "1px"))} solid ${(props: IButtonType) => props.borderColor ? props.borderColor : "#000000"};
    &:active {
        padding: ${props => props.size === "small" ? _SMALLER.join(" ") : (props.size === "medium" ? _MEDIUMER.join(" ") : _LARGEER.join(" "))};
        font-size: 16px;
    };
`

export const TextButton: FC<IButtonType> = ({ size, bgColor, textColor, hasShadow, disabled, text, onClick, ...props }) => {
    return (
        <BaseButton type="button" onClick={onClick} hasShadow={hasShadow} textColor={textColor} bgColor={bgColor} disabled={disabled} size={size} {...props}>
            {text}
        </BaseButton>
    )
}

export const FilledButton: FC<IButtonType> = ({ size, bgColor, textColor, hasShadow, disabled, text, onClick, ...props }) => {
    return (
        <FilledButtonStyle type="button" onClick={onClick} hasShadow={hasShadow} textColor={textColor} bgColor={bgColor} disabled={disabled} size={size} {...props}>
            {text}
        </FilledButtonStyle>
    )
}

export const OutlinedButton: FC<IButtonType> = ({ size, borderColor, bgColor, textColor, hasShadow, disabled, text, onClick, ...props }) => {
    return (
        <OutlinedButtonStyle type="button" borderColor={borderColor} onClick={onClick} hasShadow={hasShadow} textColor={textColor} bgColor={bgColor} disabled={disabled} size={size} {...props}>
            {text}
        </OutlinedButtonStyle>
    )
}