import { useEffect } from "react";

export function useTitle(title: string) {
  useEffect(() => {
    const ogTitle = document.title;
    document.title = title;
    return () => {
      document.title = ogTitle;
    };
  }, [title]);
}
