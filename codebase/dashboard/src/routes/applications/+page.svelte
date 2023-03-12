<script lang="ts">
    import { goto, invalidate } from "$app/navigation";

    export let data;

    const deleteApp = async (access_token: string) => {
        let apiResponse = await fetch("/api/v1/applications", {
            method: "DELETE",
            body: JSON.stringify({
                access_token: access_token,
            }),
        });

        const apiResponseJson = await apiResponse.json();

        if (apiResponseJson.status == 200) {
            invalidate(() => true);
        } else {
            console.log("SEND ALERT TO FRONTEND");
        }
    };

    import Button from "../../components/Button.svelte";
</script>

<main class="flex flex-col gap-8">
    <div class="flex flex-row justify-between">
        <h1 class="title-two">Your applications</h1>
        <div class="hidden xl:block">
            <Button
                classList={"w-full"}
                onClick={() => goto("/applications/create")}
                >Create application</Button
            >
        </div>
    </div>
    <div
        class="flex flex-col gap-6 items-center overflow-y-auto lg:max-h-[500px]"
    >
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
    </div>
    <div>
        <Button
            classList={"w-full xl:hidden"}
            onClick={() => goto("/applications/create")}
            >Create application</Button
        >
    </div>
</main>

<style>
</style>
