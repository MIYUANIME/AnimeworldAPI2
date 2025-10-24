import re
import urllib.parse
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from playwright.async_api import async_playwright

# ---------------- Logging Setup ----------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger(__name__)

# ------------------------------------------------
VIDEO_RE = re.compile(r"https://play\.zephyrflick\.top/video/[A-Za-z0-9\-_]+", re.IGNORECASE)
NAV_TIMEOUT = 20_000  # shorter timeout

app = FastAPI(title="animedekho-video-finder", version="1.3")


class FindRequest(BaseModel):
    title: str
    season: str
    episode: str


class FindResponse(BaseModel):
    found: Optional[str]
    error: Optional[str] = None


def make_slugs(animetitle: str) -> List[str]:
    base = animetitle.strip().lower()
    base = re.sub(r"[^\w\s-]", "", base)
    base = re.sub(r"\s+", "-", base)
    base = re.sub(r"-+", "-", base)
    return [base, urllib.parse.quote_plus(base)]


def make_candidate_urls(slug: str, season: str, episode: str) -> List[str]:
    return [
        f"https://animedekho.co/epi/{slug}-{season}x{episode}/",
    ]


async def find_video_url(candidate_urls):
    logger.info(f"Launching browser to scan {len(candidate_urls)} candidate URL(s)")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-blink-features=AutomationControlled",
            ]
        )

        found_url = None

        for attempt in range(1, 11):  # up to 10 retries
            logger.info(f"🔄 Attempt {attempt}")

            context = await browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/127.0.0.0 Safari/537.36"
                ),
                viewport={"width": 1920, "height": 1080},
                java_script_enabled=True,
                locale="en-US",
                timezone_id="America/New_York",
            )

            # Hide Playwright detection
            await context.add_init_script("""
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                window.chrome = { runtime: {} };
                Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
                Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
            """)

            def check_url(url):
                nonlocal found_url
                if not found_url:
                    m = VIDEO_RE.search(url)
                    if m:
                        found_url = m.group(0)
                        logger.info(f"✅ Found matching video URL: {found_url}")

            context.on("request", lambda req: check_url(req.url))
            context.on("response", lambda res: check_url(res.url))

            page = await context.new_page()

            for url in candidate_urls:
                if found_url:
                    break

                try:
                    logger.info(f"🌐 Visiting: {url}")
                    await page.goto(url, wait_until="domcontentloaded", timeout=NAV_TIMEOUT)

                    # Optional: Click play if needed
                    play_button = await page.query_selector("button[aria-label='Play']")
                    if play_button:
                        logger.info("▶ Clicking Play button")
                        await play_button.click()

                    # Wait for the video request to appear
                    try:
                        await page.wait_for_request(
                            lambda req: VIDEO_RE.search(req.url),
                            timeout=15_000
                        )
                    except:
                        logger.warning("⌛ Video request not detected in time")

                    if found_url:
                        break

                except Exception as e:
                    logger.warning(f"⚠ Failed to load {url} | {e}")
                    continue

            await context.close()

            if found_url:
                break
            else:
                logger.info("❌ No match found this attempt, retrying...")

        await browser.close()
        return found_url



async def _do_find(title: str, season: str, episode: str) -> FindResponse:
    if not title or not season or not episode:
        raise HTTPException(status_code=400, detail="title, season and episode are required")

    logger.info(f"🔍 Searching for: title='{title}', season={season}, episode={episode}")

    candidates = []
    for slug in make_slugs(title):
        new_urls = make_candidate_urls(slug, season, episode)
        candidates.extend(new_urls)
        logger.info(f"Generated URLs for slug '{slug}': {new_urls}")

    try:
        found = await find_video_url(candidates)
        if not found:
            logger.info("❌ No matching video found.")
        return FindResponse(found=found)
    except Exception as e:
        logger.error(f"💥 Error during search: {e}")
        return FindResponse(found=None, error=str(e))


@app.post("/find", response_model=FindResponse)
async def find_video(req: FindRequest):
    return await _do_find(req.title, req.season, req.episode)


@app.get("/find", response_model=FindResponse)
async def find_video_query(title: str, season: str, episode: str):
    return await _do_find(title, season, episode)
