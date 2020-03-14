# fractal-svelte-adapter

Allows the use of [svelte](https://svelte.dev) components as templates in a
[fractal](https://fractal.build) 1.x styleguide.

## Use

In your `fractal.js` configuration:

```javascript
fractal.components.engine("@aredridel/fractal-svelte-adapter");
fractal.components.set("ext", ".svelte");
```

## Fractal concepts

The connection between how Fractal conceives of templates and how Svelte thinks
of the world in components has some small friction for which this library
provides some workarounds.

### Context data & properties

Context data from the styleguide is passed to components as properties.

A `component.config.json` such as this

```json
{
  "context": {
    "text": "Hello, World"
  }
}
```

Informs a `component.svelte` such as this:

```svelte
<script>
  export let text;
</script>

<h2>{text}</h2>
```

Will render `<h2>Hello, World</h2>`.

### Asset Helper

For static generation, knowing the root path is important for generating links
to assets properly.

As we can't use a handlebars helper such as `{{ path "filename" }}`, a similar
tool is injected into the Svelte context. To use it, fetch it from the context:

```svelte
<script>
  import { getContext } from "svelte";
  const { assetPath } = getContext("fractal");
</script>

<img src={assetPath("/assets/some-image.png")} />
```

Assuming you've configured `public/` as your static assets path with
`fractal.web.set("static.path", __dirname + "/public");`, this will link to the
asset in `public/assets/some-image.png`.

### Layout Template & Generated HTML

The overall HTML output is wrapped in an `<html>` element with an html5 doctype.

Layouts are handled as svelte components, which provide a `<body>`:

`layout.svelte`:

```svelte
<script>
  import SomeComponent from "./some-component.svelte";
  import { getContext } from "svelte";
  const { assetPath } = getContext("fractal");
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href={assetPath("/css/app.css")} />
  <script defer type="module" src={assetPath("/js/app.js")}></script>
  <title>Preview</title>
</svelte:head>

<body>
  <SomeComponent />

  <p>Lorem ipsum dolor sit amet miss Bacon sic amundiam</p>
  <slot />
  <p>Lorem ipsum dolor sit amet miss Bacon sic amundiam</p>

</body>
```

The component being previewed is inserted into the default slot in the component.
