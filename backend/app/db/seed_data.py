import asyncio
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.organization import Organization
from app.models.user import User
from app.models.business_service import BusinessService
from app.models.asset import Asset
from app.models.vulnerability import Vulnerability
from app.models.threat import Threat, AttackTechnique
from app.models.control import Control
from app.models.evidence import Evidence
from app.models.risk_scenario import RiskScenario
from app.models.risk_calculation import RiskCalculation
from app.models.investment import Investment, InvestmentPortfolio
from app.models.compliance import ComplianceFramework, ComplianceRequirement
from app.models.vendor import ThirdPartyVendor
from app.models.audit_event import AuditEvent
from app.engines.fair_engine import FAIREngine
from app.engines.monte_carlo import MonteCarloEngine


async def seed_all_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if organization already exists
        stmt = select(Organization).where(Organization.name == "Acme Financial Services")
        existing_org = (await db.execute(stmt)).scalars().first()
        if existing_org:
            print("Database already seeded with Acme Financial Services.")
            return

        print("Seeding initial enterprise dataset for Acme Financial Services...")

        # 1. Organization
        org = Organization(
            id="org_acme_financial_01",
            name="Acme Financial Services",
            legal_name="Acme Financial Services Pvt Ltd",
            industry="Banking & Financial Services",
            country="India",
            timezone="Asia/Kolkata",
            currency="INR",
            risk_appetite=10000000.0,  # ₹1.00 Crore Board Risk Appetite Limit
            default_frameworks=["NIST CSF 2.0", "SEBI CSCRF", "ISO/IEC 27001", "RBI Master Directions"]
        )
        db.add(org)
        await db.flush()

        # 2. Users with Enterprise Roles
        default_pwd = get_password_hash("CyberOptix@2026")

        ciso_user = User(
            id="user_ciso_01",
            organization_id=org.id,
            email="ciso@acmefinancial.com",
            hashed_password=default_pwd,
            full_name="Rajesh Sharma (CISO)",
            role="CISO",
            status="active"
        )
        cfo_user = User(
            id="user_cfo_01",
            organization_id=org.id,
            email="cfo@acmefinancial.com",
            hashed_password=default_pwd,
            full_name="Anita Desai (CFO)",
            role="CFO",
            status="active"
        )
        admin_user = User(
            id="user_admin_01",
            organization_id=org.id,
            email="admin@acmefinancial.com",
            hashed_password=default_pwd,
            full_name="Platform Administrator",
            role="Org Admin",
            status="active"
        )
        soc_user = User(
            id="user_soc_01",
            organization_id=org.id,
            email="soc@acmefinancial.com",
            hashed_password=default_pwd,
            full_name="Vikram Verma (Lead SOC Analyst)",
            role="SOC Analyst",
            status="active"
        )

        db.add_all([ciso_user, cfo_user, admin_user, soc_user])
        await db.flush()

        # 3. Business Service
        payment_service = BusinessService(
            id="srv_payment_gw_01",
            organization_id=org.id,
            name="UPI & NetBanking Payment Gateway",
            description="Core real-time transaction clearing & settlement engine processing 400K TPS.",
            owner_id=ciso_user.id,
            business_unit="Core Payments",
            criticality="Critical",
            revenue_dependency=50000000.0,  # ₹5 Crore revenue dependency / day
            regulatory_importance="Critical",
            recovery_time_objective=2.0,
            recovery_point_objective=0.5,
            maximum_tolerable_downtime=4.0
        )
        db.add(payment_service)
        await db.flush()

        # 4. Critical Technical Assets
        gw_asset = Asset(
            id="asset_api_gw_01",
            organization_id=org.id,
            external_id="aws:i-09f4820a1b2",
            name="api-gateway-prod-01",
            asset_type="API Gateway",
            hostname="api.acmepay.internal",
            ip_address="10.0.4.15",
            cloud_account="aws-prod-98765432",
            environment="Production",
            owner_id=ciso_user.id,
            business_service_id=payment_service.id,
            criticality="Critical",
            data_classification="Restricted",
            internet_exposed=True,
            lifecycle_status="Active",
            source_system="AWS Connector"
        )
        db_asset = Asset(
            id="asset_db_cluster_01",
            organization_id=org.id,
            external_id="aws:rds-pg-cluster-01",
            name="payment-ledger-db-cluster",
            asset_type="Database",
            hostname="db-ledger.prod.acmepay.internal",
            ip_address="10.0.8.22",
            cloud_account="aws-prod-98765432",
            environment="Production",
            owner_id=ciso_user.id,
            business_service_id=payment_service.id,
            criticality="Critical",
            data_classification="Restricted",
            internet_exposed=False,
            lifecycle_status="Active",
            source_system="AWS RDS Connector"
        )
        db.add_all([gw_asset, db_asset])
        await db.flush()

        # 5. Vulnerabilities
        vuln1 = Vulnerability(
            id="vuln_cve_2024_21413",
            organization_id=org.id,
            cve="CVE-2024-21413",
            title="Microsoft Outlook / Exchange RCE & NTLM Credential Leak",
            description="Remote code execution vulnerability allowing adversaries to bypass security controls and capture NetNTLM hashes.",
            severity="Critical",
            cvss_score=9.8,
            epss_score=0.82,
            exploit_available=True,
            exploit_maturity="Functional",
            affected_asset_id=gw_asset.id,
            due_date=datetime.now(timezone.utc) + timedelta(days=7),
            status="Open",
            source_system="Qualys VMDR API"
        )
        db.add(vuln1)
        await db.flush()

        # 6. Threats
        threat_ransomware = Threat(
            id="threat_lockbit_01",
            organization_id=org.id,
            name="LockBit 3.0 / Ransomware Syndicate",
            threat_type="Ransomware",
            threat_actor="LockBit Gang / FIN7",
            motivation="Financial Extortion",
            capability="High",
            intent="High",
            source="Mandiant & CERT-In Financial Threat Feed",
            confidence=0.90,
            ttp_tags=["T1190", "T1078", "T1486"]
        )
        db.add(threat_ransomware)
        await db.flush()

        # 7. Controls & Multi-factor Effectiveness
        # Control strength = coverage (0.80) * imp (0.85) * freshness (0.95) * test (0.90) * (1 - fail 0.05) = 0.55
        ctrl_mfa = Control(
            id="ctrl_mfa_01",
            organization_id=org.id,
            name="Privileged Multi-Factor Authentication",
            description="MFA enforced for administrative console access with SMS fallback.",
            category="Preventive",
            implementation_percentage=0.85,
            coverage_percentage=0.80,
            test_effectiveness=0.90,
            failure_rate=0.05,
            effectiveness_score=0.64,
            maintenance_cost=600000.0,
            framework_mappings=[{"framework": "NIST CSF 2.0", "ref": "PR.AC-1"}]
        )
        ctrl_backups = Control(
            id="ctrl_backup_01",
            organization_id=org.id,
            name="Daily Database Backups",
            description="Daily automated snapshot backups retained in cloud storage.",
            category="Recover",
            implementation_percentage=0.90,
            coverage_percentage=0.85,
            test_effectiveness=0.80,
            failure_rate=0.10,
            effectiveness_score=0.55,
            maintenance_cost=450000.0,
            framework_mappings=[{"framework": "NIST CSF 2.0", "ref": "RC.RP-1"}]
        )
        db.add_all([ctrl_mfa, ctrl_backups])
        await db.flush()

        # 8. Immutable Evidence
        ev1 = Evidence(
            id="ev_qualys_001",
            organization_id=org.id,
            evidence_type="Vulnerability Scan Report",
            source_system="Qualys VMDR API",
            content_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            reliability_score=0.98,
            valid_from=datetime.now(timezone.utc),
            valid_until=datetime.now(timezone.utc) + timedelta(days=90),
            freshness_status="Fresh",
            related_assets=[gw_asset.id],
            related_controls=[ctrl_mfa.id]
        )
        ev2 = Evidence(
            id="ev_okta_002",
            organization_id=org.id,
            evidence_type="Identity Policy Verification Log",
            source_system="Okta IAM API",
            content_hash="8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
            reliability_score=0.95,
            valid_from=datetime.now(timezone.utc),
            valid_until=datetime.now(timezone.utc) + timedelta(days=60),
            freshness_status="Fresh",
            related_controls=[ctrl_mfa.id]
        )
        db.add_all([ev1, ev2])
        await db.flush()

        # 9. Risk Scenario: Ransomware on Payment Processing Gateway
        # Inputs: Annual attack frequency: 0.20, Prob success: 0.25, Control eff: 0.64, Loss: ₹5 Crore
        # Adjusted frequency = 0.20 * 0.25 * (1 - 0.64) = 0.018
        # EAL = 0.018 * ₹5 Crore = ₹9 Lakh (₹900,000)
        scenario = RiskScenario(
            id="scen_ransomware_payment_01",
            organization_id=org.id,
            name="Ransomware affecting Payment Processing Gateway",
            description="External threat actor exploits unpatched API Gateway vulnerability to gain initial access, performs credential theft, and encrypts the core payment database ledger.",
            threat_id=threat_ransomware.id,
            attack_techniques=["T1190", "T1078", "T1486"],
            affected_assets=[gw_asset.id, db_asset.id],
            affected_business_services=[payment_service.id],
            risk_owner_id=ciso_user.id,
            status="Active",
            risk_tolerance=5000000.0,  # ₹50 Lakh
            model_version="FAIR-2.1-Enterprise",
            confidence="High",
            data_quality_score=0.92,
            last_calculated_at=datetime.now(timezone.utc)
        )
        db.add(scenario)
        await db.flush()

        # Run high-performance Monte Carlo simulation for initial calculation
        mc_res = MonteCarloEngine.run_simulation(
            threat_event_frequency_lambda=0.20,
            vulnerability_mode=0.25,
            control_strength=0.64,
            loss_magnitude_median=50000000.0,
            loss_magnitude_p95=150000000.0,
            iterations=10000,
            random_seed=42
        )

        calc = RiskCalculation(
            id="calc_initial_01",
            scenario_id=scenario.id,
            calculation_run_id="run_seed_genesis_001",
            model_version="FAIR-2.1-Enterprise",
            threat_event_frequency=0.20,
            vulnerability_factor=0.25,
            control_strength=0.64,
            probability_of_success=0.018,
            loss_magnitude_distribution={"distribution": "lognormal", "median": 50000000.0, "p95": 150000000.0, "currency": "INR"},
            expected_annual_loss=mc_res["expected_annual_loss"],
            median_loss=mc_res["median_loss"],
            percentile_90_loss=mc_res["percentile_90_loss"],
            percentile_95_loss=mc_res["percentile_95_loss"],
            value_at_risk=mc_res["value_at_risk_95"],
            expected_shortfall=mc_res["expected_shortfall"],
            confidence_interval=mc_res["confidence_interval_90"],
            assumptions=[
                "Adversary threat frequency calibrated to industry benchmark (0.20 events/yr)",
                "Payment processing system financial impact estimates include regulatory fines and recovery costs"
            ],
            evidence_references=[ev1.id, ev2.id],
            simulation_histogram=mc_res["histogram_bins"],
            loss_exceedance_curve=mc_res["loss_exceedance_curve"],
            calculated_at=datetime.now(timezone.utc),
            triggered_by="system:seed"
        )
        db.add(calc)
        await db.flush()

        # 10. Sample Investments (4 Candidate Investments)
        # 1. Phishing-resistant MFA (₹25L)
        # 2. Immutable backups (₹35L)
        # 3. Network segmentation (₹70L)
        # 4. Recovery exercises (₹10L)
        inv1 = Investment(
            id="inv_fido2_mfa_01",
            organization_id=org.id,
            name="Phishing-Resistant FIDO2 Hardware MFA",
            description="Deploy hardware security keys for all database and infrastructure administrators.",
            category="Identity & Access",
            initial_cost=2500000.0,  # ₹25 Lakh
            recurring_cost=300000.0,  # ₹3 Lakh / yr
            implementation_time=60,
            operational_impact="Low",
            affected_controls=[ctrl_mfa.id],
            affected_scenarios=[scenario.id],
            compliance_contribution=0.35,
            resilience_contribution=0.25,
            expected_risk_reduction_pct=0.45,
            status="Proposed"
        )
        inv2 = Investment(
            id="inv_immutable_backup_02",
            organization_id=org.id,
            name="Air-Gapped Immutable Backup Vault",
            description="WORM (Write Once Read Many) immutable cloud backup architecture with zero-delete lock.",
            category="Data Protection & Resilience",
            initial_cost=3500000.0,  # ₹35 Lakh
            recurring_cost=500000.0,  # ₹5 Lakh / yr
            implementation_time=90,
            operational_impact="Low",
            affected_controls=[ctrl_backups.id],
            affected_scenarios=[scenario.id],
            compliance_contribution=0.30,
            resilience_contribution=0.50,
            expected_risk_reduction_pct=0.40,
            status="Proposed"
        )
        inv3 = Investment(
            id="inv_microsegmentation_03",
            organization_id=org.id,
            name="Zero-Trust Network Microsegmentation",
            description="Isolate payment processing VPCs and ledger databases with dynamic eBPF network filtering.",
            category="Network Security",
            initial_cost=7000000.0,  # ₹70 Lakh
            recurring_cost=800000.0,
            implementation_time=180,
            operational_impact="Medium",
            affected_controls=[],
            affected_scenarios=[scenario.id],
            compliance_contribution=0.40,
            resilience_contribution=0.35,
            expected_risk_reduction_pct=0.50,
            status="Proposed"
        )
        inv4 = Investment(
            id="inv_resilience_drills_04",
            organization_id=org.id,
            name="Automated Cyber Recovery Drills",
            description="Quarterly simulated ransomware tabletop and automated sandbox database recovery drills.",
            category="Resilience & Governance",
            initial_cost=1000000.0,  # ₹10 Lakh
            recurring_cost=200000.0,
            implementation_time=30,
            operational_impact="Low",
            affected_controls=[ctrl_backups.id],
            affected_scenarios=[scenario.id],
            compliance_contribution=0.25,
            resilience_contribution=0.40,
            expected_risk_reduction_pct=0.20,
            status="Proposed"
        )
        db.add_all([inv1, inv2, inv3, inv4])
        await db.flush()

        # 11. Compliance Frameworks & Requirements
        nist_framework = ComplianceFramework(
            id="fw_nist_csf_20",
            name="NIST CSF 2.0",
            version="2.0",
            country="Global",
            source="NIST National Institute of Standards and Technology",
            active=True
        )
        sebi_framework = ComplianceFramework(
            id="fw_sebi_cscrf",
            name="SEBI CSCRF",
            version="2024.1",
            country="India",
            source="Securities and Exchange Board of India",
            active=True
        )
        db.add_all([nist_framework, sebi_framework])
        await db.flush()

        # 12. Genesis Audit Event
        genesis_audit = AuditEvent(
            id="audit_genesis_01",
            organization_id=org.id,
            actor_id="system:seed",
            action="system:initialize_database",
            resource_type="system",
            resource_id=org.id,
            previous_value=None,
            new_value={"status": "Initialized Acme Financial Services Environment"},
            tamper_hash="GENESIS_BLOCK_CYBEROPTIX_2026_ACME_INITIALIZED",
            created_at=datetime.now(timezone.utc)
        )
        db.add(genesis_audit)

        await db.commit()
        print("Successfully seeded Acme Financial Services with ₹5 Crore Ransomware Scenario & 4 Investment Candidates!")


if __name__ == "__main__":
    asyncio.run(seed_all_data())
