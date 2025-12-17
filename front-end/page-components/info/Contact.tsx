"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/user/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent! We'll get back to you soon.");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("Send message error:", error);
        toast.error(error.error || Array.isArray(error) ? error.join(", ") : "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have a question or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Contact Information Cards */}
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg ">
                        <MapPin className="h-6 w-6 text-accent " />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Visit Our Store</h3>
                      <p className="text-muted-foreground">
                        Perfume City<br />
                        Luxury District<br />
                        111 Nizami St, Baku, Azerbaijan
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg ">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                      <p className="text-muted-foreground">
                        +1 (555) 123-4567<br />
                        Mon-Fri: 10:00 AM - 9:00 PM 
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg ">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                      <p className="text-muted-foreground">
                        info@essence-perfume.com<br />
                        support@essence-perfume.com
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg ">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Working Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Monday - Friday: 10:00 AM - 9:00 PM</p>
                        <p>Saturday: 10:00 AM - 9:00 PM</p>
                        <p>Sunday: 10:00 AM - 9:00 PM</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input 
                        id="fullName" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        className="mt-1" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      rows={6} 
                      className="mt-1 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Map */}
            <Card className="overflow-hidden">
              <div className="aspect-21/9 bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1519.3499602501174!2d49.860203271563726!3d40.39334288129831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sen!2saz!4v1760629854498!5m2!1sen!2saz"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                />
              </div>
            </Card>
          </div>
        </section>

  
  );

}


