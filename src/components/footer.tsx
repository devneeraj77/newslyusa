import { Facebook, Grid2x2Plus, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-secondary  bg-no-repeat bg-cover bg-[url(/img/blob-scene-haikei-small.svg)] md:bg-[url(/img/blob-scene-haikei.svg)] pt-16 pb-8 px-6 md:px-12 lg:px-24">
      {/* Top Section: Logo + Links */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Brand/Logo Section */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            {/* Logo Icon mimicking the image */}
            <Grid2x2Plus className="size-6" />
            <span className="text-2xl text-muted font-bold tracking-tight">NewslyUSA</span>
          </div>
          <p className="text-secondary text-sm max-w-xs leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
       
        {/* Links Sections */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Platform */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="#" className="hover:text-muted-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Pricing & Plans</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Resources</h3>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Account</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Tools</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Newsletter</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Products */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Products</h3>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Swiftly</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Rareblocks</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">ClarityUI</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">NewslyUSA</a></li>
            </ul>
          </div>

          {/* Legals */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Legals</h3>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-muted-foreground transition-colors">Licensing</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t border-muted/45 mt-16 mb-8"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row sm:justify-between items-center gap-6">
        <p className="text-muted text-sm">
          © {currentYear}, All Rights Reserved by NewslyUSA
        </p>
        
        {/* Optional: Social Icons (if you still want them included) */}
        <div className="flex gap-5 text-muted">
          <a href="#" className="hover:text-secondary transition-colors"><Twitter size={18} /></a>
          <a href="#" className="hover:text-secondary transition-colors"><Facebook size={18} /></a>
          <a href="#" className="hover:text-secondary transition-colors"><Instagram size={18} /></a>
          <a href="#" className="hover:text-secondary transition-colors"><Linkedin size={18} /></a>
        </div>
      </div>
    </footer>
  );
}