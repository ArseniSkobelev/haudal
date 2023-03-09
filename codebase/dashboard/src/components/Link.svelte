<script lang="ts">
    import { page } from "$app/stores";
    export let href: string = "";
    export let icon: string = "/images/home.svg";
    export let title: string = "Navigation";

    $: active = $page.url.pathname === href;
</script>

<a {href} class:active class="flex flex-row items-center gap-2 m-4">
    <img src={`${active ? `${icon}-active.svg` : `${icon}.svg`}`} alt="" />
    <li class="list-none">{title}</li>
</a>

<style>
    a.active {
        color: #59b1ee;
    }

    a {
        color: #d9d9d9;
    }
</style>
