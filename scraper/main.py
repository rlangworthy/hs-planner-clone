from urllib import request
import sys
from sys import argv
import csv
import time
import datetime
import re
import signal
from bs4 import BeautifulSoup

INTER_REQUEST_DELAY = 0.5 # seconds
SCHOOLPROFILE_BASE_URL = 'https://schoolinfo.cps.edu/schoolprofile/schooldetails.aspx'

# Path to CPS School Locations file.
# File can be found on Chicago Open Data Portal: https://data.cityofchicago.org/Education/Chicago-Public-Schools-School-Locations-SY1718/4g38-vs8v
school_locations_path = './raw-data/Chicago_Public_Schools_-_School_Locations_SY1920.csv' 
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
        for row in reader:

            school_id = row['School_ID']
            # DUMBEST ISSUE: 
            # INSTITUTO - LOZANO appears to have an inconsistent school Id in different
            # data sets. If we encounter the original id (400148), replace it with this id (400164)
            if school_id == '400148':
                school_id = '400164'
            # END DUMBEST ISSUE
            school_latitude = row['Lat']
            school_longitude = row['Long']
            primary_category = row['Grade_Cat']
            school_profile_url = SCHOOLPROFILE_BASE_URL + '?SchoolId=' + school_id
            print(school_profile_url)

            html_doc = request.urlopen(school_profile_url).read()
            soup = BeautifulSoup(html_doc, 'html.parser')
            try :
                short_name = soup.find('span', id='ctl00_ContentPlaceHolder1_lbSchoolTitle').string
                long_name = soup.find('span', id='ctl00_ContentPlaceHolder1_lbOfficialSchoolName').string

                website_html = soup.find('a', id='ctl00_ContentPlaceHolder1_lnkSchoolWebsite')
                if website_html:
                    website = website_html['href']
                else:
                    website = 'n/a'

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

                else:
                    # otherwise, iterate through elements in programs tab.
                    for program_html in programs_html.find_all('div', class_='panel well'):
                        
                        program_type = program_html.find('span', id=re.compile(r'ctl00_ContentPlaceHolder1_rpPgmApplReq_ctl\d{2}_lbProgramType')).get_text()
                        application_requirements = program_html.find('span', id=re.compile(r'ctl00_ContentPlaceHolder1_rpPgmApplReq_ctl\d{2}_lbProgramApplicationRequirements')).get_text()
                        program_selections = program_html.find('span', id=re.compile(r'ctl00_ContentPlaceHolder1_rpPgmApplReq_ctl\d{2}_lbProgramSelections')).get_text()

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
                school_name = row["Short_Name"]
                print("\nFAILED to parse html for school {} - id {}\n".format(school_name, school_id))
                statistics["failure_count"] += 1
                statistics["failures"].append({"school_id": school_id, "school_name": school_name, "err": str(e)})

            # delay between requests
            statistics["total_count"] += 1
            time.sleep(INTER_REQUEST_DELAY)


print_statistics(statistics)
