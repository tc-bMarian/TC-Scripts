# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(['Key_Questions_Pipeline_Report.py'],
             pathex=['C:\\Users\\Brandon\\Downloads\\Key_Questions_Pipeline_Report'],
             binaries=[],
             datas=[],
             hiddenimports=['pandas', "dataframe_image"],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='my_script',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          exclude_binaries=False,
          runtime_tmpdir=None,
          console=True,
          icon='favicon.ico') # if you need it, provide it in the dir