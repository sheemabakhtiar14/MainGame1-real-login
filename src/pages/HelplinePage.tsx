import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

interface GovernmentResource {
  name: string;
  number: string;
  description: string;
  website?: string;
  availability: string;
}

const HelplinePage: React.FC = () => {
  // Government helplines and resources
  const governmentResources: GovernmentResource[] = [
    {
      name: "National Cyber Crime Reporting Portal",
      number: "1930",
      description: "Report cybercrime and online fraud",
      website: "https://cybercrime.gov.in",
      availability: "24/7",
    },
    {
      name: "Consumer Helpline",
      number: "1915",
      description: "Report consumer fraud and complaints",
      website: "https://consumerhelpline.gov.in",
      availability: "24/7",
    },
    {
      name: "Banking Ombudsman",
      number: "14448",
      description: "Report banking fraud and disputes",
      website: "https://cms.rbi.org.in",
      availability: "Mon-Fri 10AM-6PM",
    },
    {
      name: "Reserve Bank of India (RBI)",
      number: "14440",
      description: "Report financial fraud and scams",
      website: "https://rbi.org.in",
      availability: "Mon-Fri 10AM-6PM",
    },
    {
      name: "Telecom Regulatory Authority",
      number: "198",
      description: "Report telecom fraud and spam calls",
      website: "https://trai.gov.in",
      availability: "24/7",
    },
    {
      name: "Police Emergency",
      number: "100",
      description: "Emergency police assistance",
      availability: "24/7",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Government Helplines
        </h1>
        <p className="text-xl text-gray-300">
          Quick access to official government numbers and portals to report
          scams
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-l-4 border-orange-500 text-white p-4 rounded-lg mb-8 shadow-lg">
        <div className="flex items-center">
          <div className="text-2xl mr-3">🚨</div>
          <div>
            <h3 className="font-bold">Emergency? Call 100 immediately!</h3>
            <p className="text-sm">
              If you're in immediate danger or need urgent police assistance
            </p>
          </div>
        </div>
      </div>

      {/* Community Section Link */}
      <div className="mb-8">
        <Card className="p-6 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                👥 Community Reports
              </h3>
              <p className="text-gray-300">
                Join our community to report scams and help protect others in
                real-time
              </p>
            </div>
            <Link to="/community">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400">
                Visit Community →
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Government Resources */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          🏛️ Official Government Resources
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {governmentResources.map((resource, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {resource.name}
                </h3>
                <span className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {resource.number}
                </span>
              </div>
              <p className="text-gray-300 mb-3">{resource.description}</p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-green-400">
                  📞 {resource.availability}
                </span>
                {resource.website && (
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Visit Website
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(`tel:${resource.number}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  📞 Call Now
                </Button>
                {resource.website && (
                  <Button
                    onClick={() => window.open(resource.website, "_blank")}
                    variant="secondary"
                    className="flex-1"
                  >
                    🌐 Website
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          💡 Quick Reporting Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-gray-300">
            <li>• Keep records of all communications</li>
            <li>• Don't share personal information with unknown contacts</li>
            <li>• Screenshot evidence before reporting</li>
          </ul>
          <ul className="space-y-2 text-gray-300">
            <li>• Report immediately to prevent others from being scammed</li>
            <li>• File a police complaint for financial losses</li>
            <li>• Block suspicious numbers and email addresses</li>
          </ul>
        </div>
      </Card>

      {/* Additional Resources */}
      <Card className="mt-6 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          📚 Additional Resources
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="font-semibold text-white mb-1">Prevention Tips</h4>
            <p className="text-sm text-gray-300">
              Learn how to identify and avoid common scams
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📞</div>
            <h4 className="font-semibold text-white mb-1">Quick Dial</h4>
            <p className="text-sm text-gray-300">
              Save important numbers for easy access
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-semibold text-white mb-1">Community Support</h4>
            <p className="text-sm text-gray-300">
              Get help from experienced community members
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HelplinePage;
