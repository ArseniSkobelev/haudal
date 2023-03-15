<script lang="ts">
    import { goto } from "$app/navigation";

    import Button from "../../../components/Button.svelte";

    let applicationName: string;

    const createApplication = async () => {
        if (applicationName) {
            let apiResponse = await fetch("/api/v1/applications", {
                method: "POST",
                body: JSON.stringify({
                    app_name: applicationName,
                }),
            });

            const apiResponseJson = await apiResponse.json();

            if (apiResponseJson.status == 201) {
                return goto("/applications");
            }
        }
    };
</script>

<main
    class="flex flex-col h-full p-8 gap-8 lg:justify-center lg:items-center w-full"
>
    <div class="mb-auto flex flex-col w-full lg:w-1/2 xl:w-1/3">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="flex flex-row gap-4 cursor-pointer"
            on:click={() => goto("/applications")}
        >
            <img src="/images/back.svg" alt="back-arrow" />
            <h1>Go back</h1>
        </div>
    </div>
    <div
        class="flex flex-col h-full gap-8 w-full lg:justify-center lg:items-center lg:w-1/2 xl:w-1/3"
    >
        <div class="w-full">
            <h1 class="title-two">Create a new application</h1>
        </div>
        <div class="w-full">
            <div class="flex flex-col gap-2">
                <label for="applicationName">Application name</label>
                <input
                    type="text"
                    name="applicationName"
                    placeholder="New application name"
                    class="p-2 border border-solid rounded border-horizontal_line_color"
                    bind:value={applicationName}
                />
            </div>
        </div>
        <div class="w-full">
            <Button
                onClick={() => createApplication()}
                isPrimary={false}
                classList={"w-full"}>Create application</Button
            >
        </div>
    </div>
</main>
