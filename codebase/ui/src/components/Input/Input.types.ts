export interface IInputType {
    label?: string;
    placeholder?: string;
    type?: "text" | "password" | "email"
    error?: boolean;
    size?: "small" | "medium" | "large"

}