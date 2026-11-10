import { useEffect } from "react";

export function useDocumentMeta(title: string, description: string): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    const previousContent = meta?.getAttribute("content") ?? null;
    if (meta === null) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    let createdOgTitle = false;
    if (ogTitle === null) {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:title");
      document.head.appendChild(node);
      createdOgTitle = true;
      node.setAttribute("content", title);
    } else {
      ogTitle.setAttribute("content", title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    let createdOgDescription = false;
    if (ogDescription === null) {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:description");
      document.head.appendChild(node);
      createdOgDescription = true;
      node.setAttribute("content", description);
    } else {
      ogDescription.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;
      if (previousContent !== null) {
        meta?.setAttribute("content", previousContent);
      }
      if (createdOgTitle) {
        document.querySelector('meta[property="og:title"]')?.remove();
      }
      if (createdOgDescription) {
        document.querySelector('meta[property="og:description"]')?.remove();
      }
    };
  }, [title, description]);
}
