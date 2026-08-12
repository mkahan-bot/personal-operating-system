# Millie’s Medicinals draft website

Static draft website for **Millie’s Medicinals**, a 2–3 product pet CBD tincture brand using the attached fluffy nurse-dog mascot and the sage / cream / muted gold brand direction.

## What was built

- One self-contained `index.html` landing/ecommerce draft.
- Mobile-first responsive design.
- Product architecture for 2 core tinctures plus a launch bundle.
- Draft add-to-cart drawer and checkout placeholder.
- Lab-result/COA search demo with sample lots.
- SEO metadata, Organization/Product JSON-LD, FAQ content, education sections and conversion sections.
- Compliance-sensitive copy that avoids condition-treatment claims.

## Launch product architecture

1. **Everyday Pet CBD Oil 600** — 600 mg CBD / 60 mL / 10 mg CBD per mL / planning retail `$49`.
2. **Everyday Pet CBD Oil 1200** — 1200 mg CBD / 60 mL / 20 mg CBD per mL / planning retail `$64`.
3. **Millie’s Starter Pair** — bundle of both potency options / planning retail `$104`.

## SEO approach included in the draft

Primary keyword targets:

- pet CBD oil
- CBD oil for dogs
- pet CBD tincture
- CBD oil for pets
- pet CBD lab results
- CBD certificate of analysis
- CBD mg per mL

Implementation notes:

- Home title and description are written around transparent pet CBD oil and lab results.
- Product schema is included for the two tincture SKUs.
- Organization schema is included for brand recognition.
- FAQ sections target high-intent trust questions: FDA status, THC, lab reports, dosing directions and shipping limits.
- Education sections intentionally target label-reading and COA topics rather than anxiety, pain, arthritis, seizures or other treatment claims.

## UX / conversion features

- Sticky desktop/mobile navigation.
- Product cards above the fold.
- Clear CBD per bottle and CBD per mL on every SKU.
- Trust strip: lot-specific COAs, simple formulas, jurisdiction-aware checkout.
- Draft cart drawer with local session cart.
- Product comparison table.
- Lab-results demo: `MM-600-DEMO` and `MM-1200-DEMO`.
- Prominent prelaunch compliance notice.

## Required before live commerce

Do not accept live orders until these are complete:

- Regulatory review for animal CBD / hemp / state feed-product and product-label requirements.
- State-by-state may-sell / may-ship matrix.
- Final manufacturer formula and ingredient statement.
- Finished-lot cannabinoid and contaminant COAs.
- Payment processor approval. Do not assume Shopify Payments is available for CBD.
- Product-liability insurance.
- Claims review covering label, website, SEO metadata, social, testimonials, email and ads.
- Real checkout, shipping/tax, age/jurisdiction gating, returns and adverse-event intake.

## Recommended production path

1. Create a dedicated repo named `millies-medicinals` or import this folder into ChatGPT Sites.
2. Replace placeholder domain in canonical metadata and structured data.
3. Add final product photography or generated packshot assets.
4. Connect Shopify or another approved CBD-capable ecommerce/payment stack.
5. Add real COA PDFs and QR routes under `/labs/[lot]`.
6. Expand into separate SEO pages: `/shop`, `/products/everyday-pet-cbd-600`, `/products/everyday-pet-cbd-1200`, `/lab-results`, `/learn`, `/faq`, `/shipping-restrictions`.
7. Run Lighthouse, accessibility, structured-data validation and crawl tests.

This is a draft build, not final regulatory-release artwork or final live-commerce copy.
