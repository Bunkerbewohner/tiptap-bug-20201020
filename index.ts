import {generateHTML, generateJSON} from "@tiptap/html";
import {TiptapTransformer} from "@hocuspocus/transformer";
import Y, {Doc, encodeStateAsUpdate} from 'yjs';
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import {TableRow} from "@tiptap/extension-table-row";
import {TableHeader} from "@tiptap/extension-table-header";
import {TableCell} from "@tiptap/extension-table-cell";
import Link from "@tiptap/extension-link";
import {Blockquote} from "@tiptap/extension-blockquote";
import {CodeBlock} from "@tiptap/extension-code-block";
import {BulletList} from "@tiptap/extension-bullet-list";
import {HardBreak} from "@tiptap/extension-hard-break";
import {Document} from "@tiptap/extension-document";
import {Heading} from "@tiptap/extension-heading";
import {HorizontalRule} from "@tiptap/extension-horizontal-rule";
import {ListItem} from "@tiptap/extension-list-item";
import {OrderedList} from "@tiptap/extension-ordered-list";
import {Paragraph} from "@tiptap/extension-paragraph";
import {Text} from "@tiptap/extension-text";
import {Bold} from "@tiptap/extension-bold";
import {Code} from "@tiptap/extension-code";
import {Italic} from "@tiptap/extension-italic";
import {Strike} from "@tiptap/extension-strike";
import {Dropcursor} from "@tiptap/extension-dropcursor";
import {Gapcursor} from "@tiptap/extension-gapcursor";
import {markdownContent} from './example.md';
import MarkdownIt from 'markdown-it';
import pretty from "pretty";
import {Editor} from "@tiptap/core";

type MarkdownText = string;
type HtmlText = string;

const contentExtensions = [
    Blockquote,
    BulletList,
    CodeBlock,
    Document,
    HardBreak,
    Heading,
    HorizontalRule,
    ListItem,
    OrderedList,
    Paragraph,
    Text,
    Bold,
    Code,
    Italic,
    Strike,
    Dropcursor,
    Gapcursor,
    Image.configure({
        inline: false,
    }),
    Table.configure(),
    TableRow,
    TableHeader,
    TableCell,
    Link,
];

function markdownToHtml(markdown: MarkdownText): HtmlText {
    const md = new MarkdownIt({
        html: true,
        breaks: false,
    });

    return md.render(markdown);
}

function createYdocFromHtml(html: HtmlText): Doc {
    const editorJsonFromHtml = generateJSON(html, contentExtensions);
    const transformer = TiptapTransformer.extensions(contentExtensions);
    return transformer.toYdoc(editorJsonFromHtml);
}

function createHtmlFromYdoc(document: Doc): HtmlText {
    const transformer = TiptapTransformer.extensions(contentExtensions);
    const json = transformer.fromYdoc(document, 'default');
    return generateHTML(json, contentExtensions);
}

function demo() {
    const originalMarkdown = markdownContent;
    const htmlFromOriginalMarkdown = markdownToHtml(originalMarkdown);
    document.querySelector("#original-html")!.textContent = htmlFromOriginalMarkdown;

    const ydocFromHtml = createYdocFromHtml(htmlFromOriginalMarkdown);
    const htmlFromEditorState = pretty(createHtmlFromYdoc(ydocFromHtml));
    document.querySelector("#generated-html")!.textContent = htmlFromEditorState;

    new Editor({
        element: document.querySelector('#editor')!,
        extensions: contentExtensions,
        content: htmlFromOriginalMarkdown,
    });
}

demo();
