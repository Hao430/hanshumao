import Fuse from "fuse.js";
import { useEffect, useRef, useState, useMemo } from "react";
import Card from "@components/Card";
import type { CollectionEntry } from "astro:content";

export type SearchItem = {
  title: string;
  description: string;
  data: CollectionEntry<"blog">["data"];
  slug: string;
};

interface Props {
  searchList: SearchItem[];
}

interface SearchResult {
  item: SearchItem;
  refIndex: number;
}

export default function SearchBar({ searchList }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description"],
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.5,
      }),
    [searchList]
  );

  useEffect(() => {
    // if URL has search query,
    // insert that search query in input field
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    // put focus cursor at the end of the string
    setTimeout(function () {
      inputRef.current!.selectionStart = inputRef.current!.selectionEnd =
        searchStr?.length || 0;
    }, 50);
  }, []);

  useEffect(() => {
    // Add search result only if
    // input value is more than one character
    let inputResult = inputVal.length > 1 ? fuse.search(inputVal) : [];
    setSearchResults(inputResult);

    // Update search string in URL
    if (inputVal.length > 0) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(history.state, "", newRelativePathQuery);
    } else {
      history.replaceState(history.state, "", window.location.pathname);
    }
  }, [inputVal]);

  return (
    <div className="search-container">
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-5 w-5 text-skin-base">
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
          </svg>
          <span className="sr-only">搜索</span>
        </span>
        <input
          className="block w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md py-4 pl-12
        pr-4 placeholder:italic placeholder:text-skin-base/60 text-skin-base
        focus:border-skin-accent focus:outline-none focus:ring-2 focus:ring-skin-accent/20 transition-all duration-300"
          placeholder="搜索文章、标签或任何内容..."
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          ref={inputRef}
        />
      </label>

      <div className="search-results">
        {inputVal.length > 1 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold gradient-text">
                搜索结果
              </h2>
              <span className="text-sm text-skin-base/60">
                找到 {searchResults?.length || 0} 个结果
              </span>
            </div>
            
            {searchResults && searchResults.length === 0 && (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-skin-base/60 text-lg">
                  没有找到与 "{inputVal}" 相关的内容
                </p>
                <p className="text-skin-base/40 mt-2">
                  尝试使用不同的关键词或检查拼写
                </p>
              </div>
            )}
            
            {searchResults && searchResults.length > 0 && (
              <ul className="space-y-4">
                {searchResults.map(({ item }) => (
                  <Card
                    href={`/posts/${item.slug}/`}
                    frontmatter={item.data}
                    secHeading={false}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
