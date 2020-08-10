## How the Chavez HS Planner config system works

> TODO remove the gritty details and put them in the code 

The Chavez HS Planner config system is basically a bunch of code that converts 
raw data from CPS into a form that the Chavez HS Planner app can consume.

The raw data that the config system takes is:
* (geoJSON) high school attendance boundaries
* (geoJSON) elementary school attendance boundaries
* (json) a table mapping Chicago's census tracts<sup>1</sup> to CPS Tiers<sup>2</sup>.
* (json) a table of cutoff scores<sup>3</sup> for Selective Enrollment high schools
* (json) a table of cutoff scores for all other (non-Selective-Enrollment) high schools
* (csv) a list of all CPS high school programs and their admissions requirements


Some of this raw data needs to be processed before the app can use it. This is done by code in the `raw-data-processing` folder. The processing done by the `raw-data-processing` code is:
* The elementary school and high school attendance boundary geoJSON files:
    * are normalized to remove some deep nesting
    * their coordinate precision is reduced to bring the filesize down to something manageable.
* The high school admissions requirements are processed by making the following changes:
    * convert to JSON
    * add app-specific unique `id`  for each program
    * add a link to Highschool Bound (a website that gives detailed information about each CPS school)
    * fix some common typos and encoding errors in several fields
    * (most importantly) add a *selection requirement function id and an application requirement function id* <sup>4</sup>.
    This links each application and selection requirement to its matching **requirement function**<sup>5</sup> in `src/shared/requirement-functions/requirement-functions.ts`.
    The id is created by hashing the description of each application and selection requirement, which are the `Application_Requirement` and `Program_Selections` fields in the raw data.
    
<sup>1</sup> *Technically, the table maps US Census tracts to CPS Tiers. Census tracts are roughly speaking how the US Census subdivides a city into neighborhoods.*

<sup>2</sup> *The CPS Tier system is a rating of Chicago neighborhoods on a socioeconomic scale from 1-4, with 4 being the most well-off. It's used for high school admissions.*

<sup>3</sup> *Cutoff scores are used in some CPS high schools' admissions process. Some schools use a point system to rank applicants. Before the school accepts any students, the school can set a **cutoff score** that all applicants need to score above on the point system in order to be considered.*

<sup>4</sup> *Application and selection requirements are the requirements that
a student must satisfy to be admitted to a CPS high school.
Each program has an application requirement and a selection requirement:
the application requirement determines who can apply, and
the selection requirement determines who can get in. For
example, Lowe High School may have an application requirement
 `student's gpa must be at least 3.0` and a selection
requirement `students are selected by random lottery`.*

<sup>5</sup> *Requirement functions are the core of the Chavez HS Planner app. They are the translation of each program's application requirements and selection requirements into code. A requirement function takes as input a student's academic data and outputs the student's likelihood of being accepted.*

## How to update the app with new data
If new data becomes available -- for example, if schools' program application and selection requirements are updated -- follow these steps to update the app with the new data.

1. Create a new folder `config/raw-data/[date]` with today's date in `yyyy-mm-dd` format, e.g. `config/raw-data/2018-11-15/`.
2. Put the new raw data files in that folder. (See [#How to get the raw data](#how-to-get-the-raw-data)). If some raw data files have not changed, make a copy of of the most recent version.  Once you've done this, `config/raw-data/[date]/` should contain these files:
    * `program-data.csv`
    * `se-cutoff-scores.json`
    * `non-se-cutoff-scores.json`
    * `tract-tier-table.json`
    * `es-attendance-boundaries.geojson`
    * `hs-attendance-boundaries.geojson`
3. From the `config/` folder, run `$ npm run process-raw-data`. This script will process the raw data and save the result to `public/data`. **Running this script will overwrite any files in `public/data`.**
    * If you run into errors here, it's likely that there's something wrong in your raw-data sources. Check your raw data files against old versions of the raw data and against the schema in `config/schema`.
4. **If `program-data.csv` has changed**: You'll also need to update `src/shared/requirement-functions/requirement-functions.ts` with new requirement functions for any new application or selection requirements in the new program data. To help you out, if you run a local version of the app and check the dev console, the website will generate a template of all of the new requirement functions you need to write. You should copy that template and append it to the bottom of the `requirementFunctions` table in `requirement-functions.ts`. You should then write the new requirement functions. For more detail on requirement functions and how to write them, check out `src/shared/requirement-functions/README.md`


## How to get the raw data

#### Attendance boundaries
  * Chicago Open Data Portal: School Attendance Boundary 

#### tract-tier-table
  * links usually maintained at http://cpstiers.opencityapps.org/tier-calculation.html
    * otherwise google fu may be necessary
  * recommend use of tabula to convert to csv, then open in excel and manually clean
    data

#### Cutoff scores
  * check for .pdfs of cutoff scores at https://go.cps.edu/learn/resources
  * I've been manually entering these -- this is probably the most annoying one.

#### program data
  * An updated version may be available at Chicago Open Data Portal: School Admissions Requirements.
  * If there is no recent version of this data, I've written a web scraper that will work in a pinch. In order to use the web scraper, you need to provide it a list of school ids with school latitude/longitude coordinates. This can be found at Chicago Open Data Portal: School Locations.
