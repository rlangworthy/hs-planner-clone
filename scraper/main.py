from urllib import request
import json
import sys
from sys import argv
import csv
import time
import datetime
import re
import signal
from bs4 import BeautifulSoup


INTER_REQUEST_DELAY = 0.5 # seconds
# Base URL uses short name by default, school ID seems to work as well
SCHOOLPROFILE_BASE_URL = 'https://api.cps.edu/schoolprofile/CPS/AllSchoolProfiles'#'https://www.cps.edu//link/13832369d36941e5904ad932361c66c1.aspx'#'https://www.cps.edu/schools/schoolprofiles/'

# Path to CPS School Locations file.
# File can be found on Chicago Open Data Portal: https://data.cityofchicago.org/Education/Chicago-Public-Schools-School-Locations-SY2021-Map/9ybt-s3ms
school_locations_path = './raw-data/Chicago_Public_Schools_-_School_Locations_SY2021.csv' 
#school_locations_path = argv[1]
output_path = './output/program_data_' + datetime.datetime.now().strftime('%Y-%m-%d')

statistics = {
        "total_count": 0,
        "failure_count": 0,
        "success_count": 0,
        "failures": [],
        "time_start": None,
        "time_end": None,
        }
def print_statistics(stats):
    stats["time-end"] = datetime.datetime.now()
    time_elapsed_s = (stats["time-end"] - stats["time-start"]).total_seconds()

    print("\n\n----------------------------")
    print("FINISHED in {}s".format(time_elapsed_s))
    print("Successfully scraped {} out of {} schools.".format(stats["success_count"], stats["total_count"]))
    print("{} Errors:".format(stats["failure_count"]))
    for failure in stats["failures"]:
        print(" * {} ({}): {}".format(failure["school_name"], failure["school_id"], failure["err"]))
        print("\n")


# print statistics on script cancellation (Ctrl+C)
# --
def sigint_handler(signal_number, stack_frame):
    print_statistics(statistics)
    sys.exit(-1)
signal.signal(signal.SIGINT, sigint_handler)
# --

statistics["time-start"] = datetime.datetime.now()
with open(output_path, 'w+') as outfile:
    with open(school_locations_path) as locations_file:
        fieldnames = ['School_ID', 'Short_Name', 'Long_Name', 'Primary_Category', 'CPS_School_Profile', 'Website', 'School_Latitude', 'School_Longitude', 'Program_Type', 'Application_Requirements', 'Program_Selections']
        writer = csv.DictWriter(outfile, fieldnames)
        writer.writeheader()

        reader = csv.DictReader(locations_file)
        response = request.urlopen(SCHOOLPROFILE_BASE_URL)
        data = json.loads(response.read())
        for school in data:

            school_id = school['SchoolID']
            # DUMBEST ISSUE: 
            # INSTITUTO - LOZANO appears to have an inconsistent school Id in different
            # data sets. If we encounter the original id (400148), replace it with this id (400164)
            if school_id == '400148':
                school_id = '400164'
            # END DUMBEST ISSUE
            school_profile_url = 'https://www.cps.edu/schools/schoolprofiles/' + str(school_id)
            school_latitude = school['AddressLatitude']
            school_longitude = school['AddressLongitude']
            primary_category = school['PrimaryCategory']
 
         
            try :
                short_name = school['SchoolShortName']
                long_name = school['SchoolLongName']

                website_html = school['WebsiteURL']
                if not website_html:
                    website = 'n/a'
                website = website_html
                """
                programs_html = soup.find('div', class_='tab-pane', id='admissions')
                # there is a specific element that's rendered when no program info is available.
                if programs_html.find('div', id='ctl00_ContentPlaceHolder1_divNoPgmApplReq'):
                    # If no program info is available, give a reasonable default.
                    program_type = 'General Education'
                    application_requirements = 'n/a'
                    program_selections = 'n/a'

                    print(school_id)
                    print(short_name)
                    print(long_name)
                    print(primary_category)
                    print(website)
                    print(school_profile_url)
                    print(program_type)
                    print(application_requirements)
                    print(program_selections)
                    print('\n')

                    writer.writerow({
                        'School_ID': school_id,
                        'Short_Name': short_name,
                        'Long_Name': long_name,
                        'Primary_Category': primary_category,
                        'CPS_School_Profile': school_profile_url,
                        'Website': website,
                        'School_Latitude': school_latitude,
                        'School_Longitude': school_longitude,
                        'Program_Type': program_type,
                        'Application_Requirements': application_requirements,
                        'Program_Selections': program_selections
                        })

                else:"""
                    # otherwise, iterate through elements in programs tab.
                for program in school['Programs']:
                    
                    program_type = program['ProgramType']
                    application_requirements = program['ProgramApplicationRequirements']
                    program_selections = program['SelectionCriteria']
                    print(school_id)
                    print(short_name)
                    print(long_name)
                    print(website)
                    print(primary_category)
                    print(school_profile_url)
                    print(program_type)
                    print(application_requirements)
                    print(program_selections)
                    print('\n')

                    writer.writerow({
                        'School_ID': school_id,
                        'Short_Name': short_name,
                        'Long_Name': long_name,
                        'Primary_Category': primary_category,
                        'CPS_School_Profile': school_profile_url,
                        'Website': website,
                        'School_Latitude': school_latitude,
                        'School_Longitude': school_longitude,
                        'Program_Type': program_type,
                        'Application_Requirements': application_requirements,
                        'Program_Selections': program_selections
                        })

                statistics["success_count"] += 1

            # catch errors parsing html
            except Exception as e:
                school_name = school["SchoolShortName"]
                print("\nFAILED to parse html for school {} - id {}\n".format(school_name, school_id))
                statistics["failure_count"] += 1
                statistics["failures"].append({"school_id": school_id, "school_name": school_name, "err": str(e)})

            # delay between requests
            statistics["total_count"] += 1
            time.sleep(INTER_REQUEST_DELAY)


print_statistics(statistics)
