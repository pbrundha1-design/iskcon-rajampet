from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen


LOCATION = "Madras [India]"
SOURCE_TEMPLATE = "https://www.vaisnavacalendar.info/ICS/{year}/Madras%20%5BIndia%5D-a{year}-ICS.ics"
OUTPUT_PATH = Path("data/vaishnava-calendar.json")


def fetch_text(url: str) -> str:
    request = Request(url, headers={"User-Agent": "ISKCON-Rajampet-calendar-updater/1.0"})
    with urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def unfold_ics(text: str) -> list[str]:
    lines: list[str] = []
    for raw_line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        if raw_line.startswith((" ", "\t")) and lines:
            lines[-1] += raw_line[1:]
        elif raw_line:
            lines.append(raw_line)
    return lines


def clean_value(value: str) -> str:
    value = value.replace("\\,", ",").replace("\\;", ";").replace("\\n", " ")
    value = value.replace("\\'", "'").replace("\\\\", "\\")
    value = re.sub(r"\s+", " ", value).strip()
    return value


def parse_events(ics_text: str) -> list[dict[str, str]]:
    events: list[dict[str, str]] = []
    current: dict[str, str] | None = None

    for line in unfold_ics(ics_text):
        if line == "BEGIN:VEVENT":
            current = {}
            continue

        if line == "END:VEVENT":
            if current and current.get("date") and current.get("title"):
                events.append(current)
            current = None
            continue

        if current is None or ":" not in line:
            continue

        key, value = line.split(":", 1)
        key_name = key.split(";", 1)[0]
        if key_name == "DTSTART":
            date_value = clean_value(value)
            if re.fullmatch(r"\d{8}", date_value):
                current["date"] = f"{date_value[:4]}-{date_value[4:6]}-{date_value[6:]}"
        elif key_name == "SUMMARY":
            current["title"] = clean_value(value)
        elif key_name == "DESCRIPTION":
            description = clean_value(value)
            if description:
                current["description"] = description

    return sorted(events, key=lambda event: (event["date"], event["title"]))


def main() -> int:
    year = int(sys.argv[1]) if len(sys.argv) > 1 else datetime.now().year
    source_url = SOURCE_TEMPLATE.format(year=year)
    ics_text = fetch_text(source_url)
    events = parse_events(ics_text)

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "location": LOCATION,
        "sourceUrl": source_url,
        "events": events,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(events)} events for {LOCATION} ({year}) to {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
