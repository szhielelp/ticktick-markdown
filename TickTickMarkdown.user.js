// ==UserScript==
// @name         TickTickMarkdown
// @namespace    https://develcraft.com/
// @version      0.2
// @description  Add markdown support to TickTick
// @author       szhshp
// @match        https://dida365.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// @run-at       document-body
// ==/UserScript==

(function() {
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

        .rendered-markdown li,
        .rendered-markdown ol,
        .rendered-markdown ul {
            list-style: disc;
        }

        .rendered-markdown ol,
        .rendered-markdown ul {
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

        .rendered-markdown h3,
        .rendered-markdown h4,
        .rendered-markdown h5,
        .rendered-markdown h6 {
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
          div#center-view {
            right: 46%;
          }

          div#right-view {
            width: 46%;
            font-size: 60%!important;
          }
        }

        .priority-low:not(.checked)  {
            background: #17ffa433;
        }

        .priority-medium:not(.checked)  {
            background: #ffc81752;
        }

        .priority-high:not(.checked)  {
            background: #f144543b;
        }

        .task.selected {
            border: 2px solid grey;
        }

        .task.active, .task.selected:hover {
            border: 1px solid grey;
        }
    `;
    GM_addStyle(css);

    // Make sure jquery isn't conflicting with anything
    const jq = $.noConflict();

    // console.log('Hello, I\'m TickTickMarkdown!');
    // console.log('This is Showdown:', showdown);
    // console.log('This is jQuery:', jq);

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

    // Select the node that will be observed for mutations
    const targetNode = jq('body').get(0);

    // Options for the observer (which mutations to observe)
    const observerConfig = { childList: true, subtree: true };

    const func_ToggleEdit = function(){

    }

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList) {
        for(const mutation of mutationsList) {
            const taskContentNode = jq('#taskcontent');
            var renderedMarkdownNode = jq('.rendered-markdown', taskContentNode);
            const editorNode = jq('.editor-with-link', taskContentNode);
            const toolbarNode = jq('#td-caption');
            var editorToggleNode = jq('.editor-toggle', toolbarNode);

            // Add the rendered markdown
            if (editorNode.get(0) !== undefined && renderedMarkdownNode.get(0) === undefined) {
                // Hide the editor
                editorNode.hide();

                // Show the rendered markdown node
                const text = editorNode.text();
                const html = converter.makeHtml(text);
                renderedMarkdownNode = jq(jq.parseHTML('<div class="rendered-markdown"></div>'));
                renderedMarkdownNode.html(html);
                taskContentNode.append(renderedMarkdownNode);
            }

            // Render the editor-toggle button and register the click event
            if (editorNode.get(0) !== undefined && editorToggleNode.get(0) === undefined) {
                editorToggleNode = jq(jq.parseHTML('<div class="editor-toggle line-right"><a>&#x1f589;</a></div>'));
                toolbarNode.prepend(editorToggleNode);

                jq(document).on('keydown', null, 'f4',function(e) {
                    const editorNode = jq('.editor-with-link', taskContentNode);
                    const renderedMarkdownNode = jq('.rendered-markdown', taskContentNode);
                    if (editorNode.is(':visible')) {
                        editorNode.hide();
                        renderedMarkdownNode.show();
                        jq('a', editorToggleNode).html('&#x1f589;'); // Unicode Character 'LOWER LEFT PENCIL' (U+1F589)

                        // Remove the rendered markdown node to trigger its update
                        renderedMarkdownNode.remove();
                    } else {
                        editorNode.show();
                        renderedMarkdownNode.hide();
                        jq('a', editorToggleNode).html('&#x1f441;'); // Unicode Character 'EYE' (U+1F441)
                    }
                });
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, observerConfig);

    // Later, you can stop observing
    //observer.disconnect();


})();
