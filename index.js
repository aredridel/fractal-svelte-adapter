"use strict";

require("svelte/register")({
  preserveComments: true,
  hydratable: true,
  generate: "ssr",
  customElement: false
});

{
  const hljs = require("highlight.js");
  const javascript = require("highlight.js/lib/languages/javascript");
  hljs.registerLanguage("text", javascript);
}

const Adapter = require("@frctl/fractal").Adapter;

class SvelteAdapter extends Adapter {
  /**
   * @param {any} source
   * @param {any} [app]
   */
  constructor(source, app) {
    super(null, source);
    this.app = app;
  }

  /**
   * @param {string} path
   * @param {any} _str
   * @param {object} context
   * @param {object} meta
   */
  async render(path, _str, context, meta) {
    delete require.cache[path];
    const component = require(path).default;
    const wrapper = require("./wrapper.svelte").default;
    const { html, css } = wrapper.render({
      app: this.app,
      env: meta.env,
      component,
      context
    });
    meta.env.heads = meta.env.heads || [];
    meta.env.heads.push(css);
    return html;
  }

  /**
   * @param {string} path
   * @param {string} _str
   * @param {object} context
   * @param {object} meta
   */
  async renderLayout(path, _str, context, meta) {
    delete require.cache[path];
    const component = require(path).default;
    const wrapper = require("./wrapper.svelte").default;
    const { html, head, css } = wrapper.render({
      app: this.app,
      env: meta.env,
      component,
      context,
      html: context.yield
    });

    return `<!doctype html>
      <html>
        <head>
          ${head || ""}
          <style>${css.code}${meta.env.heads.map(e => e.code).join("\n")}</style>
        </head>
        ${html}
      </html>
    `;
  }
}

/**
 * @param {object?} _config;
 */
module.exports = function(_config) {
  _config = _config || {}; // not doing anything with config right now!

  return {
    /**
     * @param {string} source
     * @param {object} app
     */
    register(source, app) {
      return new SvelteAdapter(source, app);
    }
  };
};
