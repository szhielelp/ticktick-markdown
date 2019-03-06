// TODO: add styles, add hotkeys


// ==UserScript==
// @name         TickTickMarkdown
// @namespace    https://develcraft.com/
// @version      0.3
// @description  Add markdown support to TickTick
// @author       szhshp
// @match        https://dida365.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// @run-at       document-body
// ==/UserScript==

(function () {
  'use strict';

  // CSS
  const css = `
.editor-toggle {
padding-left: 10px;
}
.editor-toggle a {
color: #333;
}
.rendered-markdown {
padding-bottom: 2em;
}
.rendered-markdown * {
line-height: 1.6;
-moz-user-select: text;
-webkit-user-select: text;
}
.rendered-markdown li, .rendered-markdown ol, .rendered-markdown ul {
list-style: disc;
}
.rendered-markdown ol, .rendered-markdown ul {
padding-left: 2em;
}
.rendered-markdown li p {
padding: 0
}
.rendered-markdown code {
color: blue;
}
.rendered-markdown blockquote {
border-left: grey solid 5px;
padding-left: 1rem;
margin-inline-start: 1rem;
background: lightgrey;
}
.rendered-markdown p {
padding-top: 0.5em;
padding-bottom: 0.5em;
}
.rendered-markdown h3, .rendered-markdown h4, .rendered-markdown h5, .rendered-markdown h6 {
color: #000;
line-height: 1.8;
}
.rendered-markdown pre {
font-family: monospace;
border: 1px solid #ddd;
background-color: #f4f4f4;
padding: 0.5em;
overflow: auto;
}
@media screen and (min-width: 800px) {
div.g-center {
right: 46%;
}
div#right-view {
width: 46%;
font-size: 60%!important;
}
}
.priority-low:not(.checked) {
background: #17ffa433;
}
.priority-medium:not(.checked) {
background: #ffc81752;
}
.priority-high:not(.checked) {
background: #f144543b;
}
.task.selected {
border: 2px solid grey;
}
.task.active, .task.selected:hover {
border: 1px solid grey;
}
#md-btn {
  z-index: 1000;
  border-radius: 5px;
  padding: 2px;
}
`;
  GM_addStyle(css);

  // Make sure jquery isn't conflicting with anything
  const jq = $.noConflict();

  // Initialize showdown (markdown renderer)
  // Docs: https://github.com/showdownjs/showdown/wiki/Showdown-options
  const converter = new showdown.Converter({
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    tables: true,
    strikethrough: true,
    ghCodeBlocks: true,
    tasklists: true,
    disableForced4SpacesIndentedSublists: true,
    simpleLineBreaks: true,
    noHeaderId: true,
    headerLevelStart: 3,
  });

  const addMarkdownToggle = () => {
    jq('#td-md').remove()
    jq('#td-caption').after(`
    <div id="td-md">
      <button id="md-btn" class="btn-sml line-right" data-mode="edit">Preview</button>
    </div>
    `);

  }


  addMarkdownToggle();
  jq('body').on('click', '#md-btn', e => {
    let md_mode = jq(e.target).data('mode');
    let md_editor = jq('#taskcontent .MDEditor');
    let md_previewer = jq('#taskcontent .MDPreview');

    if (md_mode == 'edit') {
      /* change to preview mode */
      let md_text = jq('.CodeMirror-line').map((i, e) => jq(e).text()).toArray().join('\r\n');
      let md_html = converter.makeHtml(md_text);

      md_editor.hide();
      md_previewer.show()

      if (md_previewer.length > 0) {
        md_previewer.html(md_html);
      } else {
        md_editor.after(`<div class="MDPreview"></div>`);
        md_previewer = jq('#taskcontent .MDPreview');
        md_previewer.html(md_html)
      }

      jq(e.target).data('mode', 'preview');
      jq(e.target).html('Edit')
    } else {
      /* change to edit mode */
      md_editor.show();
      md_previewer.hide()

      jq(e.target).data('mode', 'edit');
      jq(e.target).html('Preview')
    }

  })

  // if change to another task
  jq('body').on('click', '.l-task', e => {
    jq('.MDPreview').hide();
    jq('.MDEditor').show();
    addMarkdownToggle();
  })

  jq(document).on('keydown', null, 'f4', e => {
    jq('#md-btn').trigger('click');
  });




})();
