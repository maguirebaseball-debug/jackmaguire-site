import os
import sys
from pathlib import Path
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest,
    DateRange,
    Metric,
    Dimension,
    OrderBy,
    FilterExpression,
    Filter,
)

PROPERTY_ID = "530019465"
KEY_PATH = Path(__file__).resolve().parent.parent / "google-service-account.json"

if not KEY_PATH.exists():
    print(f"Key file not found at {KEY_PATH}")
    sys.exit(1)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(KEY_PATH)
client = BetaAnalyticsDataClient()

def pull_overview():
    print("=" * 70)
    print("1. TRAFFIC CHANNELS (Last 30 Days)")
    print("=" * 70)
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="sessionDefaultChannelGroup")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="engagedSessions"),
            Metric(name="engagementRate"),
            Metric(name="userEngagementDuration"),
        ],
        date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
    )
    res = client.run_report(request)
    print(f"{'Channel':<25} {'Sessions':<10} {'Users':<10} {'Engaged':<10} {'Eng. Rate':<12} {'Avg Time (s)':<12}")
    print("-" * 80)
    for row in res.rows:
        channel = row.dimension_values[0].value
        sessions = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)
        engaged = int(row.metric_values[2].value)
        rate = float(row.metric_values[3].value) * 100
        total_time = float(row.metric_values[4].value)
        avg_time = (total_time / sessions) if sessions > 0 else 0
        print(f"{channel:<25} {sessions:<10} {users:<10} {engaged:<10} {rate:>8.1f}% {avg_time:>10.1f}s")
    print()

def pull_organic_landing_pages():
    print("=" * 70)
    print("2. TOP ORGANIC SEARCH LANDING PAGES & ENGAGEMENT (Last 30 Days)")
    print("=" * 70)
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="landingPagePlusQueryString")],
        metrics=[
            Metric(name="sessions"),
            Metric(name="totalUsers"),
            Metric(name="engagedSessions"),
            Metric(name="engagementRate"),
            Metric(name="userEngagementDuration"),
        ],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="sessionDefaultChannelGroup",
                string_filter=Filter.StringFilter(value="Organic Search"),
            )
        ),
        date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)],
        limit=25,
    )
    res = client.run_report(request)
    if not res.rows:
        print("No organic search rows returned for the last 30 days.")
        return

    print(f"{'Landing Page':<50} {'Sessions':<9} {'Users':<8} {'Engaged':<8} {'Eng. Rate':<10} {'Avg Time':<10}")
    print("-" * 100)
    for row in res.rows:
        page = row.dimension_values[0].value[:48]
        sessions = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)
        engaged = int(row.metric_values[2].value)
        rate = float(row.metric_values[3].value) * 100
        total_time = float(row.metric_values[4].value)
        avg_time = (total_time / sessions) if sessions > 0 else 0
        print(f"{page:<50} {sessions:<9} {users:<8} {engaged:<8} {rate:>8.1f}% {avg_time:>8.1f}s")
    print()

def pull_top_pages_all_traffic():
    print("=" * 70)
    print("3. TOP PAGES ACROSS ALL CHANNELS (Last 30 Days)")
    print("=" * 70)
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="pagePath")],
        metrics=[
            Metric(name="screenPageViews"),
            Metric(name="totalUsers"),
            Metric(name="userEngagementDuration"),
        ],
        date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"), desc=True)],
        limit=20,
    )
    res = client.run_report(request)
    print(f"{'Page Path':<50} {'Pageviews':<12} {'Users':<10} {'Avg Time (s)':<12}")
    print("-" * 85)
    for row in res.rows:
        path = row.dimension_values[0].value[:48]
        views = int(row.metric_values[0].value)
        users = int(row.metric_values[1].value)
        total_time = float(row.metric_values[2].value)
        avg_time = (total_time / users) if users > 0 else 0
        print(f"{path:<50} {views:<12} {users:<10} {avg_time:>10.1f}s")
    print()

if __name__ == "__main__":
    try:
        pull_overview()
        pull_organic_landing_pages()
        pull_top_pages_all_traffic()
    except Exception as e:
        print(f"Execution error: {e}")
