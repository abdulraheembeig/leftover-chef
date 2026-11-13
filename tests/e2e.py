"""Browser checks for Leftover Chef.

Part A follows the DOC-02 judge runbook, recording proof/leftover-chef-demo.webm
and the six screenshots in proof/. Part B runs the DOC-03 five-test checklist.

Run from the project folder:  python3 tests/e2e.py
Needs: pip install playwright && playwright install chromium
"""
import asyncio, os, pathlib, shutil
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
# LC_FILE=path/to/leftover-chef.html tests the single-file build instead.
URL = pathlib.Path(os.environ.get("LC_FILE", ROOT / "index.html")).resolve().as_uri()
SKIP_RUNBOOK = bool(os.environ.get("LC_FILE"))
PROOF = ROOT / "proof"
results = []


def check(name, ok, detail=""):
    results.append((name, ok))
    print(("  PASS " if ok else "  FAIL ") + name + (f" — {detail}" if detail and not ok else ""))


async def runbook(p):
    PROOF.mkdir(exist_ok=True)
    vid = PROOF / "_vid"
    ctx = await p.new_context(viewport={"width": 1280, "height": 860}, record_video_dir=str(vid),
                                       record_video_size={"width": 1280, "height": 860})
    pg = await ctx.new_page()
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    w = pg.wait_for_timeout
    await pg.goto(URL); await w(1200)
    await pg.click("#ck-essential"); await w(500)
    # 1 starting state
    await pg.screenshot(path=str(PROOF / "1-pick-ingredients.png"), full_page=True)
    # 2 search
    await pg.click("#search"); await pg.keyboard.type("pan", delay=120); await w(500); await pg.keyboard.press("Enter"); await w(900)
    # 3 meal filter
    await pg.click("label[for=meal-breakfast]"); await w(1200)
    await pg.click("label[for=meal-all]"); await w(600)
    # 4 detail, shopping, cook mode
    await pg.click('button[data-open="0"]'); await w(900)
    await pg.click("#start-timer"); await w(1500)
    await pg.screenshot(path=str(PROOF / "2-recipe-detail-and-score.png"))
    if await pg.locator("#detail-shop").count():
        await pg.click("#detail-shop"); await w(700)
    await pg.click("#start-cook"); await w(800)
    await pg.click("#cook-next"); await w(800)
    await pg.screenshot(path=str(PROOF / "3-cook-mode.png"))
    await pg.click("#cook-next"); await w(800)
    await pg.click("#cook-exit"); await w(600)
    # 5 restaurant mode
    await pg.click("label[for=mode-restaurant]"); await w(1200)
    await pg.screenshot(path=str(PROOF / "6-restaurant-mode.png"), full_page=True)
    # 6 surprise
    await pg.click("#surprise"); await w(1500)
    # 7 twist
    await pg.click("label[for=mode-home]"); await w(400)
    await pg.click("#clear"); await w(300)
    await pg.click("label[for=tw-three]"); await w(900)
    for i in ["rice", "egg", "onion"]:
        await pg.click(f"label[for=ing-{i}]"); await w(500)
    await w(700)
    await pg.screenshot(path=str(PROOF / "4-three-ingredient-lock-match.png"), full_page=True)
    # 8 no match + swap
    await pg.click("label[for=ing-onion]"); await w(400)
    await pg.click("label[for=ing-banana]"); await w(1300)
    await pg.screenshot(path=str(PROOF / "5-three-ingredient-lock-no-match.png"), full_page=True)
    await pg.click(".sug"); await w(1300)
    # docs page
    await pg.click("a[href='#docs']"); await w(1500)
    await ctx.close()
    webm = next(vid.glob("*.webm"))
    shutil.move(str(webm), str(PROOF / "leftover-chef-demo.webm")); shutil.rmtree(vid)
    check("Runbook runs with no page errors", not errors, "; ".join(errors))


async def five_tests(p):
    ctx = await p.new_context(viewport={"width": 1280, "height": 900})
    pg = await ctx.new_page()
    errors, outside = [], []
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    pg.on("request", lambda r: outside.append(r.url) if not r.url.startswith(("file:", "data:", "blob:")) else None)
    pg.on("requestfailed", lambda r: errors.append("failed load: " + r.url[:80]))
    await pg.goto(URL)
    await pg.click("#ck-essential")
    txt = lambda sel: pg.locator(sel).inner_text()

    # 1 Invalid input
    await pg.click("label[for=tw-three]"); await pg.click("#clear")
    await pg.click("label[for=ing-rice]"); await pg.click("label[for=ing-egg]")
    t1 = await txt("#results")
    await pg.fill("#search", "zzz"); await pg.press("#search", "Enter")
    m1 = await txt("#search-msg")
    check("1 Invalid input: lock asks for exactly 3; unknown search explained",
          "Pick exactly 3 ingredients (2 of 3 picked)" in t1 and 'No ingredient matches "zzz"' in m1, t1 + " | " + m1)
    await pg.fill("#search", "")
    await pg.click("label[for=tw-three]")

    # 2 Happy path
    await pg.click("#reset-demo"); await pg.click("#ck-essential")
    cards = await pg.locator(".card").count()
    first_match = await pg.locator(".card .match").first.inner_text()
    await pg.click('button[data-open="0"]')
    has_steps = await pg.locator("#detail .steps li").count() > 0
    await pg.click("#start-cook")
    step = await txt(".cook-step")
    check("2 Happy path: ranked cards, detail with steps, Cook Mode at step 1",
          cards > 3 and "MATCH" in first_match.upper() and has_steps and "STEP 1 OF" in step.upper(), f"{cards} {first_match} {step}")
    await pg.click("#cook-exit")

    # 3 Twist check
    await pg.click("#clear"); await pg.click("label[for=tw-three]")
    for i in ["rice", "egg", "onion"]:
        await pg.click(f"label[for=ing-{i}]")
    n = await pg.locator(".card").count()
    all3 = await pg.locator(".card .badge", has_text="Uses all 3").count()
    await pg.click("label[for=ing-onion]"); await pg.click("label[for=ing-banana]")
    t3 = await txt("#results")
    swaps = await pg.locator(".sug").count()
    check("3 Twist: only all-three recipes, then a clear no-match with swaps",
          n > 0 and all3 == n and "No recipe uses all three" in t3 and swaps > 0, f"{n} {all3} {swaps}")

    # 4 Reset / refresh
    await pg.click("label[for=tw-three]")
    await pg.click("label[for=ing-paneer]")
    await pg.click('button[data-shop="0"]') if await pg.locator('button[data-shop="0"]').count() else None
    await pg.click("#reset-demo")
    picked = await pg.locator(".chip.on input[id^=ing-]").count()
    shop_empty = "Nothing yet" in await txt("#shopping")
    banner = await pg.locator("#cookie").is_visible()
    await pg.reload()
    picked2 = await pg.locator("#pantry .chip.on").count()
    check("4 Reset/refresh: 4 default picks, empty list, banner back; same after refresh",
          picked == 4 and shop_empty and banner and picked2 == 4, f"{picked} {shop_empty} {banner} {picked2}")
    await pg.click("#ck-essential")

    # 5 Boundary
    await pg.click("label[for=tw-three]"); await pg.click("label[for=ing-tomato]")  # back to 3
    fourth_disabled = await pg.locator("#ing-milk").is_disabled()
    await pg.click("label[for=tw-three]")
    await pg.select_option("#f-diet", "veg"); await pg.select_option("#f-time", "10"); await pg.click("label[for=meal-dessert]")
    t5 = await txt("#results")
    await pg.click(".sug")
    back = await pg.locator(".card").count()
    check("5 Boundary: 4th chip locked; strict filters explained and Clear filters restores",
          fourth_disabled and "Your filters hide every match" in t5 and back > 0, f"{fourth_disabled} {back}")

    # Pages
    for h, title in [("privacy", "Privacy Policy"), ("terms", "Terms"), ("refunds", "Refund Policy"), ("cookies", "Cookies Policy"), ("docs", "DOC-06")]:
        await pg.goto(URL + "#" + h)
        ok = title in await txt("#view-page")
        check(f"Page #{h} renders", ok)
    imgs_ok = await pg.evaluate("[...document.querySelectorAll('#view-page img')].every(i => i.alt.length > 30)")
    check("Every image has descriptive alt text", imgs_ok)
    check("No page errors, console errors or failed loads", not errors, "; ".join(errors))
    check("No requests to other websites", not outside, "; ".join(outside))
    fonts = await pg.evaluate("document.fonts.check('16px \"Instrument Sans\"') && document.fonts.check('16px \"Alfa Slab One\"')")
    check("Fonts load from inside the file", fonts)
    await pg.goto(URL + "#docs"); await pg.wait_for_timeout(600)
    loaded = await pg.evaluate("[...document.querySelectorAll('#view-page img')].every(i => i.complete && i.naturalWidth > 0)")
    check("Doc screenshots display", loaded)
    await ctx.close()


async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        if not SKIP_RUNBOOK:
            await runbook(b)
        await five_tests(b)
        await b.close()
    failed = [n for n, ok in results if not ok]
    print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
    raise SystemExit(1 if failed else 0)

asyncio.run(main())
