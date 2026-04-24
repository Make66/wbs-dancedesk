import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Link2, Link2Off } from "lucide-react";
import { cn } from "../../lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const toolbarBtn = (active: boolean) =>
  cn(
    "h-9 w-9 rounded-xl border border-muted-foreground bg-background/40",
    "flex items-center justify-center cursor-pointer transition-colors",
    active ? "bg-blue-500 text-white border-blue-500" : "hover:bg-blue-500 hover:text-white"
  );

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "outline-none min-h-[12rem] px-5 py-4 text-sm prose-editor",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;
    editor.commands.setContent(value || "");
  }, [value, editor]);

  const handleLink = () => {
    if (!editor) return;
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("URL eingeben:");
    if (!url) return;
    const href = url.startsWith("http") ? url : `https://${url}`;
    editor.chain().focus().setLink({ href }).run();
  };

  return (
    <div className="rounded-xl border border-muted-foreground bg-background/40 overflow-hidden focus-within:border-3 dark:focus-within:border-zinc-500">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-muted-foreground/30">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={toolbarBtn(editor?.isActive("bold") ?? false)}
          aria-label="Fett"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={toolbarBtn(editor?.isActive("italic") ?? false)}
          aria-label="Kursiv"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={toolbarBtn(editor?.isActive("bulletList") ?? false)}
          aria-label="Aufzählung"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={toolbarBtn(editor?.isActive("orderedList") ?? false)}
          aria-label="Nummerierte Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleLink}
          className={toolbarBtn(editor?.isActive("link") ?? false)}
          aria-label={editor?.isActive("link") ? "Link entfernen" : "Link einfügen"}
        >
          {editor?.isActive("link") ? (
            <Link2Off className="w-4 h-4" />
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
