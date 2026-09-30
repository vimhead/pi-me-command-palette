import assert from "node:assert/strict";
import test from "node:test";
import { CURSOR_MARKER, visibleWidth } from "@earendil-works/pi-tui";
import { createFixture } from "./fixture.mjs";
import { CommandPalette, registration as paletteRegistration } from "../extensions/pi-me-command-palette/index.ts";

test("palette query and arguments share focus, obey overlay visibility, and restore the prompt", context => {
  const fixture = createFixture(context);
  const prompt = fixture.createPrompt();
  prompt.setMode("normal");
  const finished = [];
  const palette = new CommandPalette({
    tui: fixture.tui, theme: fixture.theme, keybindings: fixture.keybindings,
    finish: result => finished.push(result), createLineEditor: fixture.api.vim.createLineEditor,
    commands: [{ name: "model", description: "Select model", source: "builtin", argumentHint: "<provider/model>" }],
  });
  context.after(() => palette.dispose());
  assert.equal(prompt.focused, false);
  const query = fixture.runtime.focus.getFocusedEditor();
  palette.focused = false;
  assert.equal(query.focused, false);
  assert.ok(!palette.render(72).join("").includes(CURSOR_MARKER));
  palette.focused = true;
  assert.equal(query.focused, true);
  for (const width of [40, 72, 80]) {
    const lines = palette.render(width);
    assert.ok(lines.length <= 14);
    assert.ok(lines.every(line => visibleWidth(line) <= width));
    assert.ok(lines.at(-1).includes("╰"));
  }
  palette.handleInput("\t");
  const args = fixture.runtime.focus.getFocusedEditor();
  assert.notEqual(query, args);
  assert.equal(query.focused, false);
  palette.handleInput("X");
  assert.equal(args.getText(), "X");
  palette.handleInput("\x1b");
  palette.handleInput("\x1b");
  assert.equal(fixture.runtime.focus.getFocusedEditor(), query);
  palette.handleInput("\x1b");
  palette.handleInput("\x1b");
  assert.deepEqual(finished, [{ cancel: true }]);
  assert.equal(prompt.focused, true);
  assert.equal(prompt.getMode(), "normal");
});

test("palette binding opens one coordinated overlay and preserves the prompt draft on cancel", async context => {
  const fixture = createFixture(context, { registrations: [paletteRegistration] });
  let opened = 0;
  fixture.ctx.ui.addAutocompleteProvider = () => {};
  fixture.ctx.ui.custom = async (create, options) => {
    opened++;
    assert.equal(options.overlay, true);
    let result;
    const overlay = create(fixture.tui, fixture.theme, fixture.keybindings, value => { result = value; });
    overlay.handleInput("\x1b");
    overlay.handleInput("\x1b");
    overlay.dispose();
    return result;
  };
  const prompt = fixture.createPrompt();
  prompt.setText("saved draft");
  for (const key of ["\x1b", " ", " "]) prompt.handleInput(key);
  await Promise.resolve();
  assert.equal(opened, 1);
  assert.equal(prompt.getText(), "saved draft");
  assert.equal(prompt.focused, true);
});


test("plugin registers with the shared vipi-editor runtime API", async () => {
  const { default: registerPlugin, registration } = await import("../extensions/pi-me-command-palette/index.ts");
  const { VIPI_EDITOR_REGISTER } = await import("vipi-editor/api");
  const events = [];
  registerPlugin({ events: { emit: (channel, data) => events.push({ channel, data }), on: () => () => {} } });
  assert.equal(events[0].channel, VIPI_EDITOR_REGISTER);
  assert.equal(events[0].data, registration);
  assert.equal(registration.extensionId, "pi-me-command-palette");
});
