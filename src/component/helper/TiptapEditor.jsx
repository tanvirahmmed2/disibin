'use client';
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  FaBold, FaItalic, FaListUl, FaListOl, FaHeading, FaQuoteRight, FaUndo, FaRedo 
} from 'react-icons/fa';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const btnClass = "p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors";
  const activeBtnClass = "p-2 rounded-lg text-primary bg-primary/10 transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50/50 rounded-t-2xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? activeBtnClass : btnClass}
        title="Bold"
      >
        <FaBold size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? activeBtnClass : btnClass}
        title="Italic"
      >
        <FaItalic size={14} />
      </button>
      
      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? activeBtnClass : btnClass}
        title="Heading 1"
      >
        <FaHeading size={14} />1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? activeBtnClass : btnClass}
        title="Heading 2"
      >
        <FaHeading size={14} />2
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? activeBtnClass : btnClass}
        title="Bullet List"
      >
        <FaListUl size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? activeBtnClass : btnClass}
        title="Ordered List"
      >
        <FaListOl size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? activeBtnClass : btnClass}
        title="Blockquote"
      >
        <FaQuoteRight size={14} />
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={btnClass}
        title="Undo"
      >
        <FaUndo size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={btnClass}
        title="Redo"
      >
        <FaRedo size={14} />
      </button>
    </div>
  );
};

const TiptapEditor = ({ value, onChange, placeholder = "Write something...", hideToolbar = false, minHeight = "150px" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose max-w-none p-4 focus:outline-none text-slate-700`,
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Handle value updates from parent (e.g. initial load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!mounted) {
    return <div className="min-h-[200px] w-full bg-slate-50 animate-pulse rounded-[2rem] border border-slate-200"></div>;
  }

  return (
    <div className="input-style p-0 overflow-hidden bg-white focus-within:border-primary-light focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      {!hideToolbar && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
