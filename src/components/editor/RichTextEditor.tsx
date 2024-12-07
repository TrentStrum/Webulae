```typescript
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Typography from '@tiptap/extension-typography';
import { Emoji } from '@tiptap/extension-emoji';
import { Toolbar } from './Toolbar';
import { cn } from '@/src/utils/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  onImageUpload,
  placeholder = 'Start writing...',
  className,
  minHeight = '200px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Color,
      TextStyle,
      FontFamily,
      Typography,
      Emoji,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
          'prose-headings:font-bold prose-headings:text-foreground',
          'prose-p:text-muted-foreground',
          'prose-a:text-primary',
          'prose-strong:text-foreground',
          'prose-code:text-muted-foreground prose-code:bg-muted',
          'prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary',
          'prose-img:rounded-lg',
          className
        ),
        style: { minHeight },
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg">
      <Toolbar editor={editor} onImageUpload={onImageUpload} />
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
```