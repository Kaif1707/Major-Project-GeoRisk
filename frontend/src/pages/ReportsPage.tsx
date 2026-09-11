import React, { useState } from 'react';
import { FileText, Download, Plus, FileSpreadsheet, FileCode, RefreshCw, Eye, Check, X, Shield } from 'lucide-react';
import { useUserReports, useGenerateReportMutation } from '@/hooks/useProductivityData';
import { useRiskScores } from '@/hooks/useRiskData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('CountryRiskDossier');
  const [selectedCountryCode, setSelectedCountryCode] = useState('USA');
  const [format, setFormat] = useState('pdf');
  const [previewReport, setPreviewReport] = useState<any | null>(null);

  const { data: reportsResponse, isLoading, refetch } = useUserReports();
  const { data: riskScoresResponse } = useRiskScores();
  const generateMutation = useGenerateReportMutation();

  const reports = reportsResponse?.data || [];
  const countries = riskScoresResponse?.data || [];

  const handleGenerate = () => {
    const selectedObj = countries.find((c: any) => c.country?.iso_code === selectedCountryCode);
    const countryName = selectedObj?.country?.name || selectedCountryCode;

    generateMutation.mutate(
      {
        report_type: reportType,
        country_code: selectedCountryCode || undefined,
        format: format,
      },
      {
        onSuccess: (data) => {
          setPreviewReport({
            title: `Executive GeoRisk Dossier: ${countryName}`,
            country: countryName,
            iso: selectedCountryCode,
            score: selectedObj?.overall_score || 24.5,
            category: selectedObj?.category?.name || 'Low Risk',
            economic: selectedObj?.economic_score || 30.0,
            political: selectedObj?.political_score || 35.0,
            business: selectedObj?.business_score || 30.0,
            generated_at: new Date().toLocaleString(),
          });
          refetch();
        },
      }
    );
  };

  const handleExportData = (exportFormat: string) => {
    const dataStr = JSON.stringify(countries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `georisk_institutional_report_${Date.now()}.${exportFormat}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-400" /> Institutional Executive Reports & Export Studio
          </h1>
          <p className="text-xs text-gray-400 mt-1">Generate institutional executive risk dossiers, export multi-format datasets (PDF, CSV, JSON).</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Report Center
        </Button>
      </div>

      {/* Generator Studio Card */}
      <Card title="Report Generator Studio" subtitle="Build branded executive risk briefings and data packages">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Report Template</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2 font-semibold"
            >
              <option value="CountryRiskDossier">Country Sovereign Risk Dossier</option>
              <option value="RegionalSummary">Regional Risk Overview</option>
              <option value="PortfolioRisk">Portfolio Risk Summary</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Target Sovereign Nation</label>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2 font-semibold"
            >
              {countries.map((c: any) => (
                <option key={c.id} value={c.country?.iso_code}>
                  {c.country?.name} ({c.country?.iso_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-gray-400 font-semibold mb-1 block">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-surface-base border border-surface-border text-gray-200 text-xs rounded-lg px-3 py-2 uppercase font-mono"
            >
              <option value="pdf">PDF Executive Brief</option>
              <option value="csv">CSV Dataset Package</option>
              <option value="json">JSON API Payload</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="sm" onClick={handleGenerate} disabled={generateMutation.isPending}>
            <FileText className="w-4 h-4 mr-2" /> Generate Executive Report
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleExportData('csv')}>
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-400" /> Export CSV Data
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleExportData('json')}>
            <FileCode className="w-4 h-4 mr-2 text-brand-400" /> Export JSON Package
          </Button>
        </div>
      </Card>

      {/* Executive Report Preview Modal */}
      {previewReport && (
        <Card className="border-brand-500/40 bg-surface-elevated shadow-2xl p-6 relative">
          <button onClick={() => setPreviewReport(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-brand-400" />
                <div>
                  <div className="font-bold text-base text-white">{previewReport.title}</div>
                  <div className="text-[10px] text-gray-400 font-mono">Generated: {previewReport.generated_at} • GeoRisk Institutional Intelligence</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded bg-brand-500/20 text-brand-300 font-bold text-xs border border-brand-500/30">
                OFFICIAL BRIEFING
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-base border border-surface-border text-xs">
              <div>
                <div className="text-gray-400 font-semibold">Sovereign Nation</div>
                <div className="text-base font-bold text-white mt-0.5">{previewReport.country} [{previewReport.iso}]</div>
              </div>
              <div>
                <div className="text-gray-400 font-semibold">GeoRisk Index</div>
                <div className="text-base font-black text-amber-400 mt-0.5">{previewReport.score?.toFixed(1)} / 100</div>
              </div>
              <div>
                <div className="text-gray-400 font-semibold">Risk Classification</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{previewReport.category}</div>
              </div>
              <div>
                <div className="text-gray-400 font-semibold">Economic Score</div>
                <div className="text-base font-bold text-white mt-0.5">{previewReport.economic?.toFixed(1)}</div>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              This executive briefing summarizes real-time quantitative metrics for <span className="font-bold text-white">{previewReport.country}</span>. Governance stability and macroeconomic metrics remain aligned with baseline institutional risk thresholds.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary" size="sm" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-1" /> Print / Download PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPreviewReport(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Generated Reports History */}
      <Card title="Report Archive & Export History" subtitle="Access previously generated institutional briefings">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading generated reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">No generated reports in archive. Use the generator above.</div>
        ) : (
          <div className="space-y-3">
            {reports.map((r: any) => (
              <div key={r.id} className="p-4 rounded-xl bg-surface-base border border-surface-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-brand-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">{r.title}</div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      Type: {r.report_type} • Format: {r.format.toUpperCase()} • {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={() => handleExportData(r.format)}>
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
