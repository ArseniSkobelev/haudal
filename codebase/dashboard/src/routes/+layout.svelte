<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";

    let showMobileMenu = false;

    const handleMenu = () => {
        showMobileMenu = !showMobileMenu;
    };

    const navItems = [
        {
            title: "Home",
            path: "/",
            active: false,
            icon: "/images/home",
        },
        {
            title: "Applications",
            path: "/applications",
            active: false,
            icon: "/images/box",
        },
    ];

    const load: Load = () => {
        console.log("test");
    };

    import Link from "../components/Link.svelte";
    import Title from "../components/Title.svelte";
    import Button from "../components/Button.svelte";
    import { goto } from "$app/navigation";
    import type { Load } from "@sveltejs/kit";
</script>

{#if $page.url.pathname === "/login" || $page.url.pathname === "/register"}
    <slot><!-- optional fallback --></slot>
{:else}
    <main class="flex flex-row h-full">
        <div class="hidden w-1/5 h-full xl:block">
            <div
                class="flex flex-col w-full h-full gap-4 bg-nav_bar_color text-subtle_element_color"
            >
                <div
                    class="flex flex-row items-center justify-center gap-4 p-4 text-white xl:p-8"
                >
                    <img
                        src="/images/haudal-logo.svg"
                        width="32px"
                        height="32px"
                        alt="LOGO"
                    />
                    <h1 class="title">Haudal</h1>
                </div>
                <div class="flex flex-col p-4">
                    {#each navItems as link}
                        <Link
                            title={link.title}
                            href={link.path}
                            icon={link.icon}
                        />
                    {/each}
                </div>
                <div class="flex flex-col p-4 mt-auto">
                    <Button onClick={() => goto("/logout")} isPrimary={true}
                        >Logout</Button
                    >
                </div>
            </div>
        </div>
        <div class="w-full">
            <div
                class="flex flex-row items-center justify-between gap-2 p-4 xl:p-8"
            >
                <div>
                    <h1 class="title"><Title /></h1>
                </div>
                <div class="flex items-center xl:hidden">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <img
                        src={showMobileMenu
                            ? `/images/close.svg`
                            : "/images/menu.svg"}
                        alt="Menu"
                        on:click={handleMenu}
                        class="cursor-pointer"
                    />
                </div>
            </div>

            <div class="h-[1px] bg-subtle_element_color" />

            {#if showMobileMenu == true}
                <div class="bg-nav_bar_color">
                    <ul class="flex flex-col">
                        {#each navItems as link}
                            <Link
                                title={link.title}
                                href={link.path}
                                icon={link.icon}
                            />
                        {/each}
                        <ul />
                        <Button onClick={() => goto("/logout")} isPrimary={true}
                            >Logout</Button
                        >
                    </ul>
                </div>
            {/if}
            <div>
                <div class="flex flex-col p-4 xl:p-8">
                    <slot><!-- optional fallback --></slot>
                </div>
            </div>
        </div>
    </main>
{/if}

<style>
</style>
