<script>
    export let placeholder = "placeholder";
    export let size = "medium";
    export let title = "Title";
    export let type = "text";
    export let error = false;
    export let message = "Invalid input provided";
    export let name = "input";
    export let id = "";
</script>

<div class="flex gap-3 flex-col {size}" class:error>
    <label for={name} class:error>{title}</label>
    <input class:error {type} {name} {id} {placeholder} />
    {#if error}
        <p class="error-message">{message}</p>
    {/if}
</div>

<style>
    :root {
        --grey: #9a9a9a;
        --color-primary: #0096ff;
        --color-danger: #e75838;
    }

    label {
        font-size: 16px;
    }

    input {
        outline: 1px solid var(--grey);
        border-radius: 5px;
        padding: 15px;
        transition: 0.3s;
    }

    input:focus {
        box-shadow: 0px 0px 5px 2px var(--color-primary);
        outline: 2px solid var(--color-primary);
        -webkit-box-shadow: 0px 0px 5px 2px var(--color-primary);
        -moz-box-shadow: 0px 0px 5px 2px var(--color-primary);
    }

    .large {
        width: 500px;
    }

    .medium {
        width: 300px;
    }

    .small {
        width: 150px;
    }

    .error-message {
        font-size: 12px;
    }

    .error {
        color: var(--color-danger);
    }

    input.error {
        outline: 1px solid var(--color-danger);
    }

    input.error:focus {
        box-shadow: 0px 0px 5px 2px var(--color-danger);
        outline: 2px solid var(--color-danger);
        -webkit-box-shadow: 0px 0px 5px 2px var(--color-danger);
        -moz-box-shadow: 0px 0px 5px 2px var(--color-danger);
    }

    input.error::placeholder {
        color: var(--color-danger);
    }
</style>
