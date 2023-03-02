<script>
    let logo = "/logo.svg";
</script>

<div class="flex flex-row w-full h-full">
    <div class="sidebar">
        <div
            class="logo-container flex gap-4 justify-center flex-row items-center"
        >
            <img src={logo} alt="" />
            <h2 class="text-xl">Haudal</h2>
        </div>
        <h1>SIDEBAR</h1>
    </div>
    <div class="flex flex-col w-full h-full">
        <div class="topbar">
            <h1>TOP BAR</h1>
        </div>
        <div class="content h-full">
            <slot />
        </div>
    </div>
</div>

<style>
    :root {
        --color-grey: #eeeeee;
        --black: #000000;
    }

    .content {
        background-color: var(--color-grey);
        padding: 20px;
    }

    .sidebar {
        width: 350px;
    }

    .topbar {
        min-height: 75px;
    }

    .logo-container {
        width: 100%;
        box-shadow: -2px -2px 5px 0 var(--black);
        height: 75px;
    }
</style>
