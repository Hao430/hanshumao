import type socialIcons from "@assets/socialIcons";

export interface Site {
  website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode?: boolean;
  postPerIndex?: number;
  postPerPage?: number;
  scheduledPostMargin?: number;
}

export interface SocialObjects {
  name: SocialMedia;
  href: string;
  active: boolean;
  linkTitle: string;
}

export type SocialMedia =
  | "Github"
  | "Facebook"
  | "Instagram"
  | "LinkedIn"
  | "Mail"
  | "Twitter"
  | "Twitch"
  | "YouTube"
  | "WhatsApp"
  | "Snapchat"
  | "Pinterest"
  | "TikTok"
  | "CodePen"
  | "Discord"
  | "GitLab"
  | "Reddit"
  | "Skype"
  | "Steam"
  | "Telegram"
  | "Mastodon";

// Astro Content Collections 类型声明
declare module "astro:content" {
  interface Render {
    ".md": Promise<{
      Content: import("astro").MarkdownInstance<{}>["Content"];
      headings: import("astro").MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
  
  interface CollectionEntry<T extends keyof Render> {
    id: string;
    slug: string;
    body: string;
    collection: T;
    data: any;
    render(): Promise<Render[T]>;
  }
  
  interface Collection<T extends keyof Render> {
    type: "content";
    schema: any;
  }
  
  export function getCollection<T extends keyof Render>(
    collection: T
  ): Promise<CollectionEntry<T>[]>;
  
  export function defineCollection<T extends keyof Render>(
    config: Collection<T>
  ): Collection<T>;
}

// Astro Transitions 类型声明
declare module "astro:transitions" {
  export interface ViewTransitions {
    transition: (name: string) => void;
  }
}
