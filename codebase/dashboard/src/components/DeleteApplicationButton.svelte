<script>
    export let api_key = "";

    const deleteApplication = (/** @type {String} */ key) => {
        console.log(`deleting ${key}`);
    };
</script>

<img
    on:click={() => deleteApplication(api_key)}
    src="/images/trash.svg"
    class="w-8 h-8"
    alt="Trash icon"
/>
