
import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

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
                      123 Baker Street<br />
                      Sweetville, CA 12345<br />
                      United States
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-bakery-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-bakery-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Call Us</h4>
                    <p className="mt-1">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-bakery-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-bakery-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Email Us</h4>
                    <p className="mt-1">hello@sweetdelights.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-bakery-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-bakery-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Hours</h4>
                    <div className="mt-1">
                      <p>Monday - Friday: 7am - 7pm</p>
                      <p>Saturday - Sunday: 8am - 5pm</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="mt-8 h-64 bg-gray-200 rounded-md">
                <div className="w-full h-full rounded-md overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0976610169116!2d-122.42047812393132!3d37.77059741443188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5358da5!2sHayes%20Valley%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1718110503907!5m2!1sen!2sus"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Map"
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
