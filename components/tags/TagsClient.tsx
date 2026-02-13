"use client";

import { useState, useEffect } from "react";
import { Plus, X, Tag as TagIcon, FolderPlus, Palette } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { createCategory, deleteCategory, updateCategory, createTag, deleteTag } from "@/app/actions/tag-actions";

// Types
interface Tag {
    id: string;
    categoryId: string;
    name: string;
    color: string;
}

interface Category {
    id: string;
    name: string;
    color: string;
    tags: Tag[];
}

const COLORS = [
    { name: "Blue", value: "blue", class: "border border-blue-500/25 bg-blue-500/15 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300", border: "border-blue-500/35" },
    { name: "Green", value: "green", class: "border border-emerald-500/25 bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", border: "border-emerald-500/35" },
    { name: "Red", value: "red", class: "border border-red-500/25 bg-red-500/15 text-red-700 dark:bg-red-500/15 dark:text-red-300", border: "border-red-500/35" },
    { name: "Yellow", value: "yellow", class: "border border-amber-500/25 bg-amber-500/15 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", border: "border-amber-500/35" },
    { name: "Purple", value: "purple", class: "border border-violet-500/25 bg-violet-500/15 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", border: "border-violet-500/35" },
    { name: "Orange", value: "orange", class: "border border-orange-500/25 bg-orange-500/15 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300", border: "border-orange-500/35" },
    { name: "Pink", value: "pink", class: "border border-pink-500/25 bg-pink-500/15 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300", border: "border-pink-500/35" },
    { name: "Gray", value: "gray", class: "border border-slate-500/25 bg-slate-500/15 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300", border: "border-slate-500/35" },
];

export default function TagsClient({ initialCategories }: { initialCategories: any[] }) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [newCatName, setNewCatName] = useState("");
    const [selectedColor, setSelectedColor] = useState("blue");
    const [newTagNames, setNewTagNames] = useState<Record<string, string>>({});
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setCategories(initialCategories);
    }, [initialCategories]);

    const handleAddCategory = async () => {
        if (!newCatName.trim()) return;
        setUpdating(true);
        const id = `cat_${Date.now()}`;

        // Optimistic update
        const newCat: Category = {
            id,
            name: newCatName,
            color: selectedColor,
            tags: []
        };
        setCategories([...categories, newCat]);
        setNewCatName("");

        try {
            await createCategory({
                id,
                name: newCatName,
                color: selectedColor
            });
            router.refresh();
        } catch (error) {
            console.error(error);
            // Revert on error? For now simple log.
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteCategory = async (catId: string) => {
        if (!confirm("Are you sure? This will delete all tags in this category.")) return;
        setUpdating(true);
        setCategories(categories.filter(c => c.id !== catId));

        try {
            await deleteCategory(catId);
            router.refresh();
        } catch (error) { console.error(error); } finally { setUpdating(false); }
    };

    const handleUpdateCategoryColor = async (catId: string, color: string) => {
        const cat = categories.find(c => c.id === catId);
        if (!cat || cat.color === color) return;

        setCategories(categories.map(c => c.id === catId ? { ...c, color } : c));

        try {
            await updateCategory(catId, { color });
            router.refresh();
        } catch (error) { console.error(error); }
    };

    const handleAddTag = async (catId: string) => {
        const tagName = newTagNames[catId];
        if (!tagName?.trim()) return;
        setUpdating(true);

        const id = `tag_${Date.now()}`;
        const cat = categories.find(c => c.id === catId);
        const colorObj = COLORS.find(c => c.value === (cat?.color || "blue")) || COLORS[0];

        // Optimistic
        setCategories(categories.map(c => {
            if (c.id === catId) {
                return { ...c, tags: [...c.tags, { id, categoryId: catId, name: tagName, color: colorObj.class }] };
            }
            return c;
        }));
        setNewTagNames(prev => ({ ...prev, [catId]: "" }));

        try {
            await createTag({
                id,
                categoryId: catId,
                name: tagName,
                color: colorObj.class
            });
            router.refresh();
        } catch (error) { console.error(error); } finally { setUpdating(false); }
    };

    const handleDeleteTag = async (catId: string, tagId: string) => {
        setCategories(categories.map(c => {
            if (c.id === catId) {
                return { ...c, tags: c.tags.filter(t => t.id !== tagId) };
            }
            return c;
        }));

        try {
            await deleteTag(tagId);
            router.refresh();
        } catch (error) { console.error(error); }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Tag Management</h2>

                <div className="flex flex-col md:flex-row items-center gap-2 bg-card/70 p-2 rounded-lg border border-border/80 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="New Category Name"
                        className="bg-background/70 border border-input px-3 py-1.5 text-sm w-full md:w-48 rounded-md focus:outline-none focus:ring-2 focus:ring-ring mb-2 md:mb-0"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />

                    {/* Color Picker for New Category */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-2">
                        <div className="flex space-x-1 px-2 md:border-l border-border/70">
                            {COLORS.slice(0, 5).map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setSelectedColor(c.value)}
                                    className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${c.value === selectedColor ? 'ring-2 ring-primary ring-offset-1 ring-offset-card' : ''}`}
                                    style={{ backgroundColor: c.value === 'white' ? 'white' : `var(--color-${c.value}-500, ${c.value})` }}
                                    title={c.name}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleAddCategory}
                            disabled={updating}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-xs font-medium ml-2 disabled:opacity-50"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                    const catColor = COLORS.find(c => c.value === category.color) || COLORS[0];
                    return (
                        <Card key={category.id} className={`relative group border-t-4 ${catColor?.border ? catColor.border.replace('border-', 'border-t-') : ''}`} style={{ borderTopColor: category.color !== 'white' ? category.color : undefined }}>
                            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center space-x-2">
                                    <CardTitle>{category.name}</CardTitle>
                                    <div className="flex space-x-1">
                                        {COLORS.map(c => (
                                            <button
                                                key={c.value}
                                                onClick={() => handleUpdateCategoryColor(category.id, c.value)}
                                                className={`w-3 h-3 rounded-full transition-transform hover:scale-125 ${category.color === c.value ? 'ring-2 ring-offset-1 ring-primary ring-offset-card' : ''}`}
                                                style={{ backgroundColor: c.value === 'white' ? '#e2e8f0' : `var(--color-${c.value}-500, ${c.value})` }}
                                                title={`Set color to ${c.name}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="text-muted-foreground hover:text-destructive opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {category.tags.map(tag => (
                                        <div key={tag.id} className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${tag.color || catColor.class}`}>
                                            <span>{tag.name}</span>
                                            <button onClick={() => handleDeleteTag(category.id, tag.id)} className="hover:text-foreground/70 ml-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {category.tags.length === 0 && (
                                        <span className="text-xs text-muted-foreground italic">No tags yet</span>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder="Add tag..."
                                        className="flex-1 bg-background border border-input text-xs px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-primary/40"
                                        value={newTagNames[category.id] || ""}
                                        onChange={(e) => setNewTagNames(prev => ({ ...prev, [category.id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag(category.id)}
                                    />
                                    <button
                                        onClick={() => handleAddTag(category.id)}
                                        className="p-1.5 hover:bg-accent rounded text-primary"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
