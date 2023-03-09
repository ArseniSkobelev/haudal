<script>
    export let title = "Navigation link";
    export let classList = "w-full py-4 flex";
    export let path = "/";
    export let active = false;
    export let icon = "/images/home";
</script>

<li class="list-none">
    <a
        href={path}
        class={`${classList} ${
            active ? "text-primary_color" : "text-nav_link_color"
        }`}
    >
        <div class="flex flex-row gap-4 items-center">
            <div>
                <img
                    src={`${active ? `${icon}-active.svg` : `${icon}.svg`}`}
                    alt="icon"
                />
            </div>
            <h2 class="text-sm font-medium">{title}</h2>
        </div>
    </a>
</li>

<style>
</style>
