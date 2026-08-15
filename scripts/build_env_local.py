from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "env" / "catalog.json"
DEFAULT_OUTPUT_PATH = ROOT / "env" / "generated" / ".env.local"
LEGACY_ROOT_ENV = ROOT / ".env.local"


def parse_env_file(path: Path) -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        pairs.append((key.strip(), value))
    return pairs


def discover_unlisted_files(merge_order: list[str]) -> list[Path]:
    env_local_dir = ROOT / "env" / "local"
    listed = {(ROOT / p).resolve() for p in merge_order}
    found = []
    for f in sorted(env_local_dir.rglob("*.env")):
        if f.resolve() not in listed:
            found.append(f)
    return found


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Monta env/generated/.env.local a partir de env/local/**"
    )
    parser.add_argument(
        "--write-root",
        action="store_true",
        help="Sobrescreve .env.local da raiz (perigoso — use com cuidado).",
    )
    parser.add_argument(
        "--output",
        help="Caminho de saída alternativo. Padrão: env/generated/.env.local",
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="Exibe chaves com valor vazio no resultado final.",
    )
    parser.add_argument(
        "--diff",
        action="store_true",
        help="Compara o resultado gerado com .env.local da raiz (drift detection).",
    )
    args = parser.parse_args()

    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    merge_order: list[str] = catalog["merge_order"]
    output_path = Path(args.output).resolve() if args.output else DEFAULT_OUTPUT_PATH

    if output_path == LEGACY_ROOT_ENV and not args.write_root:
        print(
            "RECUSADO: sobrescrever .env.local da raiz sem --write-root.",
            file=sys.stderr,
        )
        sys.exit(2)

    # ── Arquivos não cadastrados no merge_order ───────────────────
    unlisted = discover_unlisted_files(merge_order)
    if unlisted:
        print("AVISO: arquivos em env/local/ não listados em catalog.json merge_order:")
        for f in unlisted:
            print(f"  {f.relative_to(ROOT)}")
        print()

    # ── Merge em ordem (last-wins) ────────────────────────────────
    merged: dict[str, str] = {}      # key → last value
    sources: dict[str, str] = {}     # key → last source file
    duplicates: dict[str, list[str]] = {}

    for rel_path in merge_order:
        source = ROOT / rel_path
        if not source.exists():
            continue
        for key, value in parse_env_file(source):
            if key in merged:
                duplicates.setdefault(key, []).append(rel_path)
            merged[key] = value
            sources[key] = rel_path

    # ── Validação: vars com valor vazio ───────────────────────────
    empty_keys = [k for k, v in merged.items() if v == ""]
    if args.validate or empty_keys:
        if empty_keys:
            print(f"VARS VAZIAS ({len(empty_keys)}) — preencher antes de usar em produção:")
            for k in sorted(empty_keys):
                print(f"  {k}  <- {sources[k]}")
            print()

    # ── Gerar saída (preserva ordem de inserção) ─────────────────
    lines = [
        "# =============================================",
        "# .env.local — arquivo de compatibilidade gerado",
        "# Fonte: env/local/**",
        "# Catalogo: env/catalog.json",
        "# Gerado por: python scripts/build_env_local.py",
        "# NÃO EDITAR DIRETAMENTE — editar os arquivos em env/local/",
        "# =============================================",
        "",
    ]

    for key, value in merged.items():
        lines.append(f"{key}={value}")

    lines.append("")

    if duplicates:
        lines.append("# Chaves sobrescritas (last-wins):")
        for key in sorted(duplicates):
            refs = ", ".join(duplicates[key])
            lines.append(f"# {key}: reescrita(s) em {refs}")
        lines.append("")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")

    print(f"Gerado:    {output_path}")
    print(f"Variáveis: {len(merged)} ({len(empty_keys)} vazias)")
    if duplicates:
        print(f"Duplicatas: {len(duplicates)} chaves sobrescritas (ver comentários no arquivo)")

    # ── Diff contra .env.local raiz ───────────────────────────────
    if args.diff and LEGACY_ROOT_ENV.exists():
        print()
        print("-- DRIFT vs .env.local da raiz --------------------------")
        legacy: dict[str, str] = {}
        for k, v in parse_env_file(LEGACY_ROOT_ENV):
            legacy[k] = v

        only_in_legacy = sorted(set(legacy) - set(merged))
        only_in_generated = sorted(set(merged) - set(legacy))
        value_differs = sorted(
            k for k in set(legacy) & set(merged)
            if legacy[k] != merged[k]
        )

        if only_in_legacy:
            print(f"\n  Em .env.local mas FALTANDO em env/local/** ({len(only_in_legacy)}):")
            for k in only_in_legacy:
                print(f"    - {k}")

        if only_in_generated:
            print(f"\n  Em env/local/** mas AUSENTES em .env.local ({len(only_in_generated)}):")
            for k in only_in_generated:
                print(f"    + {k}")

        if value_differs:
            print(f"\n  Valores diferentes ({len(value_differs)}) — .env.local raiz tem valor distinto:")
            for k in value_differs:
                print(f"    ~ {k}  (raiz: {'<vazio>' if not legacy[k] else '<valor>'} | gerado: {'<vazio>' if not merged[k] else '<valor>'})")

        if not any([only_in_legacy, only_in_generated, value_differs]):
            print("  Sem drift — env/local/** e .env.local estão em sincronia.")


if __name__ == "__main__":
    main()
