
import requests
import csv

program_url = "https://api.cps.edu/schoolprofile/CPS/AllSchoolProfiles"

most_recent_data = "2026-08-04"

local_path = "../raw-data/"+most_recent_data + "/"

profiles  = requests.get(program_url).json()


headers = [
    "School_ID",
    "Short_Name",
    "Long_Name",
    "Primary_Category",
    "CPS_School_Profile",
    "Website",
    "School_Latitude",
    "School_Longitude",
    "Program_Type",
    "Application_Requirements",
    "Program_Selections"]
programs = []

for school in profiles:
    for program in school["Programs"]:
        application_requirements = "<ul><li>Application Requirements: " + program['AssessmentDescription'] + "</li><li>GPA: "  + program['GPA'] + "</li></ul>"
        program_selections = "<ul><li><strong>Selection Type: </strong>" +program["SubPrograms"] + "</li><li><strong>GPA: </strong>" +program["SubPrograms"] + "#GPA</li><li><strong>Priority: </strong>" +program["Priority"] + "</li><li><strong>Note: </strong>" +program["Notes"] + "</li><li><strong></ul>"
        programs.append({
            "School_ID": school["SchoolID"],
            "Short_Name": school["SchoolShortName"],
            "Long_Name": school["SchoolLongName"],
            "Primary_Category": school["PrimaryCategory"],
            "CPS_School_Profile": "https://www.cps.edu/schools/profiles/school-overview/" + school["SchoolShortName"].replace(" ", "-"),
            "Website": school["WebsiteURL"],
            "School_Latitude": school["AddressLatitude"],
            "School_Longitude": school["AddressLongitude"],
            "Program_Type": program["ProgramType"],
            "Application_Requirements": application_requirements,
            "Program_Selections": program_selections})
        
with open(local_path + "program-data.csv", "w+", newline="") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=headers)
    writer.writeheader()
    writer.writerows(programs)