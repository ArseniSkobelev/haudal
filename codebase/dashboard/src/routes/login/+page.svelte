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
    <section class="flex flex-col w-full h-full gap-8 p-8 bg-white rounded">
        <h1 class="title-two">Login into an existing account</h1>
        <div class="h-[1px] bg-subtle_element_color" />
        <form method="POST" use:enhance>
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-8">
                    {#if showError}
                        {#if form?.error}
                            <Error message={form.error} onClick={toggleError} />
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
                    <Button isPrimary={false} onClick={toggleError}
                        >Login</Button
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
            <a href="/register" class="text-center">
                <h1>Click here to create an account instead</h1>
            </a>
        </div>
    </section>
</main>
