<script>
    export let placeholder = "Input text here";
    export let title = "Title";
    export let type = "text";
    export let name = "input";
</script>

<div class="flex flex-col gap-2">
    <label for={name}>{title}</label>
    <input
        {type}
        {name}
        {placeholder}
        class="p-2 border border-solid rounded border-horizontal_line_color"
    />
</div>
