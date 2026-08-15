#!/usr/bin/env python3
"""Sync Asaas keys from .env.local into multi-tenant billing.env + Vercel Production."""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(r"C:\Users\Esdras\sites_app\bohnen\bohnen_app")
HUB_ENV = Path(
    r"C:\Users\Esdras\sites_app\servidor_email_openclaw\servidor_email_openclaw_app\env\generated\.env.local"
)
ROOT_ENV = ROOT / ".env.local"
BILLING = ROOT / "env" / "local" / "20-tenants" / "wisdomwear" / "billing.env"


def load_env(path: Path) -> dict[str, str]:
    vals: dict[str, str] = {}
    if not path.exists():
        return vals
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        vals[k.strip()] = v.strip().strip('"').strip("'")
    return vals


def pick(vals: dict[str, str], *keys: str) -> str:
    for k in keys:
        v = vals.get(k, "")
        if v:
            return v
    return ""


def vercel(method: str, path: str, token: str, team: str, body=None):
    url = f"https://api.vercel.com{path}"
    sep = "&" if "?" in path else "?"
    url = f"{url}{sep}teamId={team}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"error": raw}


def upsert_vercel_env(token: str, team: str, pid: str, key: str, value: str) -> str:
    # list existing
    code, res = vercel("GET", f"/v9/projects/{pid}/env", token, team)
    existing = None
    for item in res.get("envs") or []:
        if item.get("key") == key and "production" in (item.get("target") or []):
            existing = item
            break

    payload = {
        "key": key,
        "value": value,
        "type": "encrypted",
        "target": ["production"],
    }
    if existing:
        eid = existing["id"]
        code, res = vercel("PATCH", f"/v9/projects/{pid}/env/{eid}", token, team, payload)
        return f"PATCH {key} {code}"
    code, res = vercel("POST", f"/v10/projects/{pid}/env", token, team, payload)
    return f"POST {key} {code}"


def main() -> None:
    root = load_env(ROOT_ENV)
    api_url = pick(root, "WISDOMWEAR_ASAAS_API_URL", "ASAAS_API_URL") or "https://sandbox.asaas.com/api/v3"
    api_key = pick(root, "WISDOMWEAR_ASAAS_SUBACCOUNT_API_KEY", "ASAAS_SUBACCOUNT_API_KEY")
    webhook = pick(root, "WISDOMWEAR_ASAAS_WEBHOOK_SECRET", "ASAAS_WEBHOOK_SECRET")

    if not api_key:
        print("NO_ASAAS_KEY_IN_ENV_LOCAL")
        # show which asaas-related keys exist (names only)
        for k in sorted(root):
            if "ASAAS" in k.upper():
                print(f"FOUND_KEY_NAME {k} filled={bool(root[k])}")
        return

    print(f"ASAAS_KEY SET len={len(api_key)} prefix={api_key[:6]}...")
    print(f"WEBHOOK {'SET' if webhook else 'EMPTY'}")
    print(f"API_URL {api_url}")

    billing = f"""# Asaas — SEM SPLIT
WISDOMWEAR_ASAAS_API_URL={api_url}
WISDOMWEAR_ASAAS_SUBACCOUNT_API_KEY={api_key}
WISDOMWEAR_ASAAS_WEBHOOK_SECRET={webhook}
ASAAS_API_URL={api_url}
ASAAS_SUBACCOUNT_API_KEY={api_key}
ASAAS_WEBHOOK_SECRET={webhook}
"""
    BILLING.write_text(billing, encoding="utf-8")
    print("BILLING_ENV_UPDATED")

    # rebuild generated + root
    import subprocess
    import sys

    subprocess.check_call(
        [sys.executable, str(ROOT / "scripts" / "build_env_local.py"), "--write-root", "--validate"],
        cwd=str(ROOT),
    )

    # Vercel
    hub = load_env(HUB_ENV)
    token = hub.get("VERCEL_TOKEN", "")
    team = hub.get("VERCEL_TEAM_ID", "")
    if not token or not team:
        print("SKIP_VERCEL missing creds")
        return

    code, projects = vercel("GET", "/v9/projects?limit=100", token, team)
    project = None
    for p in projects.get("projects") or []:
        if (p.get("name") or "").lower() == "wisdomwear":
            project = p
            break
    if not project:
        print("VERCEL_PROJECT_NOT_FOUND")
        return

    pid = project["id"]
    pairs = {
        "WISDOMWEAR_ASAAS_API_URL": api_url,
        "ASAAS_API_URL": api_url,
        "WISDOMWEAR_ASAAS_SUBACCOUNT_API_KEY": api_key,
        "ASAAS_SUBACCOUNT_API_KEY": api_key,
        "WISDOMWEAR_ASAAS_WEBHOOK_SECRET": webhook,
        "ASAAS_WEBHOOK_SECRET": webhook,
        "NEXT_PUBLIC_APP_URL": "https://wisdomwear.com.br",
        "WISDOMWEAR_APP_URL": "https://wisdomwear.com.br",
    }
    for k, v in pairs.items():
        print(upsert_vercel_env(token, team, pid, k, v))

    print("DONE Melhor Envio permanece para amanha")


if __name__ == "__main__":
    main()
