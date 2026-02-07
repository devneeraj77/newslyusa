import {
  Facebook,
  Grid2x2Plus,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { NewsletterSubscribe } from "@/components/newsletter-subscribe";
import { Separator } from "./ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/20 border-t pt-16 pb-8 mt-10">
      {/* Top Section: Logo + Links */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">
          {/* Brand/Logo Section */}
          <div className="flex flex-col gap-6 max-w-lg">
            <div className="flex items-center gap-2">
              {/* Logo Icon mimicking the image */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Grid2x2Plus className="size-6 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                NewslyUSA
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              NewslyUSA: Fresh Perspectives, Bold Headlines, and the Pulse of a
              Nation. We Decode the American Narrative to Keep You Informed,
              Inspired, and Connected to Every State’s Story.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <h3 className="font-semibold tracking-tight text-sm">Subscribe to our newsletter</h3>
            <NewsletterSubscribe />
          </div>
        </div>
        
        <Separator className="my-8" />
        
        {/* Links Sections */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Platform */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground tracking-wide">
              Platform
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing & Plans
                </a>
              </li>
              <li>
                <a
                  href="contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground tracking-wide">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Tools
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Newsletter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          

          {/* Legals */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground tracking-wide">
              Legals
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Guides
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  Licensing
                </a>
              </li>
            </ul>
          </div>
          {/* Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground tracking-wide">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="/us"
                  className="hover:text-foreground transition-colors"
                >
                  US
                </a>
              </li>
              <li>
                <a
                  href="/politics"
                  className="hover:text-foreground transition-colors"
                >
                  Politics
                </a>
              </li>
              <li>
                <a
                  href="/health"
                  className="hover:text-foreground transition-colors"
                >
                  Health
                </a>
              </li>
              <li>
                <a
                  href="/travel"
                  className="hover:text-foreground transition-colors"
                >
                  Travel
                </a>
              </li>
              <li>
                <a
                  href="/sports"
                  className="hover:text-foreground transition-colors"
                >
                  Sports
                </a>
              </li>
              <li>
                <a
                  href="/tech-and-media"
                  className="hover:text-foreground transition-colors"
                >
                  Tech & Media
                </a>
              </li>
              <li>
                <a
                  href="/entertainment"
                  className="hover:text-foreground transition-colors"
                >
                  Entertainment
                </a>
              </li>
            </ul>
          </div>
        </div>
      {/* Divider */}
      <Separator className="my-8" />
      
      <div className="mb-8 text-center">
        <p className="text-xs text-muted-foreground italic max-w-4xl mx-auto leading-relaxed">
          <span className="font-semibold text-foreground not-italic">Disclaimer:</span> We strive to provide you with accurate and clear news
        content on our website. While we work diligently to ensure the quality
        and relevance of our information, we kindly acknowledge that we cannot
        guarantee that all content is always complete or up to date. We
        appreciate your understanding that we do not assume legal responsibility
        for any issues, losses, or decisions that may arise from the use of the
        information available on our site. Thank you for your cooperation and
        support.</p>
      </div>
      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground text-xs">
          © {currentYear}, All Rights Reserved by NewslyUSA
        </p>

        {/* Optional: Social Icons (if you still want them included) */}
        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-[#1da1f2] transition-colors">
            <Twitter className="size-5" />
            <span className="sr-only">Twitter</span>
          </a>
          <a href="#" className="text-muted-foreground hover:text-[#1877f2] transition-colors">
            <Facebook className="size-5" />
            <span className="sr-only">Facebook</span>
          </a>
          <a href="#" className="text-muted-foreground hover:text-[#dd2a7b] transition-colors">
            <Instagram className="size-5" />
            <span className="sr-only">Instagram</span>
          </a>
          <a href="#" className="text-muted-foreground hover:text-[#0077b5] transition-colors">
            <Linkedin className="size-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
      </div>
      </div>
    </footer>
  );
}
