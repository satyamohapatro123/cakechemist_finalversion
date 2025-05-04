
import { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Mail, Clock, MapPin, Globe } from "lucide-react";

interface ContactInfo {
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  googleMapUrl: string;
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "123 Bakery Street, Baking District",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 98765 43210",
    email: "info@cakechemist.com",
    website: "www.cakechemist.com",
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1651052186532!5m2!1sen!2sin",
    workingHours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "Closed"
    },
    socialMedia: {
      facebook: "https://facebook.com/cakechemist",
      instagram: "https://instagram.com/cakechemist",
      twitter: "https://twitter.com/cakechemist"
    }
  });

  // Load contact info from localStorage
  useEffect(() => {
    const loadContactInfo = () => {
      const storedContactInfo = localStorage.getItem('contactInfo');
      if (storedContactInfo) {
        setContactInfo(JSON.parse(storedContactInfo));
      }
    };

    loadContactInfo();

    // Listen for contact info updates
    const handleContactInfoUpdated = () => {
      loadContactInfo();
    };

    window.addEventListener('contactInfoUpdated', handleContactInfoUpdated);

    return () => {
      window.removeEventListener('contactInfoUpdated', handleContactInfoUpdated);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    // For now, we'll just show a success toast
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <main>
      {/* Contact Banner */}
      <section className="relative py-20 bg-bakery-100">
        <div className="container-custom">
          <SectionHeading
            title="Contact Us"
            subtitle="We'd love to hear from you"
            center
          />
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-serif mb-6">Get In Touch</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-bakery-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-bakery-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Visit Us</h4>
                    <address className="not-italic mt-1">
                      {contactInfo.address}<br />
                      {contactInfo.city}, {contactInfo.state} {contactInfo.pincode}
                    </address>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-bakery-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-bakery-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Call Us</h4>
                    <p className="mt-1">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-bakery-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-bakery-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Email Us</h4>
                    <p className="mt-1">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-bakery-100 p-3 rounded-full mr-4">
                    <Globe className="h-6 w-6 text-bakery-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Website</h4>
                    <p className="mt-1">{contactInfo.website}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-bakery-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-bakery-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Hours</h4>
                    <div className="mt-1 space-y-1">
                      <p>Monday: {contactInfo.workingHours.monday}</p>
                      <p>Tuesday: {contactInfo.workingHours.tuesday}</p>
                      <p>Wednesday: {contactInfo.workingHours.wednesday}</p>
                      <p>Thursday: {contactInfo.workingHours.thursday}</p>
                      <p>Friday: {contactInfo.workingHours.friday}</p>
                      <p>Saturday: {contactInfo.workingHours.saturday}</p>
                      <p>Sunday: {contactInfo.workingHours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 h-64 bg-gray-200 rounded-md">
                <div className="w-full h-full rounded-md overflow-hidden">
                  <iframe
                    src={contactInfo.googleMapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map"
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-serif mb-6">Send Us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="I'd like to inquire about..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
