# CakeChemist - Bakery E-commerce Platform

![CakeChemist Logo](https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop)

CakeChemist is a comprehensive e-commerce platform for bakeries, offering a seamless shopping experience for customers and powerful management tools for administrators. The platform combines scientific precision with culinary artistry to deliver exceptional baked goods.

## 🌟 Features

### Customer-Facing Features

#### 🛒 Shopping Experience
- **Product Browsing**: Browse products by category with detailed filtering options
- **Product Details**: View comprehensive product information, images, and descriptions
- **Shopping Cart**: Add products to cart with quantity adjustment
- **Cake Customization**: Customize cakes with options for:
  - Egg/eggless options
  - Name on cake
  - Image upload
  - Lactose-free options
  - Vegan/non-vegan options
  - Size selection

#### 🔐 User Authentication
- **User Registration**: Create new accounts with email verification
- **Google Login**: Quick login with Google account
- **User Profiles**: Manage personal information and preferences
- **Order History**: View past orders and their statuses

#### 📦 Checkout Process
- **Automatic Location Detection**: Delivery charges calculated based on user's location
- **Distance-Based Pricing**: Accurate delivery fees based on distance from store
- **Free Delivery Threshold**: Automatic free delivery for orders above a certain amount
- **Coupon Application**: Apply discount coupons during checkout
- **Multiple Payment Options**: Pay with Razorpay, PhonePe, or Google Pay
- **GST Handling**: GST calculation and optional GST number input for B2B orders

#### 📱 User Experience
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Order Tracking**: Real-time updates on order status
- **Email Notifications**: Automated emails for order confirmation and updates

### Admin Features

#### 🧁 Product Management
- **Product CRUD**: Add, edit, view, and delete products
- **Category Management**: Create and manage product categories
- **Image Upload**: Upload and manage product images
- **Inventory Management**: Track product availability

#### 👥 Team Management
- **Team Member Profiles**: Add and manage team member information
- **Role Assignment**: Assign roles and responsibilities
- **Profile Images**: Upload and manage team member photos

#### ⭐ Testimonial Management
- **Customer Reviews**: Add, edit, and manage customer testimonials
- **Rating System**: Track and display customer ratings
- **Testimonial Approval**: Review and approve testimonials before publishing

#### 📝 Content Management
- **About Page Editor**: Edit "Our Story" and "Our Values" sections with images
- **Contact Information**: Manage store address, working hours, and contact details
- **Recipe Management**: Add and manage recipes with images and videos
- **Gallery Management**: Create and manage photo galleries

#### 💰 Pricing Management
- **Dietary Options Pricing**: Set pricing for special dietary requirements
- **Tax Settings**: Configure GST percentage and business GST number
- **Delivery Charges**: Set up location-based delivery pricing
  - Base delivery charge
  - Charge per kilometer
  - Maximum delivery distance
  - Free delivery threshold
- **Store Location**: Configure store location for delivery calculations
- **Packaging Options**: Set pricing for different packaging types

#### 🏷️ Coupon Management
- **Coupon Creation**: Create discount coupons with various parameters
- **Usage Limits**: Set usage limits per customer
- **Expiry Dates**: Configure coupon validity periods
- **Minimum Order Value**: Set minimum order requirements for coupons

#### 📊 Financial Dashboard
- **Sales Analytics**: Track daily/weekly/monthly/yearly sales
- **Expense Tracking**: Monitor business expenses
- **Coupon Performance**: Analyze coupon usage and impact
- **Profit Calculation**: View profit margins and financial health

#### 🧾 Invoice Management
- **Automated Invoicing**: Generate professional invoices automatically
- **GST Handling**: Include GST details for tax compliance
- **Business Information**: Customize invoice with business details
- **Download & Print**: Easy invoice download and printing options

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/satyamohapatro123/cakechemist_finalversion.git

# Navigate to the project directory
cd cakechemist_finalversion

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Admin Access
To access the admin panel, navigate to `/admin` and use the following credentials:
- **Username**: admin@cakechemist.com
- **Password**: admin123

## 🔧 Technologies Used

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **React Router**: For navigation and routing
- **React Hook Form**: Form validation and handling
- **Zod**: Schema validation

### State Management & Data Handling
- **Context API**: For global state management
- **localStorage**: For persistent data storage (development)
- **Custom Hooks**: For reusable logic

### UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability
- **Toast Notifications**: User feedback system
- **Modal Dialogs**: For interactive prompts
- **Form Validation**: Client-side validation

## 📱 Responsive Design

CakeChemist is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop computers

## 🔜 Upcoming Features

### Deployment & Infrastructure
- **Firebase Integration**: Database, authentication, and storage
- **Vercel/Netlify Deployment**: Production hosting
- **Custom Domain**: Connect to cakechemist.com

### Enhanced Authentication
- **Two-Factor Authentication**: Additional security for admin accounts
- **Social Login Options**: Facebook, Apple login integration
- **Role-Based Access Control**: Different permission levels

### Payment & Marketing
- **Razorpay Integration**: Live payment processing
- **Google Analytics**: User behavior tracking
- **Google AdSense**: Monetization options
- **Meta Marketing Suite**: Facebook and Instagram integration

### Performance & SEO
- **SEO Optimization**: Meta tags and structured data
- **Performance Improvements**: Code splitting and lazy loading
- **PWA Support**: Progressive Web App capabilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Satya Mohapatro - Project Lead & Developer

## 📞 Contact

For inquiries, please contact:
- Email: contact@cakechemist.com
- Website: [www.cakechemist.com](https://www.cakechemist.com)
