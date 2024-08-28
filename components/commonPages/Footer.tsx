import { Separator } from "../ui/separator";

const Footer = () => {
  return (
    <footer className="text-center pt-7 mt-5 mb-5">
      <Separator orientation="horizontal" className="mb-5" />
      <p>© {new Date().getFullYear()} Fake News detection</p>
    </footer>
  );
};

export default Footer;
