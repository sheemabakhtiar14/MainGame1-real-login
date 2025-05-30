import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import { FirebaseService } from "../services/firebaseService";

interface ScamReport {
  id: string;
  type: string;
  description: string;
  location?: string;
  reportedBy: string;
  timestamp: string;
  upvotes: number;
  verified: boolean;
}

const CommunityPage: React.FC = () => {
  const { state } = useUser();
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    type: "",
    description: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  const scamTypes = [
    "Phone/SMS Scam",
    "Email Phishing",
    "Online Shopping Fraud",
    "Investment Scam",
    "Romance Scam",
    "Tech Support Scam",
    "Lottery/Prize Scam",
    "Identity Theft",
    "Other",
  ];

  useEffect(() => {
    loadCommunityReports();
  }, []);

  const loadCommunityReports = async () => {
    try {
      setLoading(true);
      const communityReports = await FirebaseService.getCommunityReports();
      const scamReports: ScamReport[] = communityReports.map((report) => ({
        id: report.id || "",
        type: report.type,
        description: report.description,
        location: report.location,
        reportedBy: report.reportedBy,
        timestamp: report.timestamp,
        upvotes: report.upvotes,
        verified: report.verified,
      }));
      setReports(scamReports);
    } catch (error) {
      console.error("Error loading community reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!state.user || !newReport.type || !newReport.description) {
      return;
    }

    try {
      const report: Omit<ScamReport, "id"> = {
        type: newReport.type,
        description: newReport.description,
        location: newReport.location,
        reportedBy: state.user.username,
        timestamp: new Date().toISOString(),
        upvotes: 0,
        verified: false,
      };

      await FirebaseService.submitCommunityReport(report);
      setNewReport({ type: "", description: "", location: "" });
      setShowReportModal(false);
      loadCommunityReports();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const handleUpvote = async (reportId: string) => {
    if (!state.user) return;

    try {
      await FirebaseService.upvoteCommunityReport(reportId, state.user.id);
      loadCommunityReports();
    } catch (error) {
      console.error("Error upvoting report:", error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      return "Less than an hour ago";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          👥 Scam Community Reports
        </h1>
        <p className="text-xl text-gray-300">
          Share your experiences and help protect others from scams
        </p>
      </div>{" "}
      {/* Statistics Banner */}
      <Card className="p-6 mb-8">
        <div className="text-center">
          <div>
            <div className="text-2xl font-bold text-primary-400">
              {reports.length}
            </div>
            <div className="text-gray-300">Total Reports</div>
          </div>
        </div>
      </Card>
      {/* Action Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Recent Reports</h2>
          <p className="text-gray-400">
            Help others by sharing scam experiences
          </p>
        </div>
        {state.isAuthenticated ? (
          <Button
            onClick={() => setShowReportModal(true)}
            className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 border border-slate-500"
          >
            ⚠️ Report Scam
          </Button>
        ) : (
          <Card className="p-4">
            <p className="text-gray-300 mb-3">Login to report scams</p>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Login
            </Button>
          </Card>
        )}
      </div>
      {/* Reports List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading community reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Reports Yet
            </h3>{" "}
            <p className="text-gray-300 mb-4">
              Be the first to share a scam report and help protect the
              community!
            </p>
            {state.isAuthenticated && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowReportModal(true)}
                  className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 border border-slate-500"
                >
                  Create First Report
                </Button>
              </div>
            )}
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-3 py-1 rounded-full text-sm border border-slate-500">
                    {report.type}
                  </span>
                  {report.verified && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  {formatTimestamp(report.timestamp)}
                </span>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">
                {report.description}
              </p>

              {report.location && (
                <p className="text-gray-400 text-sm mb-4">
                  📍 {report.location}
                </p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  Reported by{" "}
                  <span className="text-white font-medium">
                    {report.reportedBy}
                  </span>
                </span>
                {state.isAuthenticated && (
                  <button
                    onClick={() => handleUpvote(report.id)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    👍 {report.upvotes}
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
      {/* Guidelines Card */}
      <Card className="mt-8 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          💡 Community Guidelines
        </h3>
        <ul className="space-y-2 text-gray-300">
          <li>• Share accurate information about scam experiences</li>
          <li>• Don't include personal sensitive information</li>
          <li>• Be specific about scam tactics and warning signs</li>
          <li>• Upvote helpful reports to increase visibility</li>
          <li>• Report fake or misleading content</li>
        </ul>
      </Card>
      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report a Scam"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Scam Type *</label>
            <select
              value={newReport.type}
              onChange={(e) =>
                setNewReport({ ...newReport, type: e.target.value })
              }
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
            >
              <option value="">Select scam type</option>
              {scamTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">Description *</label>
            <textarea
              value={newReport.description}
              onChange={(e) =>
                setNewReport({ ...newReport, description: e.target.value })
              }
              placeholder="Describe the scam, how it happened, what to watch out for..."
              className="w-full p-3 bg-gray-700 text-white rounded-lg h-32 resize-none"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Location (Optional)</label>
            <Input
              value={newReport.location}
              onChange={(e) =>
                setNewReport({ ...newReport, location: e.target.value })
              }
              placeholder="City, State or general area"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSubmitReport}
              disabled={!newReport.type || !newReport.description}
              className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 disabled:bg-gray-600 border border-slate-500"
            >
              Submit Report
            </Button>
            <Button
              onClick={() => setShowReportModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityPage;
