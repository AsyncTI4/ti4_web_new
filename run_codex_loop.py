#!/usr/bin/env python3
from argparse import ArgumentParser
import os
import subprocess
import sys
import time

PROMPT = (
    "hi analyze this code base for one clear examples of duplication that should be "
    "extracted either to a utility method, or in the case of react components a "
    "shared presentational-only react component that is then leveraged. do this "
    "without overly doing it with the abstractions and when creating extracted "
    "utility/component methods think hard relative to project structure where they should "
    "be located and then fix. when done with the fix create a local commit with the changes "
    "but do not push. use an intelligent commit message"
)

parser = ArgumentParser(description="Run codex exec repeatedly.")
parser.add_argument("count", type=int, help="Number of attempts to run.")
parser.add_argument(
    "--interval",
    type=float,
    default=float(os.environ.get("INTERVAL_SECONDS", "0.5")),
    help="Seconds to wait between attempts.",
)
parser.add_argument(
    "--workdir",
    default=os.environ.get("WORKDIR", os.getcwd()),
    help="Working directory for codex.",
)
parser.add_argument(
    "--show-command",
    action="store_true",
    help="Print the exact codex command before each attempt.",
)
args = parser.parse_args()

MODEL_CANDIDATES = [
    "gpt-5.3-codex-spark",
    "gpt-5-codex-spark",
    "codex-spark",
    "gpt-5-codex",
]


def pick_model(workdir: str) -> str:
    for model in MODEL_CANDIDATES:
        probe_cmd = [
            "codex",
            "exec",
            "--sandbox",
            "read-only",
            "--model",
            model,
            "-c",
            'reasoning_effort="low"',
            "--cd",
            workdir,
            "reply with one word: ok",
        ]
        result = subprocess.run(probe_cmd, text=True, capture_output=True)
        if result.returncode == 0:
            return model
    return ""


selected_model = pick_model(args.workdir)
if not selected_model:
    print("No supported codex model found for this account.")
    sys.exit(1)

print(f"Using model: {selected_model} (reasoning_effort=low)")

for i in range(1, args.count + 1):
    cmd = [
        "codex",
        "exec",
        "--dangerously-bypass-approvals-and-sandbox",
        "--sandbox",
        "danger-full-access",
        "--model",
        selected_model,
        "-c",
        'reasoning_effort="low"',
        "--cd",
        args.workdir,
        PROMPT,
    ]

    if args.show_command:
        print(f"[{i}/{args.count}] command: {' '.join(cmd)}")
    print(f"[{i}/{args.count}] running codex...")

    result = subprocess.run(cmd, text=True)
    if result.returncode != 0:
        print(f"[{i}/{args.count}] failed with exit code {result.returncode}")

    if i < args.count:
        time.sleep(args.interval)
