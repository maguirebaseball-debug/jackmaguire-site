#!/usr/bin/env python3
"""
btc_200dma_alert.py

Checks whether BTC's spot price has crossed its 200-day simple moving average
since the last run. Fires a macOS notification ONLY on a cross (no daily spam).

- Data: CoinGecko free public API (no key needed).
- Math: 200-day SMA of daily closes vs current price.
- State: remembers which side of the MA we were on, so it only alerts on a flip.
- Deps: Python standard library only (urllib). No pip install required.

Run manually:   python3 scripts/btc_200dma_alert.py
Force a test alert with the last computed values: add --test

Exit codes: 0 = ran fine (whether or not it alerted), 1 = error.
"""
import json
import os
import ssl
import sys
import subprocess
import urllib.request
from datetime import datetime, timezone

try:
    import certifi
    SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    SSL_CTX = ssl.create_default_context()

STATE_FILE = os.path.expanduser("~/.btc_200dma_state.json")
LOG_FILE = os.path.expanduser("~/.btc_200dma.log")
API_URL = (
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
    "?vs_currency=usd&days=220"
)
SMA_WINDOW = 200


def log(msg):
    line = f"{datetime.now(timezone.utc).isoformat()}  {msg}"
    print(line)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except OSError:
        pass


def fetch_daily_closes():
    req = urllib.request.Request(
        API_URL, headers={"User-Agent": "btc-200dma-alert/1.0"}
    )
    with urllib.request.urlopen(req, timeout=30, context=SSL_CTX) as resp:
        data = json.load(resp)
    # prices is a list of [unix_ms, price]; days>90 returns daily granularity.
    prices = [p[1] for p in data.get("prices", []) if p and p[1] is not None]
    if len(prices) < SMA_WINDOW + 1:
        raise RuntimeError(
            f"Only got {len(prices)} price points, need {SMA_WINDOW + 1}."
        )
    return prices


def notify(title, message):
    """macOS notification via osascript. Falls back to log if unavailable."""
    try:
        subprocess.run(
            [
                "osascript",
                "-e",
                f'display notification "{message}" with title "{title}" sound name "Glass"',
            ],
            check=True,
        )
    except Exception as e:  # noqa: BLE001
        log(f"notify failed ({e}); message was: {title} - {message}")


def load_state():
    try:
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return {}


def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


def main():
    test = "--test" in sys.argv
    try:
        prices = fetch_daily_closes()
    except Exception as e:  # noqa: BLE001
        log(f"ERROR fetching data: {e}")
        return 1

    current = prices[-1]
    sma = sum(prices[-(SMA_WINDOW + 1):-1]) / SMA_WINDOW  # last 200 completed closes
    side = "above" if current >= sma else "below"
    pct = (current - sma) / sma * 100

    log(
        f"BTC=${current:,.0f}  200DMA=${sma:,.0f}  ({pct:+.1f}%)  side={side}"
    )

    state = load_state()
    prev_side = state.get("side")

    crossed = prev_side is not None and side != prev_side

    if crossed or test:
        direction = "ABOVE" if side == "above" else "BELOW"
        notify(
            f"BTC crossed {direction} its 200-day MA",
            f"BTC ${current:,.0f} vs 200DMA ${sma:,.0f} ({pct:+.1f}%)",
        )
        log(f"ALERT fired: crossed from {prev_side} to {side} (test={test})")
    elif prev_side is None:
        log(f"Baseline set (side={side}); no alert on first run.")

    state.update(
        {
            "side": side,
            "price": current,
            "sma200": sma,
            "checked_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    save_state(state)
    return 0


if __name__ == "__main__":
    sys.exit(main())
