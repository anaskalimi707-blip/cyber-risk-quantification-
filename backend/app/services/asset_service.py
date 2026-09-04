from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.asset import Asset
from app.models.vulnerability import Vulnerability
from app.models.business_service import BusinessService
from app.schemas.asset import AssetRiskContribution, AttackPathResponse, AttackPathNode
from app.core.errors import CyberOptixException
from fastapi import status


class AssetService:
    @staticmethod
    async def get_asset_risk_contribution(db: AsyncSession, asset_id: str, organization_id: str) -> AssetRiskContribution:
        stmt = select(Asset).where(Asset.id == asset_id, Asset.organization_id == organization_id)
        res = await db.execute(stmt)
        asset = res.scalars().first()
        if not asset:
            raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Asset Not Found", detail=f"Asset {asset_id} does not exist.")

        # Query active vulnerabilities
        vuln_stmt = select(Vulnerability).where(Vulnerability.affected_asset_id == asset_id, Vulnerability.status == "Open")
        vuln_res = await db.execute(vuln_stmt)
        vulns = vuln_res.scalars().all()

        max_cvss = max([v.cvss_score for v in vulns], default=0.0)
        top_cve = vulns[0].cve if vulns else None

        # Estimated financial risk contribution based on asset criticality and vulns
        multiplier = 2.5 if asset.criticality == "Critical" else (1.5 if asset.criticality == "High" else 0.8)
        internet_mult = 1.8 if asset.internet_exposed else 1.0
        eal_contribution = round(len(vulns) * 125000.0 * multiplier * internet_mult, 2)

        return AssetRiskContribution(
            asset_id=asset.id,
            asset_name=asset.name,
            expected_annual_loss_contribution=eal_contribution,
            percentage_of_total_risk=14.5 if asset.criticality == "Critical" else 4.2,
            active_vulnerabilities_count=len(vulns),
            attack_path_depth=3 if asset.internet_exposed else 2,
            top_cve=top_cve,
        )

    @staticmethod
    async def get_attack_paths(db: AsyncSession, asset_id: str, organization_id: str) -> AttackPathResponse:
        stmt = select(Asset).where(Asset.id == asset_id, Asset.organization_id == organization_id)
        res = await db.execute(stmt)
        asset = res.scalars().first()
        if not asset:
            raise CyberOptixException(status_code=status.HTTP_404_NOT_FOUND, title="Asset Not Found", detail=f"Asset {asset_id} does not exist.")

        nodes = [
            AttackPathNode(id="node_ext", type="internet", name="External Threat Actor", status="Adversary Entry"),
            AttackPathNode(id=f"node_{asset.id}", type="asset", name=asset.name, status="Exposed Host", exploit_chain=["T1190 Exploit Public-Facing App"]),
            AttackPathNode(id="node_internal_db", type="database", name="Core Ledger & DB", status="Target Data", exploit_chain=["T1078 Valid Accounts", "T1486 Ransomware"]),
        ]
        edges = [
            {"from": "node_ext", "to": f"node_{asset.id}"},
            {"from": f"node_{asset.id}", "to": "node_internal_db"}
        ]

        return AttackPathResponse(
            asset_id=asset.id,
            target_business_service="UPI & NetBanking Payment Gateway",
            likelihood=0.18 if asset.internet_exposed else 0.04,
            nodes=nodes,
            edges=edges
        )
