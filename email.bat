::@echo off

setlocal

set user=%USERNAME%

:: Fetch date in yyyyMMdd format
for /f "delims=" %%a in ('wmic OS Get localdatetime  ^| find "."') do set datetime=%%a

:: Extract year, month, and day
set year=%datetime:~2,2%
set month=%datetime:~4,2%
set day=%datetime:~6,2%

:: Remove leading zero for month
if "%month:~0,1%"=="0" set month=%month:~1%

:: Remove leading zero for day
if "%day:~0,1%"=="0" set day=%day:~1%

:: Combine into desired format
set mydate=%month%.%day%.%year%

:: Determine quarter
if %month% GEQ 1 if %month% LEQ 3 set quarter=1
if %month% GEQ 4 if %month% LEQ 6 set quarter=2
if %month% GEQ 7 if %month% LEQ 9 set quarter=3
if %month% GEQ 10 if %month% LEQ 12 set quarter=4

echo Current Quarter: %quarter%

echo Date: %mydate%


:: Define the output file name
set outputFile="sample.eml"

:: Start writing to the file
(
echo To: weeklysalesupdate@tigerconnect.com
echo Subject: Weekly Sales Report %mydate%
echo X-Unsent: 1
echo Content-Type: text/html
echo.
echo Hi Team,
echo ^<br^>
echo ^<br^>
echo.
echo Please see below for latest Q%quarter%'23 Sales Report.
echo ^<br^>
echo ^<br^>
echo ^<br^>
echo ^<br^>
echo.
echo Cheers,
echo ^<br^>
echo %user%
) > %outputFile%

echo EML file created successfully!
start "" "%outputFile%"

endlocal
pause