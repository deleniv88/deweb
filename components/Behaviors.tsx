"use client";
import { useEffect } from "react";
import { initBurger, initHeader, initCarousel, initServices, initFeatures } from "../lib/behaviors";

/* Запускає весь інтерактив після рендеру.
   depsKey змінюється, коли в адмінці додають/видаляють кейси, послуги чи переваги —
   тоді анімації перезапускаються з новою кількістю елементів. */
export default function Behaviors({ depsKey = "", page = "home" }: { depsKey?: string; page?: "home" | "inner" }) {
  useEffect(() => {
    const cleanups = [initBurger(), initHeader()];
    if (page === "home") cleanups.push(initCarousel(), initServices(), initFeatures());
    return () => cleanups.forEach((c) => c && c());
  }, [depsKey, page]);
  return null;
}
