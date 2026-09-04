import { RiskScenario } from '../types';

const csvSafeText = (value: string | number) => {
  const text = String(value);
  const formulaSafeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${formulaSafeText.replace(/"/g, '""')}"`;
};

export const createRiskLedgerCsv = (scenarios: RiskScenario[]) => {
  const headers = [
    'Scenario ID',
    'Risk Scenario',
    'Business Service',
    'Threat Actor',
    'Expected Annual Loss (INR)',
    'Expected Annual Loss (Display)',
    '95th Percentile Loss',
    'Annual Probability (%)',
    'Status',
    'Confidence',
    'Attack Path Steps',
    'Last Calculated',
  ];

  const rows = scenarios.map((scenario) => [
    scenario.id,
    scenario.name,
    scenario.businessService,
    scenario.threatActor,
    scenario.expectedAnnualLoss,
    scenario.expectedAnnualLossFormatted,
    scenario.p95LossFormatted,
    (scenario.probability * 100).toFixed(0),
    scenario.status,
    scenario.confidence,
    scenario.attackPathNodes.length,
    scenario.lastCalculated,
  ]);

  return [headers, ...rows]
    .map((row) => row.map(csvSafeText).join(','))
    .join('\r\n');
};

export const downloadRiskLedgerCsv = (scenarios: RiskScenario[], filename: string) => {
  const blob = new Blob(['\uFEFF', createRiskLedgerCsv(scenarios)], { type: 'text/csv;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
};
