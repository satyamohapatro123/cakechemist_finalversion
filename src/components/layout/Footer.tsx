
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-bakery-100 text-bakery-800 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-handwriting text-2xl mb-4 text-bakery-800">Sweet Delights</h3>
            <p className="mb-4 text-bakery-700">
              Hand-crafted delicious treats baked fresh daily. Made with love and the finest ingredients.
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
              <p>123 Baker Street, Sweetville</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: hello@sweetdelights.com</p>
              <p>Hours: Mon-Fri: 7am-7pm, Sat-Sun: 8am-5pm</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-bakery-200 pt-8">
          <p className="text-center text-bakery-600">© {new Date().getFullYear()} Sweet Delights Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
