import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createElement } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(html: string) {
  if (!html) return "";
  
  // Replace <br> and </p> tags with a space to prevent words from merging
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function blogSanitizer(content: string) {
  if (!content) return null;

  // Render HTML content as-is, ensuring 2 break tags at the end
  return createElement("div", {
    dangerouslySetInnerHTML: {
      __html: content + "<br /><br />"
    }
  });
}


// create new blogSanitize only use blog post content sanitize, in as is it submit in form, and show any elements work properly and 2br end tag

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}