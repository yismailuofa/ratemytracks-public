from json import dump
from requests import get, codes


API_URL = "https://www.ratemyprofessors.com/filter/professor/?&queryoption=TEACHER&queryBy=schoolId&sid=1407&page="
PROF_URL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid="


profDict, profsRemaining, page = dict(), True, 1

while profsRemaining:
    pageUrl = API_URL + str(page)
    print(f"Scraping page {page}")
    page += 1
    resp = get(pageUrl)

    if resp.status_code != codes.ok:
        raise Exception(f"Invalid Status Code: {resp.status_code}")

    jsonData = resp.json()
    profs = jsonData["professors"]

    for prof in profs:
        profUrl = PROF_URL + str(prof["tid"])
        profName = prof["tLname"].lower() + "," + prof["tFname"].lower()
        profRating = float(prof["overall_rating"]
                           ) if prof["overall_rating"] != "N/A" else -1.0
        profRatingClass = prof["rating_class"]  # zero, poor, average, good
        profDict[profName] = {
            "profUrl": profUrl,
            "profRating": profRating,
            "profRatingClass": profRatingClass
        }
        if prof["tMiddlename"]:
            profNameMiddle = prof["tLname"].lower(
            ) + "," + prof["tFname"].lower() + " " + prof["tMiddlename"].lower()
            profDict[profNameMiddle] = {
                "profUrl": profUrl,
                "profRating": profRating,
                "profRatingClass": profRatingClass
            }

    if jsonData["remaining"] == 0:
        profsRemaining = False


with open("profData.json", "w") as f:
    dump(profDict, f, ensure_ascii=False)
