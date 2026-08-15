#!/usr/bin/env python3
"""Create Asaas webhook for Wisdom Wear and persist authToken."""
from __future__ import annotations

import json
import secrets
import string
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(r"C:\Users\Esdras\sites_app\bohnen\bohnen_app")
HUB_ENV = Path(
    r"C:\Users\Esdras\sites_app\servidor_email_openclaw\servidor_email_openclaw_app\env\generated\.env.local"
)
BILLING = ROOT / "env" / "local" / "20-tenants" / "wisdomwear" / "billing.env"
ROOT_ENV = ROOT / ".env.local"

# Domínio canônico ainda pending NS — usar Vercel público agora
WEBHOOK_URL = "https://wisdomwear.vercel.app/api/webhooks/asaas"
WEBHOOK_EMAIL = "admin@wisdomwear.com.br"
WEBHOOK_NAME = "Wisdom Wear — Pagamentos"

EVENTS = [
    "PAYMENT_CREATED",
    "PAYMENT_UPDATED",
    "PAYMENT_CONFIRMED",
    "PAYMENT_RECEIVED",
    "PAYMENT_OVERDUE",
    "PAYMENT_DELETED",
    "PAYMENT_RESTORED",
    "PAYMENT_REFUNDED",
    "PAYMENT_RECEIVED_IN_CASH_UNDONE",
    "PAYMENT_CHARGEBACK_REQUESTED",
    "PAYMENT_CHARGEBACK_DISPUTE",
    "PAYMENT_AWAITING_CHARGEBACK_REVERSAL",
    "PAYMENT_DUNNING_REQUESTED",
    "PAYMENT_DUNNING_RECEIVED",
    "PAYMENT_BANK_SLIP_VIEWED",
    "PAYMENT_CHECKOUT_VIEWED",
]


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


def gen_auth_token(length: int = 48) -> str:
    alphabet = string.ascii_letters + string.digits
    return "ww_" + "".join(secrets.choice(alphabet) for _ in range(length))


def asaas_request(method: str, base: str, path: str, api_key: str, body=None):
    url = f"{base.rstrip('/')}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "access_token": api_key,
            "Content-Type": "application/json",
            "User-Agent": "WisdomWear/1.0",
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
        code, _ = vercel(
            "PATCH", f"/v9/projects/{pid}/env/{existing['id']}", token, team, payload
        )
        return f"PATCH {key} {code}"
    code, _ = vercel("POST", f"/v10/projects/{pid}/env", token, team, payload)
    return f"POST {key} {code}"


def main() -> None:
    root = load_env(ROOT_ENV)
    billing_vals = load_env(BILLING)
    merged = {**billing_vals, **root}

    api_key = pick(merged, "WISDOMWEAR_ASAAS_SUBACCOUNT_API_KEY", "ASAAS_SUBACCOUNT_API_KEY")
    api_url = pick(merged, "WISDOMWEAR_ASAAS_API_URL", "ASAAS_API_URL") or (
        "https://sandbox.asaas.com/api/v3"
    )
    if not api_key:
        print("NO_ASAAS_KEY")
        return

    # List existing webhooks — reuse/update if Wisdom already exists
    code, listed = asaas_request("GET", api_url, "/webhooks", api_key)
    print(f"LIST_WEBHOOKS {code}")
    existing = None
    if code == 200:
        for wh in listed.get("data") or []:
            if WEBHOOK_URL in (wh.get("url") or "") or "Wisdom" in (wh.get("name") or ""):
                existing = wh
                break
        print(f"EXISTING_COUNT {len(listed.get('data') or [])}")

    auth_token = pick(merged, "WISDOMWEAR_ASAAS_WEBHOOK_SECRET", "ASAAS_WEBHOOK_SECRET")
    if not auth_token or len(auth_token) < 32:
        auth_token = gen_auth_token()
        print(f"AUTH_TOKEN_GENERATED len={len(auth_token)}")
    else:
        print(f"AUTH_TOKEN_REUSED len={len(auth_token)}")

    payload = {
        "name": WEBHOOK_NAME,
        "url": WEBHOOK_URL,
        "email": WEBHOOK_EMAIL,
        "enabled": True,
        "interrupted": False,
        "apiVersion": 3,
        "authToken": auth_token,
        "sendType": "SEQUENTIALLY",
        "events": EVENTS,
    }

    if existing and existing.get("id"):
        wid = existing["id"]
        code, res = asaas_request("PUT", api_url, f"/webhooks/{wid}", api_key, payload)
        print(f"UPDATE_WEBHOOK {code} id={wid}")
    else:
        code, res = asaas_request("POST", api_url, "/webhooks", api_key, payload)
        print(f"CREATE_WEBHOOK {code}")

    if code >= 400:
        # print errors without auth token
        safe = {k: v for k, v in (res or {}).items() if k != "authToken"}
        print("ERROR", json.dumps(safe, ensure_ascii=False)[:800])
        return

    wid = res.get("id", "")
    print(f"WEBHOOK_ID {wid}")
    print(f"WEBHOOK_URL {res.get('url')}")
    print(f"ENABLED {res.get('enabled')} INTERRUPTED {res.get('interrupted')}")
    print(f"EVENTS {len(res.get('events') or EVENTS)}")

    # Persist secret
    api_url_clean = pick(merged, "WISDOMWEAR_ASAAS_API_URL", "ASAAS_API_URL") or api_url
    billing = f"""# Asaas — SEM SPLIT
WISDOMWEAR_ASAAS_API_URL={api_url_clean}
WISDOMWEAR_ASAAS_SUBACCOUNT_API_KEY={api_key}
WISDOMWEAR_ASAAS_WEBHOOK_SECRET={auth_token}
WISDOMWEAR_ASAAS_WEBHOOK_ID={wid}
WISDOMWEAR_ASAAS_WEBHOOK_URL={WEBHOOK_URL}
ASAAS_API_URL={api_url_clean}
ASAAS_SUBACCOUNT_API_KEY={api_key}
ASAAS_WEBHOOK_SECRET={auth_token}
ASAAS_WEBHOOK_ID={wid}
"""
    BILLING.write_text(billing, encoding="utf-8")
    print("BILLING_UPDATED")

    subprocess.check_call(
        [sys.executable, str(ROOT / "scripts" / "build_env_local.py"), "--write-root", "--validate"],
        cwd=str(ROOT),
    )

    # Vercel env
    hub = load_env(HUB_ENV)
    token = hub.get("VERCEL_TOKEN", "")
    team = hub.get("VERCEL_TEAM_ID", "")
    if token and team:
        code, projects = vercel("GET", "/v9/projects?limit=100", token, team)
        project = next(
            (p for p in (projects.get("projects") or []) if (p.get("name") or "").lower() == "wisdomwear"),
            None,
        )
        if project:
            pid = project["id"]
            for k, v in [
                ("WISDOMWEAR_ASAAS_WEBHOOK_SECRET", auth_token),
                ("ASAAS_WEBHOOK_SECRET", auth_token),
                ("WISDOMWEAR_ASAAS_WEBHOOK_ID", wid),
                ("ASAAS_WEBHOOK_ID", wid),
            ]:
                print(upsert_vercel_env(token, team, pid, k, v))
        else:
            print("VERCEL_PROJECT_NOT_FOUND")
    else:
        print("SKIP_VERCEL")

    print("DONE")
    print("NOTE: apos NS do dominio, atualize a URL do webhook para https://wisdomwear.com.br/api/webhooks/asaas")


if __name__ == "__main__":
    main()
