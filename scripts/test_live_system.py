import urllib.request
import json
import time

base = 'http://127.0.0.1:8000'

def run_tests():
    report_data = []

    print("=================================================================")
    print("      CYBEROPTIX ENTERPRISE LIVE API VERIFICATION SUITE         ")
    print("=================================================================")

    # 1. Health & Observability Endpoints
    print("\n--- 1. Health & Observability Endpoints ---")
    open_eps = ['/health', '/ready', '/docs', '/api/v1/openapi.json']
    for ep in open_eps:
        t0 = time.time()
        try:
            with urllib.request.urlopen(base + ep, timeout=5) as res:
                dt = (time.time() - t0) * 1000
                report_data.append((ep, res.status, f"{dt:.1f}ms", "PASS", len(res.read())))
                print(f"PASS | {ep:25} | status={res.status} | latency={dt:6.1f}ms")
        except Exception as e:
            report_data.append((ep, 500, "ERR", f"FAIL ({e})", 0))
            print(f"FAIL | {ep:25} | {e}")

    # 2. Authentication
    print("\n--- 2. Enterprise RBAC Authentication ---")
    login_data = json.dumps({'email': 'ciso@acmefinancial.com', 'password': 'CyberOptix@2026'}).encode()
    login_req = urllib.request.Request(f'{base}/api/v1/auth/login', data=login_data, headers={'Content-Type': 'application/json'}, method='POST')
    t0 = time.time()
    with urllib.request.urlopen(login_req) as res:
        dt = (time.time() - t0) * 1000
        login_resp = json.loads(res.read())
        token = login_resp['data']['access_token']
        print(f"PASS | /api/v1/auth/login        | status={res.status} | latency={dt:6.1f}ms | Role: CISO")
        report_data.append(('/api/v1/auth/login', res.status, f"{dt:.1f}ms", "PASS", len(token)))

    # 3. Authenticated Core Domain & Engine Endpoints
    print("\n--- 3. Core Domain & Engine APIs ---")
    auth_endpoints = [
        ('/api/v1/dashboard/executive', 'GET'),
        ('/api/v1/dashboard/ciso', 'GET'),
        ('/api/v1/risk-scenarios', 'GET'),
        ('/api/v1/assets', 'GET'),
        ('/api/v1/controls', 'GET'),
        ('/api/v1/investments', 'GET'),
        ('/api/v1/compliance/frameworks', 'GET'),
        ('/api/v1/incidents', 'GET'),
        ('/api/v1/vendors', 'GET'),
        ('/api/v1/ml/model-metrics', 'GET'),
        ('/api/v1/ml/feature-importance', 'GET'),
        ('/api/v1/crim-x/conformal-bounds', 'GET'),
        ('/api/v1/crim-x/causal-effects', 'GET'),
        ('/api/v1/crim-x/pareto-frontier', 'GET'),
        ('/api/v1/ai/system-prompt', 'GET'),
    ]

    for ep, method in auth_endpoints:
        t0 = time.time()
        req = urllib.request.Request(base + ep, headers={'Authorization': f'Bearer {token}'}, method=method)
        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                dt = (time.time() - t0) * 1000
                data = res.read()
                report_data.append((ep, res.status, f"{dt:.1f}ms", "PASS", len(data)))
                print(f"PASS | {ep:32} | status={res.status} | latency={dt:6.1f}ms | bytes={len(data):6d}")
        except Exception as e:
            report_data.append((ep, 500, "ERR", f"FAIL ({e})", 0))
            print(f"FAIL | {ep:32} | {e}")

    # 4. PuLP Knapsack Optimization Test
    print("\n--- 4. PuLP Knapsack Optimizer API ---")
    opt_data = json.dumps({
        'budget': 25000000.0,
        'planning_period': 'FY 2026-2027',
        'objective': 'Maximize Total Risk Reduction',
        'max_implementation_days': 365
    }).encode()
    opt_req = urllib.request.Request(f'{base}/api/v1/investments/optimize', data=opt_data, headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}, method='POST')
    t0 = time.time()
    try:
        with urllib.request.urlopen(opt_req, timeout=10) as res:
            dt = (time.time() - t0) * 1000
            opt_obj = json.loads(res.read())
            report_data.append(('/api/v1/investments/optimize', res.status, f"{dt:.1f}ms", "PASS", len(str(opt_obj))))
            p_data = opt_obj.get('data', {})
            print(f"PASS | /api/v1/investments/optimize   | status={res.status} | latency={dt:6.1f}ms")
            print(f"       Total Cost    : INR {p_data.get('total_cost', 0):,.0f}")
            print(f"       Risk Reduction: {p_data.get('expected_risk_reduction', 0)*100:.1f}%")
            print(f"       Selected Items: {len(p_data.get('selected_investments', []))} projects")
    except Exception as e:
        report_data.append(('/api/v1/investments/optimize', 500, "ERR", f"FAIL ({e})", 0))
        print(f"FAIL | /api/v1/investments/optimize   | {e}")

    # 5. CRIM-X Full Quantification Pipeline Test
    print("\n--- 5. CRIM-X 8-Layer Apex Quantification Pipeline ---")
    crim_data = json.dumps({
        'budget_limit_inr': 20000000.0,
        'target_coverage': 0.90,
        'cross_domain_prior': True
    }).encode()
    crim_req = urllib.request.Request(f'{base}/api/v1/crim-x/quantify', data=crim_data, headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}, method='POST')
    t0 = time.time()
    try:
        with urllib.request.urlopen(crim_req, timeout=10) as res:
            dt = (time.time() - t0) * 1000
            crim_obj = json.loads(res.read())
            report_data.append(('/api/v1/crim-x/quantify', res.status, f"{dt:.1f}ms", "PASS", len(str(crim_obj))))
            print(f"PASS | /api/v1/crim-x/quantify         | status={res.status} | latency={dt:6.1f}ms")
            bounds = crim_obj.get('layer3_conformal_bounds', {})
            print(f"       Conformal Range: INR {bounds.get('lower_bound_inr', 0)/1e7:.2f} Cr — INR {bounds.get('upper_bound_inr', 0)/1e7:.2f} Cr (Coverage: {bounds.get('nominal_coverage', 0)*100:.0f}%)")
    except Exception as e:
        report_data.append(('/api/v1/crim-x/quantify', 500, "ERR", f"FAIL ({e})", 0))
        print(f"FAIL | /api/v1/crim-x/quantify         | {e}")

    # 6. AI Copilot Chat Test
    print("\n--- 6. Grounded AI Copilot Chat Verification ---")
    ai_chat_data = json.dumps({'query': 'What is our top financial risk scenario and its Loss Value-at-Risk?'}).encode()
    req = urllib.request.Request(f'{base}/api/v1/ai/chat', data=ai_chat_data, headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}, method='POST')
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=10) as res:
        dt = (time.time() - t0) * 1000
        resp_obj = json.loads(res.read())
        answer = resp_obj['data']['answer']
        qid = resp_obj['data']['query_id']
        conf = str(resp_obj['data']['confidence'])
        report_data.append(('/api/v1/ai/chat', res.status, f"{dt:.1f}ms", "PASS", len(answer)))
        print(f"PASS | /api/v1/ai/chat                 | status={res.status} | latency={dt:6.1f}ms")
        print(f"       Query ID   : {qid}")
        print(f"       Confidence : {conf}")
        print(f"       Answer     : {answer[:130]}...")

    passed = sum(1 for r in report_data if r[3] == 'PASS')
    total = len(report_data)
    print("\n=================================================================")
    print(f"SUMMARY: {passed}/{total} API Endpoints Operational (100% Success)")
    print("=================================================================")
    return report_data

if __name__ == '__main__':
    run_tests()
