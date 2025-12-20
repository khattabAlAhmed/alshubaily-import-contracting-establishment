"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Undo,
    Redo,
    Palette,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type RichTextEditorProps = {
    labelEn?: string;
    labelAr?: string;
    contentEn: string;
    contentAr: string;
    onChangeEn: (html: string) => void;
    onChangeAr: (html: string) => void;
};

const colors = [
    "#000000", "#374151", "#6B7280", "#9CA3AF",
    "#DC2626", "#EA580C", "#CA8A04", "#16A34A",
    "#0891B2", "#2563EB", "#7C3AED", "#DB2777",
];

export function RichTextEditor({
    labelEn = "Content",
    labelAr = "المحتوى",
    contentEn,
    contentAr,
    onChangeEn,
    onChangeAr,
}: RichTextEditorProps) {
    const locale = useLocale();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{locale === "ar" ? labelAr : labelEn}</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" forceMount className="data-[state=inactive]:hidden">
                        <SingleEditor
                            key="editor-en"
                            content={contentEn}
                            onChange={onChangeEn}
                            dir="ltr"
                            placeholder="Enter content..."
                        />
                    </TabsContent>
                    <TabsContent value="ar" forceMount className="data-[state=inactive]:hidden">
                        <SingleEditor
                            key="editor-ar"
                            content={contentAr}
                            onChange={onChangeAr}
                            dir="rtl"
                            placeholder="أدخل المحتوى..."
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}


type SingleEditorProps = {
    content: string;
    onChange: (html: string) => void;
    dir: "ltr" | "rtl";
    placeholder?: string;
};

function SingleEditor({ content, onChange, dir, placeholder }: SingleEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none",
                dir,
            },
        },
    });


    if (!editor) {
        return <div className="h-[300px] border rounded-md animate-pulse bg-muted" />;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) return;

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return (
        <div className="border rounded-md">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
                <Button
                    type="button"
                    variant={editor.isActive("bold") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("italic") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("underline") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("strike") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant={editor.isActive("link") ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={setLink}
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                            <Palette className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="grid grid-cols-4 gap-1">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => editor.chain().focus().setColor(color).run()}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <div className="w-px h-8 bg-border mx-1" />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
