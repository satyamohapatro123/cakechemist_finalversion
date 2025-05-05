
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Beaker } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-bakery-100 text-bakery-800 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center bg-bakery-600 text-white rounded-full w-8 h-8">
                <Beaker className="h-5 w-5" />
              </div>
              <h3 className="font-handwriting text-2xl text-bakery-800">CakeChemist</h3>
            </div>
            <p className="mb-4 text-bakery-700">
              Artisanal cakes crafted with scientific precision. Made with premium ingredients and creative passion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-bakery-50 rounded-full hover:bg-bakery-200 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-bakery-50 rounded-full hover:bg-bakery-200 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-bakery-50 rounded-full hover:bg-bakery-200 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-bakery-600 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-bakery-600 transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="hover:text-bakery-600 transition-colors">Shop</Link></li>
              <li><Link to="/recipes" className="hover:text-bakery-600 transition-colors">Recipes</Link></li>
              <li><Link to="/contact" className="hover:text-bakery-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-4">Contact Us</h4>
            <address className="not-italic space-y-3">
              <p>456 Chemistry Lane, Cakeville</p>
              <p>Phone: (555) 987-6543</p>
              <p>Email: hello@cakechemist.com</p>
              <p>Hours: Mon-Fri: 8am-8pm, Sat-Sun: 9am-6pm</p>
            </address>
          </div>
        </div>

        <div className="border-t border-bakery-200 pt-8">
          <p className="text-center text-bakery-600">© {new Date().getFullYear()} CakeChemist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
