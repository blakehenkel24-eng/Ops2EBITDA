export function ScrollReveal({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article';
}) {
  return (
    <Tag className={`scroll-reveal is-visible ${className}`}>
      {children}
    </Tag>
  );
}
