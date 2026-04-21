import { marked } from 'marked';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced'
});

turndownService.addRule('taskListItems', {
    filter: (node) => {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        return node.tagName === 'LI' && node.getAttribute('data-type') === 'taskItem';
    },
    replacement: (content, node) => {
        const isChecked = node instanceof HTMLElement && node.getAttribute('data-checked') === 'true';
        return `- [${isChecked ? 'x' : ' '}] ${content.trim()}\n`;
    }
});

export const markdownToHtml = (markdown: string): string => {
    return marked.parse(markdown) as string;
};

export const htmlToMarkdown = (html: string): string => {
    return turndownService.turndown(html).trimEnd();
};
