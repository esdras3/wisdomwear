#!/usr/bin/env python3
"""Add wisdomwear.com.br domain to Vercel project and set env vars."""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from pathlib import Path

HUB_ENV = Path(
    r"C:\Users\Esdras\sites_app\servidor_email_openclaw\servidor_email_openclaw_app\env\generated\.env.local"
)
APP_ENV = Path(r"C:\Users\Esdras\sites_app\bohnen\bohnen_app\env\generated\.env.local")
DOMAINS = ["wisdomwear.com.br", "www.wisdomwear.com.br"]


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


def main() -> None:
    hub = load_env(HUB_ENV)
    app = load_env(APP_ENV)
    token = hub.get("VERCEL_TOKEN", "")
    team = hub.get("VERCEL_TEAM_ID", "")
    if not token or not team:
        print("MISSING_VERCEL_CREDS")
        return

    # Find project
    code, projects = vercel("GET", "/v9/projects?limit=100", token, team)
    if code >= 400:
        print("PROJECTS_FAIL", code, projects)
        return

    project = None
    for p in projects.get("projects") or []:
        name = (p.get("name") or "").lower()
        if "wisdom" in name or name == "bohnen_app" or name == "wisdomwear":
            project = p
            break

    if not project:
        # list names for operator
        names = [p.get("name") for p in (projects.get("projects") or [])]
        print("PROJECT_NOT_FOUND among:", ", ".join(n for n in names if n)[:500])
        return

    pid = project["id"]
    pname = project["name"]
    print(f"PROJECT {pname} {pid}")

    for dom in DOMAINS:
        code, res = vercel(
            "POST",
            f"/v10/projects/{pid}/domains",
            token,
            team,
            {"name": dom},
        )
        print(f"DOMAIN {dom} -> {code}", res.get("name") or res.get("error") or res)

    # Upsert production env vars from generated app env (non-empty)
    keys = [
        "NEXT_PUBLIC_APP_URL",
        "NEXT_PUBLIC_TENANT_ID",
        "NEXT_PUBLIC_TENANT_NAME",
        "WISDOMWEAR_APP_URL",
        "WISDOMWEAR_TENANT_ID",
        "WISDOMWEAR_ADMIN_EMAIL",
        "WISDOMWEAR_ADMIN_PASSWORD",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "WISDOMWEAR_ASAAS_API_URL",
        "ASAAS_API_URL",
        "WISDOMWEAR_ASAAS_SUBACCOUNT_API_KEY",
        "ASAAS_SUBACCOUNT_API_KEY",
        "WISDOMWEAR_ASAAS_WEBHOOK_SECRET",
        "ASAAS_WEBHOOK_SECRET",
        "WISDOMWEAR_MELHOR_ENVIO_API_URL",
        "MELHOR_ENVIO_API_URL",
        "WISDOMWEAR_MELHOR_ENVIO_TOKEN",
        "MELHOR_ENVIO_TOKEN",
        "WISDOMWEAR_MELHOR_ENVIO_POSTAL_CODE_ORIGIN",
        "MELHOR_ENVIO_POSTAL_CODE_ORIGIN",
        "WISDOMWEAR_DATABASE_URL",
        "DATABASE_URL",
    ]

    # Prefer canonical URL for production
    app["NEXT_PUBLIC_APP_URL"] = "https://wisdomwear.com.br"
    app["WISDOMWEAR_APP_URL"] = "https://wisdomwear.com.br"

    payload = []
    for k in keys:
        v = app.get(k)
        if v is None:
            continue
        payload.append(
            {
                "key": k,
                "value": v,
                "type": "encrypted",
                "target": ["production"],
            }
        )

    code, res = vercel("POST", f"/v10/projects/{pid}/env", token, team, payload)
    # Some accounts want one-by-one; retry individually on failure
    if code >= 400:
        print("ENV_BULK_FAIL", code, res)
        ok = 0
        for item in payload:
            c, r = vercel("POST", f"/v10/projects/{pid}/env", token, team, item)
            if c < 400:
                ok += 1
            else:
                # try patch existing
                print(f"ENV_FAIL {item['key']} {c}")
        print(f"ENV_INDIVIDUAL_OK {ok}/{len(payload)}")
    else:
        print(f"ENV_OK {len(payload)} vars")

    print("DONE")


if __name__ == "__main__":
    main()
