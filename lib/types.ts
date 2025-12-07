
import { trades, categories, tags, notes, sections, templates } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Trade = InferSelectModel<typeof trades> & {
    pnl: number; // Derived or Ensure it matches
    tags: string[]; // We might need to handle joined tags if we fetch them that way, or just array of IDs
};

export type Category = InferSelectModel<typeof categories> & {
    tags: Tag[];
};

export type Tag = InferSelectModel<typeof tags>;

export type Note = InferSelectModel<typeof notes> & {
    tags?: string[];
};

export type Section = InferSelectModel<typeof sections>;

export type Template = InferSelectModel<typeof templates>;
