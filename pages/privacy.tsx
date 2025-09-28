import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NavigationTab } from '@/types';

export default function PrivacyPolicy() {
  const handleTabChange = (tab: NavigationTab) => {
    // Redirect to home page for navigation
    window.location.href = '/';
  };

  return (
    <>
      <Head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MEE4YRMFZL"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MEE4YRMFZL');
            `,
          }}
        />
        
        <title>Privacy Policy - Baby Names Analysis</title>
        <meta name="description" content="Learn about our privacy policy and how we protect your data when using our baby name analysis platform with numerology, astrology, and phonology features." />
        <meta name="keywords" content="privacy policy baby names, data protection numerology analysis, astrology names privacy" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header activeTab="suggestions" onTabChange={handleTabChange} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Account information (name, email address)</li>
                <li>• Names you analyze and save as favorites</li>
                <li>• Usage data and preferences</li>
                <li>• Communication data when you contact us</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Provide name analysis and recommendations</li>
                <li>• Save your favorite names and analysis history</li>
                <li>• Improve our algorithms and user experience</li>
                <li>• Communicate with you about our services</li>
                <li>• Ensure the security and integrity of our platform</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share your information 
                in the following circumstances:
              </p>
              <ul className="space-y-2 text-gray-600 mt-4">
                <li>• With your explicit consent</li>
                <li>• To comply with legal obligations</li>
                <li>• To protect our rights and prevent fraud</li>
                <li>• With service providers who assist in our operations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. This 
                includes encryption, secure servers, and regular security audits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate data</li>
                <li>• Delete your account and data</li>
                <li>• Export your data</li>
                <li>• Opt out of certain communications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and provide personalized content. You can control cookie settings through your browser, 
                though some features may not function properly if cookies are disabled.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "Last Updated" date. We encourage 
                you to review this policy periodically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 text-gray-600">
                <p>Email: privacy@babynames.com</p>
                <p>Last Updated: December 2024</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      </div>
    </>
  );
}
