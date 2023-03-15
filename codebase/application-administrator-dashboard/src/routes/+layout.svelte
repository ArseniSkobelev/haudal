<script lang="ts">
    let showMobileMenu = false;

    import MenuState from "../lib/stores/MenuStore";

    MenuState.subscribe((data) => {
        showMobileMenu = data;
    });
    import "../app.css";
    import { page } from "$app/stores";

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

    const handleLogout = () => {
        $MenuState = false;
        goto("/logout");
    };

    import Link from "../components/Link.svelte";
    import Title from "../components/Title.svelte";
    import Button from "../components/Button.svelte";
    import { goto } from "$app/navigation";

    const handleMenu = () => {
        MenuState.update((data) => {
            return !showMobileMenu;
        });
    };
</script>

{#if $page.url.pathname === "/login" || $page.url.pathname === "/register" || $page.url.pathname === "/applications/create"}
    <slot><!-- optional fallback --></slot>
{:else}
    <main class="flex flex-row h-full">
        <div class="hidden w-1/5 h-full xl:block">
            <div
                class="flex flex-col w-full h-full gap-4 bg-nav_bar_color text-subtle_element_color"
            >
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    class="flex flex-row items-center justify-center gap-4 p-4 cursor-pointer text-white xl:p-8 cur"
                    on:click={() => goto("/")}
                >
                    <img
                        src="/images/haudal-logo.svg"
                        class="w-8 h-8 2xl:w-12 2xl:h-12"
                        alt="LOGO"
                    />
                    <h1 class="title">Haudal</h1>
                </div>
                <div class="flex flex-col p-4 xl:px-10 gap-4">
                    {#each navItems as link}
                        <Link
                            title={link.title}
                            href={link.path}
                            icon={link.icon}
                        />
                    {/each}
                </div>
                <div class="flex flex-col p-8 mt-auto">
                    <Button onClick={() => handleLogout()} isPrimary={true}
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

            {#if showMobileMenu}
                <div class="bg-nav_bar_color px-8 pt-8">
                    <ul class="flex flex-col mb-8">
                        {#each navItems as link}
                            <Link
                                title={link.title}
                                href={link.path}
                                icon={link.icon}
                            />
                        {/each}
                    </ul>
                    <Button
                        classList={"w-full mb-8"}
                        onClick={() => handleLogout()}
                        isPrimary={true}>Logout</Button
                    >
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
