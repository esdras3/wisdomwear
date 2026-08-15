#!/usr/bin/env python3
"""Provision Cloudflare zone for wisdomwear.com.br and Vercel DNS records."""
from __future__ import annotations

import json
import urllib.error
import urllib.request
from pathlib import Path

HUB = Path(r"C:\Users\Esdras\sites_app\servidor_email_openclaw\servidor_email_openclaw_app")
ENV = HUB / "env" / "generated" / ".env.local"
CORE = HUB / "env" / "local" / "20-tenants" / "wisdomwear" / "core.env"
DNS_GLOBAL = HUB / "env" / "local" / "00-global" / "dns-and-domains.env"
DOM = "wisdomwear.com.br"
ACCT = "b608523e19082a5a2d5d192b8d80fdef"
VERCEL_CNAME = "cname.vercel-dns.com"


def load_env(path: Path) -> dict[str, str]:
    vals: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        vals[k.strip()] = v.strip().strip('"').strip("'")
    return vals


def api(method: str, path: str, headers: dict, body=None):
    url = f"https://api.cloudflare.com/client/v4{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode())


def main() -> None:
    vals = load_env(ENV)
    token = vals.get("CLOUDFLARE_API_TOKEN", "")
    gkey = vals.get("CLOUDFLARE_GLOBAL_API_KEY", "")
    email = vals.get("CLOUDFLARE_EMAIL", "")

    h_token = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    h_global = {
        "X-Auth-Email": email,
        "X-Auth-Key": gkey,
        "Content-Type": "application/json",
    }

    def call(method, path, body=None):
        res = api(method, path, h_token, body)
        if not res.get("success"):
            res = api(method, path, h_global, body)
        return res

    found = call("GET", f"/zones?name={DOM}")
    zones = found.get("result") or []
    if zones:
        z = zones[0]
        print(f"EXISTING_ZONE {z['id']}")
    else:
        created = call(
            "POST",
            "/zones",
            {"name": DOM, "account": {"id": ACCT}, "type": "full"},
        )
        if not created.get("success"):
            print("CREATE_FAIL", json.dumps(created.get("errors"), ensure_ascii=False))
            return
        z = created["result"]
        print(f"CREATED_ZONE {z['id']}")

    zid = z["id"]
    ns = z.get("name_servers") or []
    print("NS " + ",".join(ns))
    print("STATUS " + str(z.get("status")))

    # Upsert DNS for Vercel (proxied orange)
    desired = [
        {"type": "CNAME", "name": DOM, "content": VERCEL_CNAME, "proxied": True, "ttl": 1},
        {"type": "CNAME", "name": f"www.{DOM}", "content": VERCEL_CNAME, "proxied": True, "ttl": 1},
    ]

    existing = call("GET", f"/zones/{zid}/dns_records?per_page=100")
    by_name_type = {}
    for rec in existing.get("result") or []:
        by_name_type[(rec["type"], rec["name"])] = rec

    for rec in desired:
        key = (rec["type"], rec["name"])
        if key in by_name_type:
            rid = by_name_type[key]["id"]
            upd = call("PUT", f"/zones/{zid}/dns_records/{rid}", rec)
            print("UPD", rec["type"], rec["name"], "OK" if upd.get("success") else upd.get("errors"))
        else:
            # apex CNAME may fail on some plans — try AAAA/ALIAS style via CNAME flatten
            cre = call("POST", f"/zones/{zid}/dns_records", rec)
            if not cre.get("success") and rec["name"] == DOM:
                # fallback: use A record to Vercel anycast? Prefer CNAME www only + note
                print("APEX_CNAME_FAIL", cre.get("errors"))
                # try as CNAME with name @
                alt = dict(rec)
                alt["name"] = "@"
                cre2 = call("POST", f"/zones/{zid}/dns_records", alt)
                print("APEX_AT", "OK" if cre2.get("success") else cre2.get("errors"))
            else:
                print("ADD", rec["type"], rec["name"], "OK" if cre.get("success") else cre.get("errors"))

    # Persist zone id
    for path in (CORE, DNS_GLOBAL):
        text = path.read_text(encoding="utf-8")
        if "CLOUDFLARE_WISDOMWEAR_ZONE_ID=" in text:
            lines = []
            for line in text.splitlines():
                if line.startswith("CLOUDFLARE_WISDOMWEAR_ZONE_ID="):
                    lines.append(f"CLOUDFLARE_WISDOMWEAR_ZONE_ID={zid}")
                elif line.startswith("WISDOMWEAR_CF_NS1=") and ns:
                    lines.append(f"WISDOMWEAR_CF_NS1={ns[0]}")
                elif line.startswith("WISDOMWEAR_CF_NS2=") and len(ns) > 1:
                    lines.append(f"WISDOMWEAR_CF_NS2={ns[1]}")
                else:
                    lines.append(line)
            path.write_text("\n".join(lines) + "\n", encoding="utf-8")
            print(f"UPDATED {path.name}")

    print("DONE")


if __name__ == "__main__":
    main()
