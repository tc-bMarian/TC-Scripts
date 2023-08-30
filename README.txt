Files Required:
	favicon.ico - if you don't want one you'll need to edit icon in the .spec file
	Script_Name.spec - need to edit path & hidden imports here. can be a pain in the ass if it doesn't work, difficult to troubleshoot. 
	Script.py - export from jupyter with file > Download as > .py (check downloads folder, don't get trolled)
https://geo.rocks/post/python-to-exe/
	Setup a venv
		pip install virtualenv
		virtualenv venv
	Activate it!
		"venv/scripts/activate"
	install your requirements. Fewer the better. Can do this manually or with pipreqs > requirements.txt > install requirements.txt
		pipreqs /filepath/ was hating so I did it manually... pipfreeze also works but gives too damn much
	copy over upx.exe for file compression
	Creating the .spec file
								don't use: pyi-makespec --onefile my_script.py
		using the one i made last time is perfect. 
	time to build! (doesn't have to be in venv. actually, don't do it in venv? idk)
		pyinstaller script.spec
	
	Should run! 

If you already have run through this process once. Simply:
	download the .py file from file > Download as > .py (check downloads folder, don't get trolled)
	run pyinstaller script.spec

	
Make a list of which files need to ship with your .exe