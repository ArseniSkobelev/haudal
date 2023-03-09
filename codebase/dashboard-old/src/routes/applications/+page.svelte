<script>
    let showMobileMenu = false;

    const handleMenu = () => {
        showMobileMenu = !showMobileMenu;
    };

    const navItems = [
        { title: "Home", path: "/", active: false, icon: "/images/home" },
        {
            title: "Applications",
            path: "/applications",
            active: true,
            icon: "/images/box",
        },
    ];

    const createApp = () => {
        console.log("creating app..");
    };

    const applications = [
        {
            id: 1,
            name: "Very good application",
            api_key: "76706531-dd5c-49c5-98c2-0d88f68ab4ce",
        },
        {
            id: 2,
            name: "Perfect application",
            api_key: "76706531-dd5c-49c5-98c2-0d88f68ab4ce",
        },
        {
            id: 3,
            name: "Maybe working application",
            api_key: "76706531-dd5c-49c5-98c2-0d88f68ab4ce",
        },
        {
            id: 4,
            name: "Very fake application",
            api_key: "76706531-dd5c-49c5-98c2-0d88f68ab4ce",
        },
    ];

    import NavLink from "../../components/NavLink.svelte";
    import Button from "../../components/Button.svelte";
    import DeleteApplicationButton from "../../components/DeleteApplicationButton.svelte";
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
                <h2 class="desktop-secondary-title">Applications</h2>
                <div class="bg-horizontal_line_color h-[1px] mt-auto w-full" />
            </div>
            <div class="flex p-8 h-full">
                <div class="p-8 flex flex-col bg-white h-full w-full gap-8">
                    <div class="flex flex-row justify-between">
                        <h1 class="desktop-secondary-title">
                            Your applications
                        </h1>
                        <Button onClick={createApp} isPrimary={false}
                            >Create app</Button
                        >
                    </div>
                    <div>
                        <table class="styled-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>API key</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each applications as application}
                                    <tr>
                                        <td>{application.id}</td>
                                        <td>{application.name}</td>
                                        <td>{application.api_key}</td>
                                        <td
                                            ><DeleteApplicationButton
                                                api_key={application.api_key}
                                            /></td
                                        >
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </header>
</main>

<style>
    .styled-table {
        width: 100%;
    }

    .styled-table thead tr th {
        text-align: left;
        font-weight: lighter;
    }

    .styled-table thead {
        border-bottom: thin solid #d9d9d9;
    }

    .styled-table th,
    .styled-table td {
        padding: 12px 15px;
    }

    .styled-table tbody tr {
        border-bottom: 1px solid #dddddd;
        font-weight: lighter;
    }

    .styled-table tbody tr:nth-of-type(even) {
        background-color: #d9d9d9;
    }
</style>
