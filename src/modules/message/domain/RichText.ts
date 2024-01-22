export interface RichText {
  tokens: RichTextToken[];
}

export interface RichTextToken {
  value: string;
  type: "rich" | "link" | "mention";
}
