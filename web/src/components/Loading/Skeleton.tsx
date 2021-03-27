import clsx from "clsx";

interface SkeletonProps {
  show: boolean;
  rounded: "lg" | "full";
  width: 4 | 8 | 10 | 12 | 20 | 32 | 40;
  height: 2 | 4 | 6 | 8 | 10 | 12;
}

const Skeleton: React.FC<Partial<SkeletonProps>> = ({
  children,
  show,
  rounded,
  width,
  height,
}) => {
  if (!show) return <>{children}</>;
  return (
    <div
      className={clsx(
        "block-skeleton",
        rounded && `rounded-${rounded}`,
        width && `w-${width}`,
        height && `h-${height}`
      )}
    >
      <div className="invisible">{children}</div>
    </div>
  );
};

export default Skeleton;
