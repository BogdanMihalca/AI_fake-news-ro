import { FC } from "react";

const Content: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <main style={{ minHeight: "75vh", maxWidth: "calc(100vw - 30px)" }}>
      {children}
    </main>
  );
};

export default Content;
