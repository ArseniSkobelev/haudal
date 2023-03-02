<script>
    import Button from "../components/Button.svelte";
    import Input from "../components/Input.svelte";
    import Navigation from "../components/Navigation.svelte";
</script>

<Navigation>
    <Button type="primary" size="large">Create new task</Button>
    <Button type="primary" size="medium">Create new task</Button>
    <Button type="primary" size="small">Create new task</Button>

    <Input
        size="large"
        type="email"
        placeholder="jonh.doe@gmail.com"
        title="Email"
    />
    <Input
        size="medium"
        type="password"
        placeholder="***********"
        title="Password"
    />
    <Input size="small" type="text" title="First name" placeholder="John" />
</Navigation>
