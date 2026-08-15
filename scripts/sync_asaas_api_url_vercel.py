#!/usr/bin/env python3
import json
import urllib.error
import urllib.request
from pathlib import Path


def load(p: Path) -> dict[str, str]:
    d: dict[str, str] = {}
    for line in p.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        d[k.strip()] = v.strip().strip('"').strip("'")
    return d


hub = load(
    Path(
        r"C:\Users\Esdras\sites_app\servidor_email_openclaw\servidor_email_openclaw_app\env\generated\.env.local"
    )
)
token, team = hub["VERCEL_TOKEN"], hub["VERCEL_TEAM_ID"]


def api(method: str, path: str, body=None):
    sep = "&" if "?" in path else "?"
    url = f"https://api.vercel.com{path}{sep}teamId={team}"
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
        return e.code, json.loads(e.read().decode())


_, projects = api("GET", "/v9/projects?limit=100")
pid = next(p["id"] for p in projects["projects"] if p["name"] == "wisdomwear")
_, envs = api("GET", f"/v9/projects/{pid}/env")
prod_url = "https://api.asaas.com/v3"
for key in ["ASAAS_API_URL", "WISDOMWEAR_ASAAS_API_URL"]:
    existing = next(
        (
            e
            for e in envs.get("envs", [])
            if e.get("key") == key and "production" in (e.get("target") or [])
        ),
        None,
    )
    payload = {
        "key": key,
        "value": prod_url,
        "type": "encrypted",
        "target": ["production"],
    }
    if existing:
        c, _ = api("PATCH", f"/v9/projects/{pid}/env/{existing['id']}", payload)
        print("PATCH", key, c)
    else:
        c, _ = api("POST", f"/v10/projects/{pid}/env", payload)
        print("POST", key, c)
