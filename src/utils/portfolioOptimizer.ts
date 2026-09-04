import { InvestmentOption } from '../types';

export type PortfolioObjective = 'risk-reduction' | 'roi' | 'risk-appetite';

export interface PortfolioOptimizationInput {
  investments: InvestmentOption[];
  budget: number;
  baselineLoss: number;
  riskAppetite: number;
  objective: PortfolioObjective;
  requiredInvestmentIds?: string[];
}

export interface PortfolioRecommendation {
  selectedInvestments: InvestmentOption[];
  totalCost: number;
  nominalRiskReduction: number;
  expectedRiskReduction: number;
  residualRisk: number;
  riskReductionRoi: number;
  budgetUtilizationPct: number;
  implementationDays: number;
  meetsRiskAppetite: boolean;
  isFeasible: boolean;
  reason?: string;
  sensitivityRange: { downsideResidualRisk: number; upsideResidualRisk: number };
}

const OVERLAP_DISCOUNT = 0.88;

const evaluatePortfolio = (
  selectedInvestments: InvestmentOption[],
  baselineLoss: number,
  budget: number,
  riskAppetite: number,
): PortfolioRecommendation => {
  const totalCost = selectedInvestments.reduce((total, investment) => total + investment.initialCost, 0);
  const nominalRiskReduction = selectedInvestments.reduce(
    (total, investment) => total + investment.expectedRiskReduction,
    0,
  );
  const expectedRiskReduction = Math.min(
    baselineLoss,
    nominalRiskReduction * (selectedInvestments.length > 1 ? OVERLAP_DISCOUNT : 1),
  );
  const residualRisk = Math.max(0, baselineLoss - expectedRiskReduction);
  const riskReductionRoi = totalCost > 0 ? ((expectedRiskReduction - totalCost) / totalCost) * 100 : 0;

  return {
    selectedInvestments,
    totalCost,
    nominalRiskReduction,
    expectedRiskReduction,
    residualRisk,
    riskReductionRoi,
    budgetUtilizationPct: budget > 0 ? (totalCost / budget) * 100 : 0,
    implementationDays: Math.max(0, ...selectedInvestments.map((investment) => investment.implementationDays)),
    meetsRiskAppetite: residualRisk <= riskAppetite,
    isFeasible: true,
    sensitivityRange: {
      downsideResidualRisk: Math.min(baselineLoss, baselineLoss - expectedRiskReduction * 0.75),
      upsideResidualRisk: Math.max(0, baselineLoss - Math.min(baselineLoss, expectedRiskReduction * 1.1)),
    },
  };
};

const compareRiskReduction = (left: PortfolioRecommendation, right: PortfolioRecommendation) => {
  if (left.expectedRiskReduction !== right.expectedRiskReduction) {
    return right.expectedRiskReduction - left.expectedRiskReduction;
  }
  if (left.totalCost !== right.totalCost) return left.totalCost - right.totalCost;
  return left.implementationDays - right.implementationDays;
};

const compareRoi = (left: PortfolioRecommendation, right: PortfolioRecommendation) => {
  if (left.riskReductionRoi !== right.riskReductionRoi) {
    return right.riskReductionRoi - left.riskReductionRoi;
  }
  return compareRiskReduction(left, right);
};

export const optimizePortfolio = ({
  investments,
  budget,
  baselineLoss,
  riskAppetite,
  objective,
  requiredInvestmentIds = [],
}: PortfolioOptimizationInput): PortfolioRecommendation => {
  const requiredIds = new Set(requiredInvestmentIds);
  const requiredCost = investments
    .filter((investment) => requiredIds.has(investment.id))
    .reduce((total, investment) => total + investment.initialCost, 0);

  if (requiredCost > budget) {
    return {
      ...evaluatePortfolio([], baselineLoss, budget, riskAppetite),
      isFeasible: false,
      reason: 'Required controls exceed the available capital budget. Remove a requirement or increase the budget.',
    };
  }

  const candidates: PortfolioRecommendation[] = [];
  const combinations = 2 ** investments.length;

  for (let mask = 0; mask < combinations; mask += 1) {
    const selectedInvestments = investments.filter((_, index) => Boolean(mask & (1 << index)));
    const selectedIds = new Set(selectedInvestments.map((investment) => investment.id));
    const containsRequiredControls = [...requiredIds].every((id) => selectedIds.has(id));
    const totalCost = selectedInvestments.reduce((total, investment) => total + investment.initialCost, 0);

    if (containsRequiredControls && totalCost <= budget) {
      candidates.push(evaluatePortfolio(selectedInvestments, baselineLoss, budget, riskAppetite));
    }
  }

  if (candidates.length === 0) {
    return {
      ...evaluatePortfolio([], baselineLoss, budget, riskAppetite),
      isFeasible: false,
      reason: 'No feasible investment portfolio was found for the supplied constraints.',
    };
  }

  if (objective === 'roi') return [...candidates].sort(compareRoi)[0];

  if (objective === 'risk-appetite') {
    const appetiteCandidates = candidates.filter((candidate) => candidate.meetsRiskAppetite);
    if (appetiteCandidates.length > 0) {
      return appetiteCandidates.sort((left, right) => {
        if (left.totalCost !== right.totalCost) return left.totalCost - right.totalCost;
        return compareRiskReduction(left, right);
      })[0];
    }
  }

  return [...candidates].sort(compareRiskReduction)[0];
};
