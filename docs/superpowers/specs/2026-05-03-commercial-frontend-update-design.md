# Commercial Frontend Update Design

## Context

Ops2EBITDA is evolving from a static private equity operations knowledge base into a public content platform with a paid library of downloadable operating assets. The free knowledge base should continue to teach users how PE value creation works. The paid offerings should help users do the work through Excel models, AI project kits, and skill packages.

This first pass is frontend-only. It should not add Lemon Squeezy product IDs, checkout behavior, authentication, user accounts, entitlements, or backend storage.

## Approved Direction

Use a hybrid operating library model.

The site should keep the knowledge base as the trusted center of gravity while making paid offerings visible as the next practical step. The commercial layer should feel like a natural extension of the content, not a separate storefront bolted onto the side.

## Navigation

Replace the current long top navigation with three primary destinations:

- Knowledge Base
- Offerings
- Start Here

Knowledge Base should expose the existing library sections:

- Fundamentals
- Playbooks
- Industries
- KPIs

Offerings should route to a dedicated paid catalog page.

Start Here can use the current study/orientation surface for now, adjusted later if needed. Login should remain out of this pass.

## Dashboard

Revamp the dashboard as a hybrid operating library:

- Keep search prominent.
- Keep featured briefings and operator agenda central.
- Add a commercial rail or section for paid operating assets.
- Use placeholders for Lemon Squeezy purchase actions.
- Avoid a heavy sales hero, subscription dashboard, or generic SaaS metric layout.

The dashboard should communicate: learn the operating logic here, then use the paid assets to execute faster.

## Offerings Page

Create a dedicated offerings page that presents:

- Excel Models
- AI Project Kits
- Skill Packages
- Bundles

Use the existing product material in the `Offerings` folder as the source of truth for launch copy and pricing.

Initial prices:

- Single Excel Model: $99
- Single AI Project Kit: $49
- Single Skill Package: $39
- Core Model Bundle: $399
- AI Project Library: $299
- Skill Package Library: $179
- Full Ops2EBITDA Toolkit: $699

Purchase actions should be non-functional placeholders labeled for future Lemon Squeezy wiring.

## Data Shape

Keep offering data static for this pass. A small local module is enough if it improves reuse between the dashboard and offerings page.

Suggested data fields:

- `title`
- `category`
- `price`
- `description`
- `items`
- `featured`
- `futureCheckoutLabel`

Do not introduce a database, external dependency, CMS, or payment SDK in this pass.

## Visual Direction

Follow the existing project direction:

- Quiet, readable, consulting-grade product UI.
- Restrained colors and simple hierarchy.
- No decorative ecommerce treatment.
- No large glossy hero, novelty gradients, or noisy card grids.
- Paid offerings should feel credible, practical, and close to the operating content.

## Error And Empty States

Because the page is static, error handling is limited:

- Placeholder purchase buttons should clearly indicate that checkout wiring is coming later.
- Missing product data should fail visibly during development rather than silently rendering blank cards.
- The page should remain useful without login or account state.

## Testing

Verification should include:

- Lint.
- Typecheck.
- Production build.
- Manual visual check in browser for desktop and mobile widths.
- Confirm nav active states work for dashboard, Knowledge Base child routes, Offerings, and Start Here.

## Out Of Scope

- Lemon Squeezy embeds or checkout scripts.
- Product ID management.
- Login flow.
- Account dashboard.
- Purchased-product access control.
- Backend APIs.
- Email capture or CRM integration.
- Subscription logic.
