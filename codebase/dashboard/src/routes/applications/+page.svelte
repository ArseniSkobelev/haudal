<script lang="ts">
    import { goto } from "$app/navigation";

    export let data;

    const deleteApp = async (access_token: string) => {
        console.log(`Deleting app ${access_token}\nJWT: ${data.jwt}`);
    };

    import Button from "../../components/Button.svelte";
</script>

<main class="flex flex-col gap-8">
    <div>
        <h1 class="title-two">Your applications</h1>
    </div>
    <div class="flex flex-col gap-6 items-center">
        {#each data.api_keys as application}
            <div class="flex flex-col gap-4 bg-white p-4 rounded w-full">
                <div class="text-xl flex flex-row justify-between items-center">
                    <div>
                        <h2 class="font-medium">
                            {application.app_name}
                        </h2>
                    </div>
                    <div>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <img
                            class="cursor-pointer"
                            src="/images/trash.svg"
                            on:click={() => deleteApp(application.access_token)}
                            alt="Delete"
                        />
                    </div>
                </div>
                <div class="h-[1px] bg-subtle_element_color" />
                <div>
                    <h3 class="text-sm">
                        {application.access_token}
                    </h3>
                </div>
            </div>
        {/each}
        <div>
            <Button onClick={() => goto("/applications/create")}
                >Create application</Button
            >
        </div>
    </div>
</main>

<style>
</style>
