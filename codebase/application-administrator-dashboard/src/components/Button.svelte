<script>
    export let isPrimary = true;
    export let onClick = () => {};
    export let classList = "";
</script>

<button
    on:click={onClick}
    class={`${classList} text-white py-2 px-8 rounded ${
        isPrimary ? "bg-primary_color" : "bg-secondary_color"
    }`}
    type="submit"
>
    <slot><!-- optional fallback --></slot>
</button>
