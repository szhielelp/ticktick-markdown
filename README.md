# TickTickMarkdown

>实现滴答清单的 Markdown 支持的 Tampermonkey 插件

Thanks to: [dankeder/ticktick-markdown](https://github.com/dankeder/ticktick-markdown/blob/master/TickTickMarkdown.user.js)

## URL Match Pattern

对于国际版, 请将 `@match` 地址改成 `https://ticktick.com/*`

## How to use

1. Install the [Tampermonkey](http://tampermonkey.net/) browser add-on.

2. Add the script `TickTickMarkdown.user.js` to Tampermonkey.

### Hotkey

Press F4 to toggle Edit/Preview mode.

## How to use dev-mode script

The dev-mode script is useful when developing the script - the actual script is
loaded from the local disk using a `file://` URL.

Note that you need to enable `file://` URLs in the Advanced settings in
Tampermonkey and adjust the `file://` URL.

## Licence

MIT
