<script>
  import { setContext } from "svelte";
  import * as utils from "@frctl/fractal/src/core/utils.js";
  export let app;
  export let env;
  export let component;
  export let context;
  export let html = null;

  /**
   * @param {string} path
   */
  function assetPath(path) {
    return env.server
      ? path
      : utils.relUrlPath(
          path,
          env.request.path || "/",
          app.web.get("builder.urls")
        );
  }

  setContext("fractal", { assetPath });
</script>

{#if html}
  <svelte:component this={component} {...context}>
    {@html html}
  </svelte:component>
{:else}
  <svelte:component this={component} {...context} />
{/if}
