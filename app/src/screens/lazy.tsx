import { LoadingScreen } from "@/components/Loading";
import type { ComponentProps, ComponentType } from "react";
import { lazy, Suspense } from "react";

const suspenseFallback = <LoadingScreen />;
const wrappedLazy = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => {
  const Component = lazy(factory);
  return function WrappedLazyComponent(props: ComponentProps<T>) {
    return (
      <Suspense fallback={suspenseFallback}>
        <Component {...props} />
      </Suspense>
    );
  };
};

export default wrappedLazy;
