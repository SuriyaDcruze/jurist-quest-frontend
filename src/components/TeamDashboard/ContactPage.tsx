"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone } from "lucide-react"

const ContactPage = () => {
  const handleEmailGeneralInquiries = () => {
    window.location.href = "mailto:info@juristquest.com"
  }

  const handleEmailCustomerSupport = () => {
    window.location.href = "mailto:customersupport@juristquest.com"
  }

  const handleEmailSponsorship = () => {
    window.location.href = "mailto:partners@juristquest.com"
  }

  const handleCallGeneralSponsorship = () => {
    window.location.href = "tel:+919677873855"
  }

  const handleCallCustomerSupport = () => {
    window.location.href = "tel:+919677883855"
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* New Contact Cards Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* General Inquiries */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-8 w-8 text-[#2d4817]" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">General Inquiries</h3>
                  <p className="text-sm text-gray-600">For general questions</p>
                  <p className="text-sm text-gray-600">info@juristquest.com</p>
                </div>
              </div>
              <Button
                className="w-full bg-[#2d4817] hover:bg-[#2a4015] text-white"
                onClick={handleEmailGeneralInquiries}
              >
                Send Mail
              </Button>
            </CardContent>
          </Card>

          {/* Customer Support mail */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-8 w-8 text-[#2d4817]" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Customer Support Mail</h3>
                  <p className className="text-sm text-gray-600">
                    For customer assistance via email
                  </p>
                  <p className className="text-sm text-gray-600">
                    customersupport@juristquest.com
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-[#2d4817] hover:bg-[#2a4015] text-white"
                onClick={handleEmailCustomerSupport}
              >
                Send Mail
              </Button>
            </CardContent>
          </Card>

          {/* Sponsorship / Partnership */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-8 w-8 text-[#2d4817]" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Sponsorship / Partnership</h3>
                  <p className="text-sm text-gray-600">For collaboration opportunities</p>
                  <p className="text-sm text-gray-600">partners@juristquest.com</p>
                </div>
              </div>
              <Button className="w-full bg-[#2d4817] hover:bg-[#2a4015] text-white" onClick={handleEmailSponsorship}>
                Send Mail
              </Button>
            </CardContent>
          </Card>

          {/* General Inquiry / Sponsorship / Partnership Call */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Phone className="h-8 w-8 text-[#2d4817]" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">General Inquiry / Sponsorship / Partnership</h3>
                  <p className="text-sm text-gray-600">Call for general or partnership inquiries</p>
                  <p className="text-sm text-gray-600">+919677873855</p>
                </div>
              </div>
              <Button
                className="w-full bg-[#2d4817] hover:bg-[#2a4015] text-white"
                onClick={handleCallGeneralSponsorship}
              >
                Call
              </Button>
            </CardContent>
          </Card>

          {/* Customer Support call */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Phone className="h-8 w-8 text-[#2d4817]" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Customer Support Call</h3>
                  <p className="text-sm text-gray-600">Call for immediate customer assistance</p>
                  <p className="text-sm text-gray-600">+919677883855</p>
                </div>
              </div>
              <Button className="w-full bg-[#2d4817] hover:bg-[#2a4015] text-white" onClick={handleCallCustomerSupport}>
                Call
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Find Us / Our Location Section with Embedded Map */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h1>
        <Card className="bg-white shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <p className="text-gray-700 p-4 text-left">
              7th Floor, Centre Point, 2/4, Mount Pollamallee High Road, Manapakkam, Porur, Chennai, Tamil Nadu 600089
            </p>
            <iframe
              src="https://www.google.com/maps?q=7th+Floor,+Centre+Point,+2/4,+Mount+Pollamallee+High+Road,+Manapakkam,+Porur,+Chennai,+Tamil+Nadu+600089&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location on Google Maps"
            ></iframe>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ContactPage
