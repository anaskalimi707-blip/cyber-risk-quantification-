import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';

interface CustomReportBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateReport: (title: string, sections: string[]) => void;
}

export const CustomReportBuilderModal: React.FC<CustomReportBuilderModalProps> = ({
  isOpen,
  onClose,
  onGenerateReport
}) => {
  const [title, setTitle] = useState<string>('Q3 2026 Customized Board Risk Statement');
  const [reportType, setReportType] = useState<string>('Board Level Statement');
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'Executive Money at Risk & Exposure Summary',
    'FAIR Scenario Distribution & Loss Exceedance Curves',
    'Capital Allocation & PuLP MIP Knapsack ROI',
    'SEBI CSCRF & NIST 2.0 Compliance Gaps'
  ]);

  if (!isOpen) return null;

  const availableSections = [
    'Executive Money at Risk & Exposure Summary',
    'FAIR Scenario Distribution & Loss Exceedance Curves',
    'Capital Allocation & PuLP MIP Knapsack ROI',
    'SEBI CSCRF & NIST 2.0 Compliance Gaps',
    'Supply Chain & Third-Party Vendor Risk Matrix',
    'Live Telemetry & Asset Vulnerability Breakdown',
    'Historical Resilience & Empirical Incident Audit Ledger'
  ];

  const toggleSection = (sec: string) => {
    if (selectedSections.includes(sec)) {
      setSelectedSections(prev => prev.filter(s => s !== sec));
    } else {
      setSelectedSections(prev => [...prev, sec]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onGenerateReport(title, selectedSections);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-card w-full max-w-xl rounded-lg shadow-2xl border border-line overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line bg-paper flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-teal/10 text-teal border border-teal/20">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink m-0 font-serif">Enterprise Custom Report Builder</h2>
              <p className="text-xs text-sub m-0">Modular Board Dossier & Statement Generator</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-sub hover:text-ink hover:bg-line/50 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text mb-1">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1">Target Audience Persona</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full text-xs p-2.5 rounded border border-line bg-card text-text focus:outline-none focus:ring-1 focus:ring-ink"
            >
              <option value="Board Level Statement">Board Risk Committee & Audit Panel</option>
              <option value="CISO Strategic Pack">CISO & Security Leadership</option>
              <option value="CFO Actuarial Review">CFO & Risk Underwriters</option>
              <option value="Regulatory Filing">SEBI / RBI Regulatory Auditor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-2">Include Modular Sections</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {availableSections.map((sec) => {
                const isSelected = selectedSections.includes(sec);
                return (
                  <div
                    key={sec}
                    onClick={() => toggleSection(sec)}
                    className={`p-2 rounded border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-teal/5 border-teal/30 text-ink font-medium' 
                        : 'bg-card border-line text-sub hover:border-slate-400'
                    }`}
                  >
                    <span>{sec}</span>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-line text-teal focus:ring-0"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-line flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-sub hover:text-ink rounded border border-line hover:bg-paper transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal hover:bg-teal/90 rounded shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText size={13} />
              <span>Generate & Preview Statement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
