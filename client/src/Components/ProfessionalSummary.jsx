import { Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../config/api";
import toast from "react-hot-toast";

const ProfessionalSummary = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    try {
      setIsGenerating(true);

      const prompt = `Enhance my professional summary: "${data}"`;

      const response = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onChange(response.data.enhancedContent); // 🔥 FIXED
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">Add summary for your resume</p>
        </div>

        <button
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 
                     text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
          disabled={isGenerating}
          onClick={generateSummary}
        >
          {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <textarea
        value={data || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-40 p-3 border text-sm border-gray-300 rounded-lg"
        placeholder="Write your professional summary..."
      />
    </div>
  );
};

export default ProfessionalSummary;
