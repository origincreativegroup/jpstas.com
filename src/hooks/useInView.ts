import { useSignal, useVisibleTask$ } from '@builder.io/qwik';

export const useInView = <T extends Element>(options?: IntersectionObserverInit) => {
  const target = useSignal<T>();
  const inView = useSignal(false);

  useVisibleTask$(({ cleanup, track }) => {
    const element = track(() => target.value);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        inView.value = entry?.isIntersecting ?? false;
      },
      {
        threshold: 0.35,
        ...options,
      },
    );
    observer.observe(element);

    cleanup(() => observer.disconnect());
  });

  return { target, inView };
};


