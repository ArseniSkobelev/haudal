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
        <div class="">
            <Button
                classList={"w-full text-sm px-2 lg:text-lg lg:px-8"}
                onClick={() => goto("/applications/create")}
                >Create application</Button
            >
        </div>
    </div>
    <div
        class="flex flex-col gap-6 items-center overflow-y-auto lg:max-h-[500px]"
    >
        {#if data.api_keys.length > 0}
            {#each data.api_keys as application}
                <div class="flex flex-col gap-4 bg-white p-4 rounded w-full">
                    <div
                        class="text-xl flex flex-row justify-between items-center"
                    >
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
                                on:click={() =>
                                    deleteApp(application.access_token)}
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
        {:else}
            <div class="flex flex-col w-full justify-center items-center mt-4">
                <h2>You have no applications yet.</h2>
            </div>
        {/if}
    </div>
</main>

<style>
</style>
