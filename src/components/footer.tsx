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
    <footer className="bg-muted-foreground/2 text-primary mt-8  bg-no-repeat bg-cover pt-6 pb-8 px-4 md:px-8 lg:px-14">
      {/* Top Section: Logo + Links */}
      <div className="pt-4 container mx-auto">
        <div className=" space-y-14 md:space-y-2 space-x-4 mx-auto  md:flex justify-between">
          {/* Brand/Logo Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              {/* Logo Icon mimicking the image */}
              <Grid2x2Plus className="size-6" />
              <span className="text-2xl text-foreground font-bold tracking-tight">
                NewslyUSA
              </span>
            </div>
            <p className="text-foreground text-sm max-w-lg leading-relaxed">
              NewslyUSA: Fresh Perspectives, Bold Headlines, and the Pulse of a
              Nation. We Decode the American Narrative to Keep You Informed,
              Inspired, and Connected to Every State’s Story.
            </p>
          </div>
          <div className="">
            <NewsletterSubscribe />
          </div>
        </div>
        <div className="max-w-7xl border-dashed mx-auto border-t border-muted/45 mt-8 mb-8"></div>
      {/* Links Sections */}
        <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Platform */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
              Platform
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
              <li>
                <a
                  href="about"
                  className="hover:text-muted-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Pricing & Plans
                </a>
              </li>
              <li>
                <a
                  href="contact"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
              Resources
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Tools
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Newsletter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
              Products
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Swiftly
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Rareblocks
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  ClarityUI
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  NewslyUSA
                </a>
              </li>
            </ul>
          </div>

          {/* Legals */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">
              Legals
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Guides
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-muted-foreground transition-colors"
                >
                  Licensing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="max-w-7xl border-dashed mx-auto border-t border-muted/45 mt-8 mb-8"></div>
      
      <div className="p-2  text-xs text-center mb-4">
        <p className="italic"> <strong className="text-primary">**Disclaimer:**</strong> We strive to provide you with accurate and clear news
        content on our website. While we work diligently to ensure the quality
        and relevance of our information, we kindly acknowledge that we cannot
        guarantee that all content is always complete or up to date. We
        appreciate your understanding that we do not assume legal responsibility
        for any issues, losses, or decisions that may arise from the use of the
        information available on our site. Thank you for your cooperation and
        support.</p>
      </div>
      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row sm:justify-between items-center gap-6">
        <p className="text-foreground text-xs">
          © {currentYear}, All Rights Reserved by NewslyUSA
        </p>

        {/* Optional: Social Icons (if you still want them included) */}
        <div className="flex gap-5 text-primary">
          <a href="#" className="hover:text-[#1da1f2] transition-colors">
            <Twitter size={18} />
          </a>
          <a href="#" className="hover:text-[#1877f2] transition-colors">
            <Facebook size={18} />
          </a>
          <a href="#" className="hover:text-[#dd2a7b] transition-colors">
            <Instagram size={18} />
          </a>
          <a href="#" className="hover:text-[#0077b5] transition-colors">
            <Linkedin size={18} />
          </a>
        </div>
      </div>
     
 
    </footer>
  );
}
