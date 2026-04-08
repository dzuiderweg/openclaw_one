# Feature Request

## Title

Make homepage focus on the two real demos

## Problem

The homepage currently includes two cards that are not part of the real user-facing demo experience: **OpenClaw Hook** and **Dev Process Hub**.

These pages appear to be internal or implementation-oriented rather than actual showcase demos. Their presence makes the site feel unfocused and mixes product/demo content with development/process content.

## Desired Outcome

The homepage should present only the two real demos:

* **Form OCR**
* **Design Reasoning Chain**

The **OpenClaw Hook** and **Dev Process Hub** cards should be removed from the homepage, and the pages/routes associated with them should also be removed from the app.

## Scope

In scope:

* Remove the **OpenClaw Hook** card from the homepage
* Remove the **Dev Process Hub** card from the homepage
* Remove the routes/pages associated with those two cards
* Remove obvious homepage references to those two items
* Keep the homepage functional and visually clean after the removal
* Preserve the remaining two demo cards and their links

## Non-Goals

Out of scope:

* Rewriting the Form OCR page
* Rewriting the Design Reasoning Chain page
* Redesigning the entire homepage
* Refactoring unrelated app structure
* Adding new features or new pages
* Backend/OpenClaw integration work
* Internal process redesign beyond removing these two pages from the user-facing app

## Constraints

* Keep changes as small and targeted as possible
* Do not refactor unrelated files unless necessary to remove broken imports/routes
* Do not change the behavior of the remaining demo pages
* Do not introduce new dependencies
* Maintain a working local dev build

## Acceptance Criteria

* [ ] The homepage no longer displays **OpenClaw Hook**
* [ ] The homepage no longer displays **Dev Process Hub**
* [ ] The routes/pages for **OpenClaw Hook** and **Dev Process Hub** are removed or no longer accessible through the app
* [ ] The homepage still displays **Form OCR** and **Design Reasoning Chain**
* [ ] The app runs locally without broken navigation, obvious errors, or references to the removed pages

## Validation Steps

Run the local app and verify behavior.

Suggested validation:

* Run the project locally with the normal dev command (for example: `npm run dev`)
* Open the homepage
* Confirm only these two demo cards remain:

  * **Form OCR**
  * **Design Reasoning Chain**
* Confirm **OpenClaw Hook** and **Dev Process Hub** do not appear on the homepage
* Confirm navigating to the remaining demo pages still works
* Confirm removing the old pages did not break the app build or local routing

If available, also run any existing project validation commands such as:

* `npm run build`
* `npm run lint`
* `npm test`

## Repo Context

The agent should inspect:

* Homepage component/page
* Route definitions
* Page components for:

  * **OpenClaw Hook**
  * **Dev Process Hub**
* Any shared navigation/card configuration used by the homepage

Likely relevant areas:

* main app routing file
* homepage/landing page component
* page files under the app’s route/page structure
* any central card list, config, or navigation data source

## Notes

This is intended as a cleanup/scoping change so the website better reflects the two real demos instead of mixing user-facing demos with internal development concepts.

Priority should be correctness and minimal scope, not broader redesign.

If removing the two pages requires a small cleanup of imports, route registration, or navigation config, that is allowed. Unrelated cleanup is not.
