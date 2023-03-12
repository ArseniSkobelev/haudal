<script lang="ts">
    export let message: string = "Temporary error message";
    export let onClick = () => {};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="flex flex-row items-center justify-between gap-4 px-4 py-2 rounded bg-alert_error"
>
    <span class="text-sm text-left text-white">{message}</span>
    <img src="/images/close-white.svg" on:click={onClick} alt="close" />
</div>
