import clsx from "clsx";
import { CSSProperties, forwardRef, ReactNode } from "react";

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

interface TypographyProps {
  color?:
    | "primary"
    | "primary-dark"
    | "primary-label"
    | "secondary"
    | "foreground"
    | "foreground-secondary"
    | "foreground-tertiary"
    | "danger";
  size?: TextSize;
  strong?: boolean;
  emphasis?: boolean;
  normal?: boolean;
  align?: "center" | "left" | "right";
  id?: string;
  truncate?: boolean;
  uppercase?: boolean;
  style?: CSSProperties;
}

const commonClsx = (props: TypographyProps) =>
  clsx(
    props.color && `text-${props.color}`,
    props.strong && "font-bold",
    props.emphasis && "italic",
    props.normal && "font-normal",
    props.align && `text-${props.align}`,
    props.size && `text-${props.size}`,
    props.truncate && "truncate",
    props.uppercase && "uppercase"
  );

const Text: React.FC<TypographyProps> = ({ children, style, ...props }) => {
  return (
    <span id={props.id} className={commonClsx(props)} style={style}>
      {children}
    </span>
  );
};

const Paragraph: React.FC<
  TypographyProps & {
    noMargin?: boolean;
  }
> = ({ children, noMargin, style, ...props }) => {
  return (
    <p
      id={props.id}
      className={clsx(commonClsx(props), !noMargin && "mb-4")}
      style={style}
    >
      {children}
    </p>
  );
};

const Link = forwardRef<
  HTMLAnchorElement,
  TypographyProps & { href?: string; target?: string; children?: ReactNode }
>(function Link({ children, href, target, style, ...props }, ref) {
  return (
    <a
      href={href}
      id={props.id}
      /* @ts-ignore: For next/link only */
      onClick={props.onClick}
      {...(href?.startsWith("http") &&
        target === "_blank" && { rel: "noopener noreferrer" })}
      className={clsx(commonClsx(props), "text-inline-link")}
      ref={ref}
      style={style}
    >
      {children}
    </a>
  );
});

const defaultTitleSize: TextSize[] = ["3xl", "2xl", "xl", "lg"];
const Title: React.FC<
  TypographyProps & { level?: 1 | 2 | 3 | 4; noMargin?: boolean }
> = ({ children, level = 1, noMargin, style, ...props }) => {
  props.size = props.size || defaultTitleSize[level - 1];
  props.strong = typeof props.strong === "boolean" ? props.strong : true;
  const className = clsx(commonClsx(props), !noMargin && "mb-2");
  if (level === 2)
    return (
      <h2 id={props.id} className={className} style={style}>
        {children}
      </h2>
    );
  if (level === 3)
    return (
      <h3 id={props.id} className={className} style={style}>
        {children}
      </h3>
    );
  if (level === 4)
    return (
      <h4 id={props.id} className={className} style={style}>
        {children}
      </h4>
    );
  return (
    <h1 id={props.id} className={className} style={style}>
      {children}
    </h1>
  );
};

export default { Text, Paragraph, Title, Link };
