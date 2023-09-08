
set user=%USERNAME%
set year=%date:~10,4%
set month=%date:~4,2%

rem 0,2 for mm/dd/yyyy  or 3,2 for dd/mm/yyyy
set month-num=%date:~4,2%
if %month-num%==02 set mo-name=January
if %month-num%==03 set mo-name=February
if %month-num%==04 set mo-name=March
if %month-num%==05 set mo-name=April
if %month-num%==06 set mo-name=May
if %month-num%==07 set mo-name=June
if %month-num%==08 set mo-name=July
if %month-num%==09 set mo-name=August
if %month-num%==10 set mo-name=September
if %month-num%==11 set mo-name=October
if %month-num%==12 set mo-name=November
if %month-num%==01 set mo-name=December



start explorer.exe "C:\Users\%user%\Box\FloQast\FQ - TigerText\%year%\"
