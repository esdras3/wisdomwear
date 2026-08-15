#!/usr/bin/env python3
from pathlib import Path
import subprocess
import sys

ROOT = Path(r"C:\Users\Esdras\sites_app\bohnen\bohnen_app")
HOSTING = ROOT / "env" / "local" / "10-platform" / "hosting.env"
ROOT_ENV = ROOT / ".env.local"
GENERATED = ROOT / "env" / "generated" / ".env.local"

HOSTING.write_text(
    """# Hosting / Cloudflare DNS refs
VERCEL_PROJECT=wisdomwear
CLOUDFLARE_ZONE_NAME=wisdomwear.com.br
CLOUDFLARE_WISDOMWEAR_DOMAIN=wisdomwear.com.br
CLOUDFLARE_WISDOMWEAR_ZONE_ID=f56158fccbfc1df60837bdc397e14682
WISDOMWEAR_DOMAIN=wisdomwear.com.br
WISDOMWEAR_CF_NS1=amy.ns.cloudflare.com
WISDOMWEAR_CF_NS2=sterling.ns.cloudflare.com
""",
    encoding="utf-8",
)

subprocess.check_call(
    [sys.executable, str(ROOT / "scripts" / "build_env_local.py")],
    cwd=str(ROOT),
)

# Copy generated → root .env.local
ROOT_ENV.write_text(GENERATED.read_text(encoding="utf-8"), encoding="utf-8")

# Ensure NS keys present (idempotent upsert)
keys = {
    "WISDOMWEAR_CF_NS1": "amy.ns.cloudflare.com",
    "WISDOMWEAR_CF_NS2": "sterling.ns.cloudflare.com",
    "CLOUDFLARE_WISDOMWEAR_ZONE_ID": "f56158fccbfc1df60837bdc397e14682",
    "CLOUDFLARE_WISDOMWEAR_DOMAIN": "wisdomwear.com.br",
    "WISDOMWEAR_DOMAIN": "wisdomwear.com.br",
}

lines = ROOT_ENV.read_text(encoding="utf-8").splitlines()
seen = set()
out = []
for line in lines:
    if "=" in line and not line.strip().startswith("#"):
        k = line.split("=", 1)[0].strip()
        if k in keys:
            out.append(f"{k}={keys[k]}")
            seen.add(k)
            continue
    out.append(line)
for k, v in keys.items():
    if k not in seen:
        out.append(f"{k}={v}")

ROOT_ENV.write_text("\n".join(out) + "\n", encoding="utf-8")

for k in keys:
    for line in ROOT_ENV.read_text(encoding="utf-8").splitlines():
        if line.startswith(f"{k}="):
            print(line)
            break

# Fix package.json script note via print
print("OK .env.local atualizado")
