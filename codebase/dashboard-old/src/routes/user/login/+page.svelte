<script>
    import Input from "../../../components/Input.svelte";
    import Button from "../../../components/Button.svelte";

    const handleLogin = (/** @type {any} */ e) => {
        const formData = new FormData(e.target);

        console.log("working");
    };
</script>

<div class="w-full h-full p-16">
    <div class="bg-white h-full flex flex-row rounded">
        <div class="w-1/2 p-32 flex flex-col gap-12">
            <div class="flex flex-col gap-12">
                <h1 class="desktop-title">Login to an existing account</h1>
                <div class="bg-horizontal_line_color h-[1px]" />
            </div>
            <form
                on:submit={handleLogin}
                method="POST"
                action=""
                class="flex flex-col gap-8"
            >
                <div>
                    <Input
                        placeholder="Email"
                        name="email"
                        title="Email"
                        type="email"
                    />
                </div>
                <div>
                    <Input
                        placeholder="***********"
                        name="password"
                        title="Password"
                        type="password"
                    />
                </div>
                <div>
                    <Button classList={"w-full"}>Login</Button>
                </div>
            </form>
            <div class="flex flex-row gap-4 items-center">
                <div class="bg-horizontal_line_color h-[1px] w-full" />
                <span class="text-horizontal_line_color">OR</span>
                <div class="bg-horizontal_line_color h-[1px] w-full" />
            </div>
            <div class="flex justify-center">
                <a href="/user/create">
                    <h1 class="">
                        <i>Create a new account instead</i>
                    </h1>
                </a>
            </div>
        </div>
        <div
            class="w-1/2 rounded"
            style="background-image: url('https://images.pexels.com/photos/841303/pexels-photo-841303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'); background-repeat: no-repeat; background-size: cover"
        />
    </div>
</div>

<style>
</style>
