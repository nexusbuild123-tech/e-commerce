import { Link } from "react-router-dom";
// React Icons Imports - Changed FaXTwitter to FaYoutube
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube 
} from "react-icons/fa6";
import { 
  FiPhone, 
  FiMail 
} from "react-icons/fi";

const Footer = () => {
  // --- EXPLICIT LINK CONFIGURATIONS ---
  const companyLinks = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' }
  ];

  const supportLinks = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Cancellation', path: '/cancellation' },
    { name: 'Refund Policy', path: '/refund-policy' }
  ];

  const legalLinks = [
    { name: 'Terms of Use', path: '/terms-of-use' },
    { name: 'Privacy Policy', path: '/privacy-policy' }
  ];

  // Updated with exact profile links & replaced Twitter with YouTube
  const socialLinks = [
    { 
      label: 'Facebook', 
      href: 'https://www.facebook.com/profile.php?id=100089161612316', 
      icon: <FaFacebookF className="w-4 h-4" /> 
    },
    { 
      label: 'Instagram', 
      href: 'https://www.instagram.com/crmtraders/', 
      icon: <FaInstagram className="w-4 h-4" /> 
    },
    { 
      label: 'YouTube', 
      href: 'https://www.youtube.com/@crmtraders5504', 
      icon: <FaYoutube className="w-4 h-4" /> 
    },
  ];

  return (
    <footer className="relative bg-[#030305] text-gray-300 pt-24 pb-12 font-sans overflow-hidden border-t border-white/5 mt-auto">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 lg:gap-16 pb-20">
          
          {/* Brand & Socials */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col items-start text-left">
            <Link to="/" className="inline-block group mb-6">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter transition-transform active:scale-98">
                CRM <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Traders</span>
              </h3>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-sm mb-8 font-light">
              Elevating your lifestyle since 2007. We curate premium products delivered with an unparalleled experience.
            </p>
            
            {/* Social Media Handlers */}
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label} 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 group"
                >
                  <div className="group-hover:scale-110 transition-transform">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            {/* Links Group 1 - Company */}
            <div className="flex flex-col">
              <h4 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Company</h4>
              <ul className="space-y-4">
                {companyLinks.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      className="relative footer-link text-gray-400 hover:text-white transition-colors duration-300 py-1 inline-block text-sm sm:text-base font-light"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Group 2 - Support */}
            <div className="flex flex-col">
              <h4 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Support</h4>
              <ul className="space-y-4">
                {supportLinks.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      className="relative footer-link text-gray-400 hover:text-white transition-colors duration-300 py-1 inline-block text-sm sm:text-base font-light"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links Group 3 - Legal & Contact */}
            <div className="flex flex-col col-span-2 md:col-span-1">
              <h4 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Legal & Contact</h4>
              <ul className="space-y-4 mb-8">
                {legalLinks.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      className="relative footer-link text-gray-400 hover:text-white transition-colors duration-300 py-1 inline-block text-sm sm:text-base font-light"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Contact Information Elements */}
              <div className="space-y-4 text-sm text-gray-400">
                <p className="flex items-center gap-3 group">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/10 group-hover:text-purple-300 transition-all duration-300">
                    <FiPhone className="w-3.5 h-3.5" />
                  </span>
                  <a href="tel:9899518819" className="hover:text-white transition-colors font-medium">9899518819</a>
                </p>
                <p className="flex items-center gap-3 group">
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/10 group-hover:text-blue-300 transition-all duration-300">
                    <FiMail className="w-3.5 h-3.5" />
                  </span>
                  <a href="mailto:crmtraders25@gmail.com" className="hover:text-white transition-colors font-medium max-w-[180px] sm:max-w-none truncate">
                    crmtraders25@gmail.com
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-light">
            © {new Date().getFullYear()} CRM Traders. All rights reserved.
          </p>
          <div className="flex gap-2 text-gray-600 text-xs font-semibold uppercase tracking-widest">
            <span>Designed for excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;