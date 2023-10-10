import { Megaphone } from "@phosphor-icons/react";

interface UpdateNotifierProps {
  className?: string;
  isDrawer?: boolean;
}

const Content = ({ fixed }: { fixed?: boolean }) => {
  return <div className={`updateContent${fixed ? " fixed" : ""}`}>test</div>;
};

const UpdateNotifier = ({ className, isDrawer }: UpdateNotifierProps) => {
  return (
    <div className={`updateNotifier${className ? ` ${className}` : ""}`}>
      {isDrawer ? (
        <>
          <button className="usa-button primary">
            <Megaphone size={32} />
            Sign Up for Updates
          </button>
          <Content fixed />
        </>
      ) : (
        <Content />
      )}
    </div>
  );
};

export { UpdateNotifier };
