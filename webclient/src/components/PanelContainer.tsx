type Props = React.HTMLAttributes<HTMLDivElement>;

const PanelContainer = ({ children, className }: Props) => {
  const cls = `
    w-full h-full
    m-1
    p-4
    flex flex-col
    gap-2
  `;
  return <div className={`${cls} ${className}`}>{children}</div>;
};

export default PanelContainer;
