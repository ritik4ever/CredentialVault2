"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Zap, Lock, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)",
        minHeight: "100vh",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Navigation */}
      <nav
        className="relative z-50 border-b border-white/10"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-xl"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  boxShadow:
                    "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                }}
              >
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CredentialVault</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors font-medium">
                How it Works
              </a>
              <a href="#security" className="text-gray-300 hover:text-white transition-colors font-medium">
                Security
              </a>
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  className="text-white hover:bg-white/10 bg-transparent"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.5)",
                    color: "white",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: "0 8px 24px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="font-semibold"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    color: "black",
                    boxShadow: "0 8px 32px rgba(255, 255, 255, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.8)",
                    border: "2px solid rgba(255, 255, 255, 0.9)",
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge
            className="mb-6 px-4 py-2 text-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              color: "white",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow:
                "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              borderRadius: "50px",
            }}
          >
            Powered by Blockchain Technology
          </Badge>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ color: "white", textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Secure Your Digital
            <span
              className="block"
              style={{
                background: "linear-gradient(to right, white, #d1d5db)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
              }}
            >
              Credentials Forever
            </span>
          </h1>
          <p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
            style={{ color: "#d1d5db", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
          >
            CredentialVault is a decentralized platform that puts you in complete control of your digital credentials.
            Issue, verify, and manage certificates with unmatched security and transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="font-semibold px-8 py-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  color: "black",
                  boxShadow: "0 12px 40px rgba(255, 255, 255, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.8)",
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                  borderRadius: "12px",
                }}
              >
                Start Building <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 bg-transparent"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  color: "white",
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  boxShadow: "0 8px 24px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                }}
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "white", textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              Why Choose CredentialVault?
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#d1d5db", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
            >
              Built on cutting-edge blockchain technology to ensure your credentials are secure, verifiable, and always
              accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Decentralized Security",
                description:
                  "Your credentials are stored on the blockchain, ensuring they can never be lost, tampered with, or controlled by a single entity.",
              },
              {
                icon: Zap,
                title: "Instant Verification",
                description:
                  "Verify credentials in seconds with cryptographic proof. No need to contact issuing institutions or wait for manual verification.",
              },
              {
                icon: Users,
                title: "Universal Access",
                description:
                  "Access your credentials from anywhere in the world. Share them with employers, institutions, or anyone who needs to verify them.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="transition-all duration-300 group hover:scale-105"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(30px) saturate(180%)",
                  WebkitBackdropFilter: "blur(30px) saturate(180%)",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  boxShadow:
                    "0 16px 48px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                }}
              >
                <CardHeader className="p-6">
                  <div
                    className="p-3 rounded-xl w-fit mb-4 group-hover:bg-white/35 transition-colors"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      border: "2px solid rgba(255, 255, 255, 0.5)",
                      boxShadow:
                        "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(15px) saturate(180%)",
                      WebkitBackdropFilter: "blur(15px) saturate(180%)",
                    }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle
                    className="text-xl font-bold mb-3"
                    style={{ color: "white", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                  >
                    {feature.title}
                  </CardTitle>
                  <CardDescription
                    className="leading-relaxed"
                    style={{ color: "#d1d5db", textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                  >
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "white", textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              How It Works
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#d1d5db", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
            >
              Simple steps to secure and verify your digital credentials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Issue Credentials",
                description:
                  "Educational institutions, employers, or certification bodies issue digital credentials directly to the blockchain.",
              },
              {
                number: "2",
                title: "Store Securely",
                description:
                  "Credentials are cryptographically secured and stored on the decentralized network, ensuring permanent accessibility.",
              },
              {
                number: "3",
                title: "Verify Instantly",
                description:
                  "Anyone can verify the authenticity of credentials instantly using cryptographic proof, without contacting the issuer.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/35 transition-colors"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    border: "2px solid rgba(255, 255, 255, 0.5)",
                    boxShadow:
                      "0 12px 40px rgba(255, 255, 255, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  }}
                >
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: "white", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                >
                  {step.title}
                </h3>
                <p className="leading-relaxed" style={{ color: "#d1d5db", textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: "white", textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                Enterprise-Grade Security
              </h2>
              <p className="text-lg mb-8" style={{ color: "#d1d5db", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}>
                Built with the highest security standards to protect your most important credentials.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "End-to-End Encryption",
                    description: "All data is encrypted using industry-standard cryptographic algorithms.",
                  },
                  {
                    title: "Immutable Records",
                    description: "Once issued, credentials cannot be altered or deleted, ensuring permanent integrity.",
                  },
                  {
                    title: "Decentralized Storage",
                    description: "No single point of failure with distributed blockchain infrastructure.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        border: "2px solid rgba(255, 255, 255, 0.4)",
                        boxShadow: "0 4px 20px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                      }}
                    >
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4
                        className="text-lg font-bold mb-2"
                        style={{ color: "white", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-gray-300" style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card
                className="p-8 text-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(25px)",
                  WebkitBackdropFilter: "blur(25px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                <div
                  className="p-4 rounded-xl w-fit mx-auto mb-6"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "0 6px 28px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                  }}
                >
                  <Lock className="h-16 w-16 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "white", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}
                >
                  Your Data, Your Control
                </h3>
                <p className="text-gray-300" style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}>
                  You own your credentials completely. No third party can access, modify, or delete them without your
                  permission.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-10 py-16 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ color: "white", textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Ready to Secure Your Credentials?
          </h2>
          <p className="text-lg mb-8" style={{ color: "#d1d5db", textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)" }}>
            Join thousands of users who trust CredentialVault to protect their digital credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="font-semibold px-8 py-3"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  boxShadow: "0 6px 24px rgba(255, 255, 255, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                }}
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 bg-transparent"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  color: "white",
                  backdropFilter: "blur(15px)",
                  WebkitBackdropFilter: "blur(15px)",
                  boxShadow: "0 4px 16px rgba(255, 255, 255, 0.1)",
                }}
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer
        className="relative z-10 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          borderTop: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-white" />
                <span className="font-bold text-white">CredentialVault</span>
              </div>
              <p className="text-gray-300 text-sm">Secure, decentralized credential management for the digital age.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3" style={{ color: "white" }}>
                Product
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#security" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3" style={{ color: "white" }}>
                Company
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3" style={{ color: "white" }}>
                Support
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-300 text-sm">
            <p>&copy; 2025 CredentialVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
