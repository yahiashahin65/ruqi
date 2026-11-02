"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function MotionProvider() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 0.82,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1
    });

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (hero) {
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl
          .fromTo("[data-hero-media]", { scale: 1.045, opacity: 0.84 }, { scale: 1, opacity: 1, duration: 1.35 })
          .fromTo("[data-hero-item]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.76, stagger: 0.09 }, "-=.92");

        if (window.matchMedia("(min-width: 769px)").matches) {
          const heroImage = hero.querySelector<HTMLElement>("[data-hero-media] img");
          if (heroImage) {
            gsap.to(heroImage, {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.7
              }
            });
          }
        }
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
        gsap.fromTo(
          node,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 91%", once: true }
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-media]").forEach((node) => {
        gsap.fromTo(
          node,
          { clipPath: "inset(7% 0 7% 0)", scale: 1.02 },
          {
            clipPath: "inset(0% 0 0% 0)",
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 89%", once: true }
          }
        );
      });

      if (window.matchMedia("(min-width: 769px)").matches) {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((node) => {
          gsap.fromTo(
            node,
            { yPercent: -2 },
            {
              yPercent: 2,
              ease: "none",
              scrollTrigger: { trigger: node, scrub: 0.6, start: "top bottom", end: "bottom top" }
            }
          );
        });
      }
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      context.revert();
      gsap.ticker.remove(tick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
    };
  }, []);

  return null;
}
