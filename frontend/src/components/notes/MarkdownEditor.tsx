import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import { markdownToHtml, htmlToMarkdown } from './markdownConversion';
import './MarkdownEditor.css';

export type MarkdownEditorHandle = {
    insertMarkdownAtCursor: (snippet: string) => void;
    focus: () => void;
};

type MarkdownEditorProps = {
    value: string;
    onChange: (markdown: string) => void;
    placeholder: string;
};

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
    ({ value, onChange, placeholder }, ref) => {
        const lastEmittedMarkdownRef = useRef<string>(value);

        const editor = useEditor({
            extensions: [
                StarterKit,
                Image,
                TaskList,
                TaskItem.configure({ nested: true }),
                Placeholder.configure({ placeholder })
            ],
            content: markdownToHtml(value),
            editorProps: {
                attributes: {
                    class: 'tiptap-editor'
                }
            },
            onUpdate: ({ editor: tiptapEditor }) => {
                const markdown = htmlToMarkdown(tiptapEditor.getHTML());
                lastEmittedMarkdownRef.current = markdown;
                onChange(markdown);
            }
        });

        useEffect(() => {
            if (!editor) {
                return;
            }
            if (value === lastEmittedMarkdownRef.current) {
                return;
            }
            editor.commands.setContent(markdownToHtml(value), false);
            lastEmittedMarkdownRef.current = value;
        }, [editor, value]);

        useImperativeHandle(ref, () => ({
            insertMarkdownAtCursor: (snippet: string) => {
                if (!editor) {
                    return;
                }
                editor.chain().focus().insertContent(markdownToHtml(snippet)).run();
            },
            focus: () => {
                editor?.commands.focus();
            }
        }), [editor]);

        return <EditorContent editor={editor} className="tiptap-editor-wrapper" />;
    }
);

MarkdownEditor.displayName = 'MarkdownEditor';
