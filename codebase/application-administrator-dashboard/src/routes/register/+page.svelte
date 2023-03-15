<script lang="ts">
    import Input from "../../components/Input.svelte";
    import Button from "../../components/Button.svelte";
    import Error from "../../components/Error.svelte";
    import { enhance } from "$app/forms";

    $: showError = false;

    import type { ActionData } from "./$types";
    export let form: ActionData;

    const toggleError = async () => {
        showError = !showError;
    };
</script>

<main class="flex flex-row w-full h-full p-8">
    <section class="flex flex-row w-full h-full gap-8 bg-white rounded">
        <div
            class="flex flex-col w-full xl:w-1/2 h-full gap-8 p-16 2xl:px-48 justify-center bg-white rounded"
        >
            <h1 class="title-two">Create a new account</h1>
            <div class="h-[1px] bg-subtle_element_color" />
            <form method="POST" use:enhance>
                <div class="flex flex-col gap-8">
                    <div class="flex flex-col gap-8">
                        {#if showError}
                            {#if form?.error}
                                <Error
                                    message={form.error}
                                    onClick={toggleError}
                                />
                            {/if}
                        {/if}
                        <Input
                            title="Email"
                            placeholder="john.doe@gmail.com"
                            type="email"
                            name="email"
                        />
                        <Input
                            title="Password"
                            placeholder="***********"
                            type="password"
                            name="password"
                        />
                    </div>
                    <div class="flex flex-col">
                        <Button isPrimary={true} onClick={toggleError}
                            >Create a new account</Button
                        >
                    </div>
                </div>
            </form>
            <div class="flex flex-row items-center w-full gap-2">
                <div class="h-[1px] w-full bg-subtle_element_color" />
                <div><span class="text-subtle_element_color">OR</span></div>
                <div class="h-[1px] w-full bg-subtle_element_color" />
            </div>
            <div class="flex items-center justify-center">
                <a href="/login" class="text-center">
                    <h1>Login into an existing account instead</h1>
                </a>
            </div>
        </div>
        <div
            class="hidden xl:block xl:w-1/2 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 rounded-r"
        />
    </section>
</main>
