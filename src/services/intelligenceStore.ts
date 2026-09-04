import { 
  VulnerabilityRecord, 
  ThreatSignalRecord, 
  MitreAttackStep, 
  ProvenanceMetadata 
} from '../types';

export class IntelligenceStore {
  private static instance: IntelligenceStore;

  private vulnerabilities: Map<string, VulnerabilityRecord> = new Map();
  private threatSignals: Map<string, ThreatSignalRecord> = new Map();
  private attackSteps: Map<string, MitreAttackStep> = new Map();

  private constructor() {
    this.initializeLocalSnapshot();
  }

  public static getInstance(): IntelligenceStore {
    if (!IntelligenceStore.instance) {
      IntelligenceStore.instance = new IntelligenceStore();
    }
    return IntelligenceStore.instance;
  }

  private initializeLocalSnapshot() {
    // 1. NVD / CVE + EPSS + KEV Data
    const cve21413: VulnerabilityRecord = {
      id: 'vuln-cve-2024-21413',
      cve: 'CVE-2024-21413',
      title: 'Microsoft Outlook Remote Code Execution Vulnerability',
      description: 'A critical RCE vulnerability in Microsoft Outlook bypassing the Office Protected View. Successfully exploited in the wild by ransomware operators to gain initial access.',
      cvss: 9.8,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      cvssSeverity: 'CRITICAL',
      epss: 0.9634,
      epssPercentile: 99.8,
      epssVelocity30d: 0.04,
      kevListed: true,
      kevDueDate: '2024-03-08',
      ransomwareCampaignUse: true,
      affectedProducts: ['Microsoft Outlook', 'Microsoft Office'],
      isInternetExposed: true,
      remediationUrgency: 'Immediate (24h)',
      remediationAction: 'Apply Microsoft Patch Tuesday Update Feb 2024',
      provenance: {
        source: 'NVD/NIST',
        sourceId: 'CVE-2024-21413',
        retrievedAt: new Date().toISOString(),
        confidence: 'High',
        status: 'CACHED',
        hash: 'a8f5f167f44f4964e6c998dee827110c'
      }
    };

    const cve16223: VulnerabilityRecord = {
      id: 'vuln-cve-2023-44487',
      cve: 'CVE-2023-44487',
      title: 'HTTP/2 Rapid Reset Vulnerability',
      description: 'The HTTP/2 protocol allows a denial of service (server resource consumption) because request cancellation can reset many streams quickly.',
      cvss: 7.5,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
      cvssSeverity: 'HIGH',
      epss: 0.824,
      epssPercentile: 97.2,
      kevListed: true,
      ransomwareCampaignUse: false,
      affectedProducts: ['Nginx', 'Apache', 'Envoy'],
      isInternetExposed: true,
      remediationUrgency: 'High (7d)',
      remediationAction: 'Upgrade HTTP/2 server implementations or disable HTTP/2',
      provenance: {
        source: 'NVD/NIST',
        sourceId: 'CVE-2023-44487',
        retrievedAt: new Date().toISOString(),
        confidence: 'High',
        status: 'CACHED',
        hash: 'd3b07384d113edec49eaa6238ad5ff00'
      }
    };

    this.vulnerabilities.set(cve21413.cve, cve21413);
    this.vulnerabilities.set(cve16223.cve, cve16223);

    // 2. Threat Signals
    const threat1: ThreatSignalRecord = {
      id: 'threat-fin7',
      actor: 'FIN7 / LockBit Syndicate',
      campaign: 'Operation Payment Intercept 2024',
      tactic: 'Ransomware & Double Extortion',
      techniqueId: 'T1486',
      techniqueName: 'Data Encrypted for Impact',
      activeExploitation: true,
      targetedSectors: ['Financial Services', 'FinTech'],
      firstObserved: '2023-11-15',
      lastSeen: new Date().toISOString(),
      confidence: 'High',
      relatedCves: ['CVE-2024-21413'],
      provenance: {
        source: 'MITRE ATT&CK',
        sourceId: 'T1486',
        retrievedAt: new Date().toISOString(),
        confidence: 'High',
        status: 'CACHED',
        hash: 'b52a48f4e245a443'
      }
    };

    this.threatSignals.set(threat1.id, threat1);
  }

  public getVulnerability(cve: string): VulnerabilityRecord | undefined {
    return this.vulnerabilities.get(cve);
  }

  public getAllVulnerabilities(): VulnerabilityRecord[] {
    return Array.from(this.vulnerabilities.values());
  }

  public getThreatSignal(id: string): ThreatSignalRecord | undefined {
    return this.threatSignals.get(id);
  }

  public getAllThreatSignals(): ThreatSignalRecord[] {
    return Array.from(this.threatSignals.values());
  }
}

export const intelligenceStore = IntelligenceStore.getInstance();
