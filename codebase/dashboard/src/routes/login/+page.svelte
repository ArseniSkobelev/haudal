<script>
    import Input from "../../components/Input.svelte";
    import Button from "../../components/Button.svelte";
</script>

<!-- <main class="flex flex-row w-full h-full p-8">
    <div class="flex flex-col w-full h-full gap-8 p-8 bg-white rounded">
        <h1 class="title">Login into an existing account</h1>
        <div class="flex flex-col gap-4">
            <Input
                title="Email"
                placeholder="john.doe@gmail.com"
                type="email"
            />
            <Input title="Password" placeholder="***********" type="password" />
        </div>
    </div>
    <div
        class="w-full h-full bg-no-repeat bg-cover rounded-r bg-login_screen"
    />
</main> -->
<main class="flex flex-row w-full h-full p-8">
    <div class="flex flex-col w-full h-full gap-8 p-8 bg-white rounded">
        <h1 class="title-two">Login into an existing account</h1>
        <div class="h-[1px] bg-subtle_element_color" />
        <div class="flex flex-col gap-8">
            <Input
                title="Email"
                placeholder="john.doe@gmail.com"
                type="email"
            />
            <Input title="Password" placeholder="***********" type="password" />
        </div>
        <div class="flex flex-col">
            <Button isPrimary={false}>Login</Button>
        </div>
        <div class="flex flex-row items-center w-full gap-2">
            <div class="h-[1px] w-full bg-subtle_element_color" />
            <div><span class="text-subtle_element_color">OR</span></div>
            <div class="h-[1px] w-full bg-subtle_element_color" />
        </div>
        <div class="flex items-center justify-center">
            <a href="/register" class="text-center">
                <h1>Click here to create a new account instead</h1>
            </a>
        </div>
    </div>
</main>
