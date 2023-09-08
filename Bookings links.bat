echo off
set user=%USERNAME%
set year=%date:~10,4%
start explorer.exe "C:\Users\%user%\TigerConnect\Finance & Accounting - Documents\Reporting\CEO Weekly Dashboard"
start explorer.exe "C:\Users\%user%\Box\Finance\Sales Report\%year%"
start "" https://tigertext.atlassian.net/wiki/spaces/FPA/pages/2936176651/Weekly+Bookings+Report+Draft
start "" https://tigertext.lightning.force.com/lightning/r/Report/00O5x000005FOpVEAW/view