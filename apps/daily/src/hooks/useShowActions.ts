"use client";
import { useEffect, useLayoutEffect, useState } from "react";

const PAGE_OFFSET = 65;

export function useShowActions() {
  const show = useShowOnScroll(PAGE_OFFSET);
  const isContentScrollable = useIsContentScrollable();
  const [loading, isMinTabDimes] = useIsMinWidthTabDimensions();

  // always show on desktop
  if (!loading && isMinTabDimes) {
    return true;
  }

  return isContentScrollable ? show : true;
}

function useShowOnScroll(pageOffset = 0) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleOnScroll = () => {
      setShow(window.scrollY > pageOffset);
    };

    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, [pageOffset]);

  return show;
}

export const CONTENT_ID = "content";

// if the content overflows the viewport height
function useIsContentScrollable() {
  const [isContentScrollable, setIsContentScrollable] = useState<boolean>();

  useLayoutEffect(() => {
    const htmlElement = document.querySelector("html");
    const content = document.getElementById(CONTENT_ID);
    const contentClientHeight = content?.clientHeight;

    if (htmlElement && contentClientHeight) {
      setIsContentScrollable(contentClientHeight > htmlElement.clientHeight);
    }
  }, []);

  return Boolean(isContentScrollable);
}

const TAB_WIDTH = 768;

export function useIsMinWidthTabDimensions() {
  const [isMinTabDimes, setIsMinTabDimes] = useState<boolean>();

  useLayoutEffect(() => {
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      setIsMinTabDimes(htmlElement.clientWidth >= TAB_WIDTH);
    }
  }, []);

  const loading = isMinTabDimes === undefined;

  return [isMinTabDimes, loading] as const;
}
