import { AfterViewInit, Directive, ElementRef, inject, OnDestroy, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Reveals existing content once when it enters the viewport. */
@Directive({ selector: '.reveal', standalone: true })
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const node = this.element.nativeElement;
    const siblings = node.parentElement ? Array.from(node.parentElement.children) : [];
    const index = siblings.indexOf(node);
    if (index > 0) this.renderer.setStyle(node, '--reveal-delay', `${Math.min(index * 140, 560)}ms`);
    this.renderer.addClass(node, 'reveal-pending');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      this.renderer.removeClass(node, 'reveal-pending');
      this.renderer.addClass(node, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        this.renderer.removeClass(node, 'reveal-pending');
        this.renderer.addClass(node, 'is-visible');
        this.observer?.disconnect();
        break;
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
