import Link from "next/link";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import {
  Facebook,
  Github,
  InfoIcon,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t my-8">
      <Separator orientation="horizontal" className="mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Fake News Detector</h3>
          <p className="text-sm text-muted-foreground">
            Empowering readers with AI-driven fact-checking tools to combat
            misinformation. Our mission is to provide a reliable and efficient
            way to identify fake news and promote media literacy.
            <br />
            <br />
            <InfoIcon className="h-4 w-4 inline-block ml-1 mr-2" />
            Note that this model was trained mainly on Romanian news articles.
            We don&rsquo;t guarantee the same accuracy for other languages.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/docs" className="text-sm hover:underline">
                General Information
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/datasets" className="text-sm hover:underline">
                Dataset
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Follow me</h4>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://www.facebook.com/MihalcaBogdan01"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://x.com/MBC0714"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://www.instagram.com/mihalcabogdan/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://www.linkedin.com/in/bogdan-mihalca-76b2b7b3/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/BogdanMihalca"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Fake News Detector. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
