<script>
    export let type = "primary"; // "primary" | "secondary"
    export let size = "medium"; // "large" | "medium" | "small"
</script>

<button class="{type} {size}">
    <slot />
</button>

<style>
    :root {
        --color-primary: #0096ff;
        --white: #ffffff;
        --black: #000000;
    }

    button {
        cursor: pointer;
        border: 0px;
        border-radius: 5px;
        font-weight: 400;
        color: var(--white);
        transition: 0.3s;
        width: fit-content;
    }

    .primary {
        background-color: var(--color-primary);
    }

    .primary:hover {
        filter: brightness(85%);
    }

    .secondary {
        border: 2px solid var(--color-primary);
        color: var(--color-primary);
    }

    .secondary:hover {
        background-color: var(--color-primary);
        color: var(--white);
    }

    .small {
        padding: 8px 12px;
        font-size: 14px;
    }

    .medium {
        padding: 10px 14px;
        font-size: 16px;
    }

    .large {
        padding: 12px 16px;
        font-size: 18px;
    }
</style>
