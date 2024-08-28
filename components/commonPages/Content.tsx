import { FC } from "react";

const Content: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return <main style={{ minHeight: "75vh" }}>{children}</main>;
};

export default Content;
