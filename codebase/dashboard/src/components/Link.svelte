<script lang="ts">
    import { page } from "$app/stores";
    export let href: string = "";
    export let icon: string = "/images/home.svg";
    export let title: string = "Navigation";

    import MenuState from "../lib/stores/MenuStore";

    $: active = $page.url.pathname === href;
</script>

<a
    {href}
    on:click={() => ($MenuState = false)}
    class:active
    class="flex flex-row items-center gap-4 m-4"
>
    <img
        class="w-6 h-6 2xl:w-8 2xl:h-8"
        src={`${active ? `${icon}-active.svg` : `${icon}.svg`}`}
        alt=""
    />
    <li class="list-none 2xl:text-lg">{title}</li>
</a>

<style>
    a.active {
        color: #59b1ee;
    }

    a {
        color: #d9d9d9;
    }
</style>
