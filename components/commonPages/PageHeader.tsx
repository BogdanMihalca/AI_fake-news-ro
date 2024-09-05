import { FC } from "react";

const PageHeader: FC<{
  title: string;
  subtitle?: string;
}> = ({ title, subtitle }) => {
  return (
    <header className="mt-2 p-4">
      <h1 className="text-2xl font-bold pb-2">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </header>
  );
};

export default PageHeader;
