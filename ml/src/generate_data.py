import numpy as np
import pandas as pd
import os

def generate_synthetic_cybersecurity_dataset(n_samples: int = 5000, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates >=5,000 synthetic organization/business-unit telemetry records with realistic causal relationships.
    """
    np.random.seed(random_seed)

    industries = ["Banking & Financial Services", "Healthcare", "E-Commerce & Retail", "SaaS & Cloud Provider", "Critical Infrastructure"]
    org_sizes = ["Small (50-250)", "Mid-Market (250-1000)", "Enterprise (1000-5000)", "Large Enterprise (5000+)"]
    cloud_envs = ["AWS Multi-Account", "Azure Hybrid", "GCP Native", "Multi-Cloud Enterprise", "On-Premises Legacy"]
    edr_types = ["CrowdStrike Falcon", "Microsoft Defender for Endpoint", "SentinelOne", "Legacy Antivirus", "None"]
    regions = ["India (BFSI Regulated)", "North America", "European Union (GDPR)", "APAC"]
    data_sensitivities = ["High (PII + Financial KYC)", "Critical (Cardholder / UPI Core)", "Moderate (Internal Confidential)", "Low (Public Data)"]

    industry_col = np.random.choice(industries, size=n_samples, p=[0.30, 0.20, 0.25, 0.15, 0.10])
    org_size_col = np.random.choice(org_sizes, size=n_samples, p=[0.20, 0.35, 0.30, 0.15])
    cloud_env_col = np.random.choice(cloud_envs, size=n_samples)
    edr_type_col = np.random.choice(edr_types, size=n_samples, p=[0.35, 0.30, 0.20, 0.10, 0.05])
    region_col = np.random.choice(regions, size=n_samples)
    data_sens_col = np.random.choice(data_sensitivities, size=n_samples, p=[0.35, 0.25, 0.25, 0.15])

    # Numeric features
    employee_count = np.random.choice([150, 500, 2000, 8000], size=n_samples) + np.random.randint(-20, 100, size=n_samples)
    annual_revenue_inr = (employee_count * np.random.uniform(1500000, 3500000, size=n_samples)) # ₹20 Cr to ₹2000 Cr
    exposed_assets = np.random.randint(20, 1500, size=n_samples)
    internet_facing_assets = (exposed_assets * np.random.uniform(0.05, 0.35, size=n_samples)).astype(int)
    critical_vulnerabilities = np.random.poisson(lam=3.5, size=n_samples)
    high_vulnerabilities = np.random.poisson(lam=12.0, size=n_samples)
    average_patch_delay_days = np.random.gamma(shape=2.5, scale=14.0, size=n_samples) # 10 to 90 days

    mfa_coverage_percent = np.random.uniform(40.0, 99.0, size=n_samples)
    edr_coverage_percent = np.random.uniform(45.0, 99.0, size=n_samples)
    backup_success_rate_percent = np.random.uniform(60.0, 99.5, size=n_samples)
    immutable_backup_enabled = np.random.choice([0, 1], size=n_samples, p=[0.60, 0.40])
    network_segmentation_score = np.random.uniform(0.20, 0.95, size=n_samples)
    phishing_failure_rate_percent = np.random.uniform(3.0, 35.0, size=n_samples)
    security_awareness_training_score = np.random.uniform(0.40, 0.98, size=n_samples)
    mean_time_to_detect_hours = np.random.lognormal(mean=2.8, sigma=0.8, size=n_samples)
    mean_time_to_respond_hours = np.random.lognormal(mean=3.5, sigma=0.8, size=n_samples)
    previous_security_incidents = np.random.poisson(lam=0.8, size=n_samples)
    third_party_vendor_risk_score = np.random.uniform(0.15, 0.85, size=n_samples)
    cloud_security_posture_score = np.random.uniform(0.30, 0.95, size=n_samples)
    privileged_accounts_count = np.random.randint(5, 250, size=n_samples)
    encryption_coverage_percent = np.random.uniform(50.0, 99.0, size=n_samples)
    security_budget_inr = annual_revenue_inr * np.random.uniform(0.015, 0.045, size=n_samples) # 1.5% to 4.5% of IT revenue

    # Latent probability logits based on domain cyber mechanics
    ransomware_logit = (
        -3.2
        + 0.15 * critical_vulnerabilities
        + 0.02 * average_patch_delay_days
        + 0.04 * phishing_failure_rate_percent
        - 0.03 * mfa_coverage_percent
        - 0.02 * edr_coverage_percent
        - 1.8 * immutable_backup_enabled
        - 1.2 * network_segmentation_score
    )
    p_ransomware = 1.0 / (1.0 + np.exp(-ransomware_logit))
    ransomware_incident = (np.random.uniform(0, 1, size=n_samples) < p_ransomware).astype(int)

    phishing_logit = (
        -2.5
        + 0.06 * phishing_failure_rate_percent
        - 0.04 * mfa_coverage_percent
        - 1.5 * security_awareness_training_score
        + 0.01 * privileged_accounts_count
    )
    p_phishing = 1.0 / (1.0 + np.exp(-phishing_logit))
    phishing_incident = (np.random.uniform(0, 1, size=n_samples) < p_phishing).astype(int)

    data_breach_logit = (
        -3.0
        + 0.005 * internet_facing_assets
        + 0.12 * critical_vulnerabilities
        - 0.025 * encryption_coverage_percent
        + 1.8 * third_party_vendor_risk_score
        - 1.4 * cloud_security_posture_score
    )
    p_data_breach = 1.0 / (1.0 + np.exp(-data_breach_logit))
    data_breach_incident = (np.random.uniform(0, 1, size=n_samples) < p_data_breach).astype(int)

    ddos_logit = (
        -2.8
        + 0.008 * internet_facing_assets
        - 1.2 * network_segmentation_score
    )
    p_ddos = 1.0 / (1.0 + np.exp(-ddos_logit))
    ddos_incident = (np.random.uniform(0, 1, size=n_samples) < p_ddos).astype(int)

    # Financial Impacts (INR)
    base_loss_scale = annual_revenue_inr * 0.02 # ~2% of revenue baseline
    
    # Immutable backups drastically reduce downtime impact
    ransomware_impact = np.where(
        ransomware_incident == 1,
        (base_loss_scale * (1.0 - 0.70 * immutable_backup_enabled) * (1.0 - 0.30 * network_segmentation_score)) * np.random.lognormal(0, 0.3, size=n_samples),
        0.0
    )

    phishing_impact = np.where(
        phishing_incident == 1,
        (base_loss_scale * 0.40 * (1.0 - 0.50 * (mfa_coverage_percent / 100.0))) * np.random.lognormal(0, 0.25, size=n_samples),
        0.0
    )

    data_breach_impact = np.where(
        data_breach_incident == 1,
        (base_loss_scale * 0.85 * (1.0 - 0.40 * (encryption_coverage_percent / 100.0))) * np.random.lognormal(0, 0.35, size=n_samples),
        0.0
    )

    ddos_impact = np.where(
        ddos_incident == 1,
        (base_loss_scale * 0.25) * np.random.lognormal(0, 0.2, size=n_samples),
        0.0
    )

    df = pd.DataFrame({
        "industry": industry_col,
        "organization_size": org_size_col,
        "cloud_environment": cloud_env_col,
        "endpoint_protection_type": edr_type_col,
        "region": region_col,
        "data_sensitivity_level": data_sens_col,
        "employee_count": employee_count,
        "annual_revenue_inr": np.round(annual_revenue_inr, 2),
        "exposed_assets": exposed_assets,
        "internet_facing_assets": internet_facing_assets,
        "critical_vulnerabilities": critical_vulnerabilities,
        "high_vulnerabilities": high_vulnerabilities,
        "average_patch_delay_days": np.round(average_patch_delay_days, 1),
        "mfa_coverage_percent": np.round(mfa_coverage_percent, 1),
        "edr_coverage_percent": np.round(edr_coverage_percent, 1),
        "backup_success_rate_percent": np.round(backup_success_rate_percent, 1),
        "immutable_backup_enabled": immutable_backup_enabled,
        "network_segmentation_score": np.round(network_segmentation_score, 2),
        "phishing_failure_rate_percent": np.round(phishing_failure_rate_percent, 1),
        "security_awareness_training_score": np.round(security_awareness_training_score, 2),
        "mean_time_to_detect_hours": np.round(mean_time_to_detect_hours, 1),
        "mean_time_to_respond_hours": np.round(mean_time_to_respond_hours, 1),
        "previous_security_incidents": previous_security_incidents,
        "third_party_vendor_risk_score": np.round(third_party_vendor_risk_score, 2),
        "cloud_security_posture_score": np.round(cloud_security_posture_score, 2),
        "privileged_accounts_count": privileged_accounts_count,
        "encryption_coverage_percent": np.round(encryption_coverage_percent, 1),
        "security_budget_inr": np.round(security_budget_inr, 2),
        "ransomware_incident": ransomware_incident,
        "phishing_incident": phishing_incident,
        "data_breach_incident": data_breach_incident,
        "ddos_incident": ddos_incident,
        "ransomware_impact_inr": np.round(ransomware_impact, 2),
        "phishing_impact_inr": np.round(phishing_impact, 2),
        "data_breach_impact_inr": np.round(data_breach_impact, 2),
        "ddos_impact_inr": np.round(ddos_impact, 2)
    })

    return df

if __name__ == "__main__":
    os.makedirs("ml/data", exist_ok=True)
    df = generate_synthetic_cybersecurity_dataset(n_samples=5000, random_seed=42)
    output_path = "ml/data/synthetic_cybersecurity_data.csv"
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} synthetic organization records to {output_path}")
