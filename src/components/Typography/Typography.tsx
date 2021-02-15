import clsx from "clsx";
import React, { forwardRef, ReactNode } from "react";

type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface TypographyProps {
  color?:
    | "primary"
    | "primary-dark"
    | "secondary"
    | "foreground"
    | "foreground-secondary"
    | "foreground-tertiary"
    | "danger";
  size?: TextSize;
  strong?: boolean;
  emphasis?: boolean;
  align?: "center";
  id?: string;
  truncate?: boolean;
}

const commonClsx = (props: TypographyProps) =>
  clsx(
    props.color && `text-${props.color}`,
    props.strong && "font-bold",
    props.emphasis && "italic",
    props.align && `text-${props.align}`,
    props.size && `text-${props.size}`,
    props.truncate && "truncate"
  );

const Text: React.FC<TypographyProps> = ({ children, ...props }) => {
  return (
    <span id={props.id} className={commonClsx(props)}>
      {children}
    </span>
  );
};

const Paragraph: React.FC<
  TypographyProps & {
    paragraph?: boolean;
  }
> = ({ children, paragraph = true, ...props }) => {
  return (
    <p id={props.id} className={clsx(commonClsx(props), paragraph && "mb-4")}>
      {children}
    </p>
  );
};

const Link = forwardRef<
  HTMLAnchorElement,
  TypographyProps & { href?: string; target?: string; children?: ReactNode }
>(function Link({ children, href, target, ...props }, ref) {
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
    >
      {children}
    </a>
  );
});

const defaultTitleSize: TextSize[] = ["3xl", "2xl", "xl", "lg"];
const Title: React.FC<TypographyProps & { level?: 1 | 2 | 3 | 4 }> = ({
  children,
  level = 1,
  ...props
}) => {
  props.size = props.size || defaultTitleSize[level - 1];
  props.strong = typeof props.strong === "boolean" ? props.strong : true;
  const className = clsx(commonClsx(props), "mb-2");
  if (level === 2)
    return (
      <h2 id={props.id} className={className}>
        {children}
      </h2>
    );
  if (level === 3)
    return (
      <h3 id={props.id} className={className}>
        {children}
      </h3>
    );
  if (level === 4)
    return (
      <h4 id={props.id} className={className}>
        {children}
      </h4>
    );
  return (
    <h1 id={props.id} className={className}>
      {children}
    </h1>
  );
};

export default { Text, Paragraph, Title, Link };
