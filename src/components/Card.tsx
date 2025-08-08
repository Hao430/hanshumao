import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description, tags } = frontmatter;

  const headerProps = {
    className: "text-xl font-bold gradient-text hover:scale-105 transition-transform duration-300",
  };

  return (
    <li className="my-8">
      <article className="glass rounded-2xl p-6 card-hover border border-white/20">
        <a
          href={href}
          className="block focus-visible:no-underline focus-visible:outline-none"
        >
          {secHeading ? (
            <h2 {...headerProps}>{title}</h2>
          ) : (
            <h3 {...headerProps}>{title}</h3>
          )}
        </a>
        
        <div className="mt-3 mb-4">
          <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
        </div>
        
        <p className="text-skin-base/80 text-lg leading-relaxed mb-4">{description}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-skin-accent/10 text-skin-accent rounded-full border border-skin-accent/20"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-3 py-1 text-xs font-medium text-skin-base/60">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <span className="text-sm text-skin-base/60 hover:text-skin-accent transition-colors duration-300">
            阅读全文 →
          </span>
        </div>
      </article>
    </li>
  );
}
