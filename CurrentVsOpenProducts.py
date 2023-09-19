print("Welcome")
import requests
import datetime
import yaml #pyyaml
import numpy as np
import dataframe_image as dfi #https://randomds.com/2021/12/23/visualize-and-save-full-pandas-dataframes-as-images/
from datetime import datetime
from dateutil.relativedelta import relativedelta
from openpyxl import load_workbook
from openpyxl.utils import get_column_letter
from openpyxl.utils.dataframe import dataframe_to_rows

# looks useful: https://geo.rocks/post/python-to-exe/ from https://stackoverflow.com/questions/55741607/is-it-possible-to-generate-an-executable-exe-of-a-jupyter-notebook
# Merging in Pandas: https://stackoverflow.com/questions/53645882/pandas-merging-101

# Hold credentials in .yaml?
# Use python to hit call some code in an excel file? MAybe use batch as an intermediary?

# Pandas Pivot Table Filter:
# https://stackoverflow.com/questions/43235930/adding-filter-to-pandas-pivot-table
# Pivot table basics: https://builtin.com/data-science/pandas-pivot-tables

# Imports username & security_token from setup.yaml
# get security token from... https://tigertext.lightning.force.com/lightning/settings/personal/ResetApiToken/home
with open("setup.yaml") as stream:
    try:
        #print(yaml.safe_load(stream))
        values = yaml.safe_load(stream)
        #print(values)
    except yaml.YAMLError as exc:
        pass
        print(exc)
#print(values)
import pandas as pd
import csv
import requests
from io import StringIO
from simple_salesforce import Salesforce
from getpass import getpass

#show all columns.... 
pd.set_option('display.max_columns', None)

# Input Salesforce credentials:
sf = Salesforce(
    username=values["username"], 
    password= getpass(),# gets input from Command prompt, hides what you type 
    security_token=values["security_token"])
print("Please wait while I extract that data for you")
# Basic report URL structure:
orgParams = 'https://tigertext.my.salesforce.com/' # you can see this in your Salesforce URL
exportParams = '?isdtp=p1&export=1&enc=UTF-8&xf=csv'

# Downloading the report:
#reportId = '00O5x000005FOpVEAW' # You find this in the URL of the report in question between "Report/" and "/view"
reportId = '00O5x000008Ngn4EAC' # Added in Product Line column to address One-Time
reportUrl = orgParams + reportId + exportParams
reportReq = requests.get(reportUrl, headers=sf.headers, cookies={'sid': sf.session_id})
reportData = reportReq.content.decode('utf-8')
reportDf = pd.read_csv(StringIO(reportData))
reportDf.drop(reportDf.tail(5).index, inplace = True) #Drop saleforce info junk lines at bottom
reportDf.loc[ reportDf["Account Category"] != "SMB", "Account Category"] = "Enterprise"
# Force 'close Date' to datetime, then add 'New Month' column with month (Kiets original excel file sets first day of month, instead of month. But both will be pivotable)
reportDf['Close Date'] = pd.to_datetime(reportDf['Close Date'], errors='coerce')
reportDf["New Month"] = reportDf["Close Date"].dt.month#.astype(str).str[0:2]
reportDf = reportDf[~reportDf['Opportunity Name'].str.contains('Test', na=False)]#remove test opps.. And TeleTest because f them that's why
#reportDf
#New
#Upsell
#Cancelled
#Downgrade
#Cross-Sell

reportDf["Opp Type"] = "N/A"

reportDf.loc[ reportDf["Subtype"] == "New Business", "Opp Type"] = "New"
reportDf.loc[ reportDf["Subtype"] == "Upsell", "Opp Type"] = "Upsell"
reportDf.loc[ reportDf["Subtype"] == "Cross-Sell", "Opp Type"] = "Cross-Sell"
reportDf.loc[ reportDf["Subtype"] == "Down-Sell", "Opp Type"] = "Downgrade"
reportDf.loc[ reportDf["Subtype"] == "Cancellation", "Opp Type"] = "Cancelled"

reportDf#[0:40]
#reportDf.to_csv("Test.csv")
# Add "One-Time?" Column based on Category
reportDf['One-Time?'] = reportDf['Category'].isin(['API', 'Subscription','Add-On'])
reportDf
# creates "New MRR" Column
reportDf["New MRR"] = reportDf["Total Price"]/reportDf["Calculated Term (F)"]
#reportDf.loc[ reportDf["One-Time?"] == "Yes", "New MRR"] = 0 # One time payments don't have recurring revenue component. Changed from Yes/No to bool
reportDf.loc[ reportDf["One-Time?"] == False, "New MRR"] = 0 # The bool is flipped. Sue me.
# Enter Acc name here!
oppDf = reportDf[reportDf["Account Name"] == "East Carolina University"]
#oppDf['URL'] = 'https://tigertext.lightning.force.com/lightning/r/Opportunity/' + oppDf['CASESAFEID'].astype(str) + '/view'
oppDf['URL'] = oppDf['CASESAFEID'].apply(lambda x: f'<a href="https://tigertext.lightning.force.com/lightning/r/Opportunity/{x}/view" target="_blank">o</a>')



# Replace "// - //" with NaN before splitting
oppDf['Start/End Date'] = oppDf['Start/End Date'].replace('// - //', np.nan)

# Split the 'Start/End Date' column into two separate columns
oppDf[['Start Date','End Date']] = oppDf['Start/End Date'].str.split(' - ',expand=True)

# Convert the new columns to datetime format
oppDf['Start Date'] = pd.to_datetime(oppDf['Start Date'], errors='coerce')
oppDf['End Date'] = pd.to_datetime(oppDf['End Date'], errors='coerce')

from datetime import datetime, timedelta

# Define your default future date
# Here, I'm setting it to one year from the current date
default_date = datetime.now() + timedelta(days=365)

# Fill NaN or NaT values
oppDf['Start Date'] = oppDf['Start Date'].fillna(default_date)
oppDf['End Date'] = oppDf['End Date'].fillna(default_date)

oppDf = oppDf.dropna(subset=['Product Code'])
oppDf = oppDf[oppDf['One-Time?'] != False]



oppDf

import plotly.figure_factory as ff

# Create a list of dictionaries, each representing a product sale
data = []
#for i in range(len(oppDf)):
#    data.append(dict(Task=oppDf['CASESAFEID'][i], Start=oppDf['StartDate'][i], Finish=oppDf['EndDate'][i], Resource=oppDf['Product Code'][i]))
for index, row in oppDf.iterrows():
    data.append(dict(Task=row['Product Name'], Start=row['Start Date'], 
                     Finish=row['End Date'], Resource=row['CASESAFEID'],customdata=row['URL']))


    
color_palette = ['#7a0504', '#dc3912', '#ff9900', '#109618', '#66aa00', '#dd4477', '#0099c6', '#440e62', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac', '#b77322', '#16d620', '#b91383', '#f4359e', '#9c5935', '#a9c413', '#2a778d', '#668d1c', '#bea413', '#0c5922', '#743411']

#fig = ff.create_gantt(data, index_col='Resource', title='Customer Product Portfolio', colors=color_palette, show_colorbar=True, bar_width=0.2, showgrid_x=True, showgrid_y=True, group_tasks=True)

# Create the Gantt chart
fig = ff.create_gantt(data, index_col='Resource', title='Customer Product Portfolio', colors=color_palette,
                      show_colorbar=True, bar_width=0.2, showgrid_x=True, showgrid_y=True, group_tasks=True)

product_code_to_y = {product_code: i for i, product_code in enumerate(reversed(oppDf['Product Name'].unique()))}

# Add annotations
for i in range(len(oppDf)):
    fig.add_annotation(dict(
        x=oppDf['Start Date'].iloc[i] + (oppDf['End Date'].iloc[i] - oppDf['Start Date'].iloc[i]) / 2,
        y=product_code_to_y[oppDf['Product Name'].iloc[i]],  # changed from y=i to align with tasks on y-axis
        text=str(oppDf['URL'].iloc[i]),
        showarrow=False,
        font=dict(
            size=10
        ),
        yref="y",
        xref="x"
    ))


fig.show()

oppDf.to_excel("output.xlsx")  

print("Have a wonderful day!")
print("       .-.")
print(" __   /   \   __")
print("(  `\'.\   /.\'`  )")
print(" \'-._.(;;;)._.-\'")
print(" .-\'  ,`\"`,  \'-.")
print("(__.-\'/   \'-.__)/)_")
print("      \   /\    / / )")
print("       \'-\'  |   \/.-\')")
print("       ,    | .\'/\\'..)")
print("       |\   |/  | \_)")
print("       \ |  |   \_/")
print("        | \ /")
print("         \|/    _,")
print("          /  __/ /")
print("         | _/ _.\'")
print("         |/__/")
print("          \ ")

#input("") #Keeps terminal open until you press enter. But kinda bad practice
import os 
os.system("pause")