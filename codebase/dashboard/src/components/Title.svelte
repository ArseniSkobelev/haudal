<script lang="ts">
    import { page } from "$app/stores";

    let name = "Dashboard";
    $: path = $page.url.pathname;

    const getName = (string: string) => {
        string = string.split("/")[1];
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
</script>

<h1>{path == "/" ? "Dashboard" : getName(path)}</h1>
