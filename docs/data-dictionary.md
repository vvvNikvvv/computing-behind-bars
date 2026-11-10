# Data dictionary

The site reads two files: `data/programs.csv` and `data/sources.csv`. Keep the column names exactly as written. Each row in `programs.csv` is one program at one facility, and a facility with several programs gets several rows. The map groups rows that share the same `institution` and `state` into one marker.

## programs.csv

| Column | Required | Allowed values / format | Notes |
|---|---|---|---|
| `id` | yes | e.g. `CA-001` | Unique and never reused. |
| `institution` | yes | text | Official facility name. Must be spelled the same way on every row for the same facility. |
| `city` | yes | text | |
| `state` | yes | two-letter code, e.g. `CA` | |
| `latitude` | yes | decimal, e.g. `32.5834` | The facility's location, from its public address. Right-click the spot in Google Maps to copy coordinates. |
| `longitude` | yes | decimal, e.g. `-116.9274` | Negative for the U.S. |
| `education_partner` | yes | text | The college, university, or nonprofit that runs the program. |
| `partner_type` | yes | `Public university`, `Private college`, `Community college`, `Nonprofit`, `Corrections department` | Add a new value only if the team agrees. It will appear as a filter automatically. |
| `computing_offering` | yes | text; separate items with `;` | e.g. `Intro to programming (CS1); Data structures` |
| `program_type` | yes | `Degree pathway`, `Certificate`, `Standalone course`, `Other computing education` | Must match exactly. These drive the marker colors. |
| `credential` | yes | e.g. `Associate degree`, `Bachelor's degree`, `Certificate`, `None` | |
| `credential_field` | yes | `Computing`, `Non-computing`, `None` | Is the credential itself in a computing field? A CS course inside a sociology BA is `Non-computing`. |
| `description` | yes | 1–3 neutral sentences | Describe, don't evaluate. |
| `source_title` | yes | text | Shown as the link text. |
| `source_url` | yes | full URL | The page that supports this record. Add it to `sources.csv` too. |
| `last_verified` | yes | `YYYY-MM-DD` | The date a team member last checked the source. |
| `verification_status` | yes | `verified`, `pending`, `historical`, `example` | `pending` rows are hidden by default. Delete every `example` row before the final submission. |

## sources.csv

| Column | Notes |
|---|---|
| `id` | `S01`, `S02`, … Pages can link to a source with `sources.html#S01`. |
| `author_org` | Author(s) or organization. |
| `title` | Title of the page, report, or paper. |
| `date` | Publication date, or the year. Use `n.d.` if there is none. |
| `url` | Full link. |
| `category` | Groups the list on the site, e.g. `Program directory`, `University program page`, `Government / policy`, `Academic research`, `News`. |
| `used_for` | What on the site this source supports, e.g. `CA-001 record; History timeline (2023)`. |
| `notes` | Known limitations of the source, if any. |

## Editing the data in Google Sheets

1. Import the CSV into a Google Sheet (File → Import), edit it there, then go to File → Download → CSV.
2. Replace the file in `data/` and commit it.
3. Check that your spreadsheet tool didn't rename columns or reformat dates.
