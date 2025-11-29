import TurndownService from "turndown";

export const htmlToMarkdown = (html: string): string => {
  // if no html or only whitespaces
  if (!html?.trim()) return "No content";

  const turndownservice = new TurndownService();

  const mkdString = turndownservice.turndown(html);
  // else
  return mkdString;
};
