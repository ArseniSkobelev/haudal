<script>
    let showMobileMenu = false;

    const handleMenu = () => {
        showMobileMenu = !showMobileMenu;
    };

    const navItems = [
        { title: "Home", path: "/", active: true, icon: "/images/home" },
        {
            title: "Applications",
            path: "/applications",
            active: false,
            icon: "/images/box",
        },
    ];

    import NavLink from "../components/NavLink.svelte";
    import Button from "../components/Button.svelte";
</script>

<main class="flex flex-col gap-4 h-full">
    <header class="flex flex-row w-full h-full">
        <div
            class="sidebar w-64 px-4 flex items-center flex-col gap-4 bg-nav_bg_color py-8 h-full"
        >
            <div class="logo">
                <h1 class="desktop-title text-white">Haudal</h1>
            </div>
            <div class="bg-horizontal_line_color h-[1px] w-full" />
            <div class="links flex flex-col gap-4">
                {#each navItems as link}
                    <NavLink
                        title={link.title}
                        path={link.path}
                        active={link.active}
                        icon={link.icon}
                    />
                {/each}
            </div>
            <div class="mt-auto">
                <Button>Logout</Button>
            </div>
        </div>
        <div class="flex flex-col w-full h-full">
            <div class="flex flex-col justify-between w-full px-8 pt-8 h-24">
                <h2 class="desktop-secondary-title">Dashboard</h2>
                <div class="bg-horizontal_line_color h-[1px] mt-auto w-full" />
            </div>
            <div class="flex p-8 h-full">
                <div class="p-8 bg-white h-full w-full" />
            </div>
        </div>
    </header>
</main>

<style>
</style>
