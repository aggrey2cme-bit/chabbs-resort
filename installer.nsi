; CHABBS Resort Management System - NSIS Installer
; Unicode installer (handles copyright symbol correctly)
Unicode True

!define PRODUCT_NAME      "CHABBS Resort Management"
!define PRODUCT_VERSION   "2.0.0"
!define PRODUCT_PUBLISHER "CHABBS Resort & Conference Centre"
!define PRODUCT_EXE       "CHABBS Resort Management.exe"
!define INSTALL_DIR       "$PROGRAMFILES64\${PRODUCT_NAME}"
!define UNINSTALL_KEY     "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define SHORTCUT_NAME     "CHABBS Resort"

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "release\CHABBS Resort Management Setup.exe"
InstallDir "${INSTALL_DIR}"
InstallDirRegKey HKLM "${UNINSTALL_KEY}" "InstallLocation"
RequestExecutionLevel admin
ShowInstDetails show
ShowUnInstDetails show

; Pages
Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles

; Version info
VIProductVersion "2.0.0.0"
VIAddVersionKey "ProductName"    "${PRODUCT_NAME}"
VIAddVersionKey "ProductVersion" "${PRODUCT_VERSION}"
VIAddVersionKey "CompanyName"    "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalCopyright" "Copyright (c) 2025 ${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileDescription" "${PRODUCT_NAME} Installer"
VIAddVersionKey "FileVersion"    "${PRODUCT_VERSION}"

Section "Main Application" SecMain
  SectionIn RO
  SetOutPath "$INSTDIR"

  ; Copy all application files
  File "release\win-unpacked\CHABBS Resort Management.exe"
  File "release\win-unpacked\LICENSE.electron.txt"
  File "release\win-unpacked\LICENSES.chromium.html"
  File "release\win-unpacked\chrome_100_percent.pak"
  File "release\win-unpacked\chrome_200_percent.pak"
  File "release\win-unpacked\d3dcompiler_47.dll"
  File "release\win-unpacked\dxcompiler.dll"
  File "release\win-unpacked\dxil.dll"
  File "release\win-unpacked\ffmpeg.dll"
  File "release\win-unpacked\icudtl.dat"
  File "release\win-unpacked\libEGL.dll"
  File "release\win-unpacked\libGLESv2.dll"
  File "release\win-unpacked\resources.pak"
  File "release\win-unpacked\snapshot_blob.bin"
  File "release\win-unpacked\v8_context_snapshot.bin"
  File "release\win-unpacked\vk_swiftshader.dll"
  File "release\win-unpacked\vk_swiftshader_icd.json"
  File "release\win-unpacked\vulkan-1.dll"

  ; Copy subdirectories
  SetOutPath "$INSTDIR\locales"
  File /r "release\win-unpacked\locales\*"

  SetOutPath "$INSTDIR\resources"
  File /r "release\win-unpacked\resources\*"

  SetOutPath "$INSTDIR"

  ; Desktop shortcut
  CreateShortcut "$DESKTOP\${SHORTCUT_NAME}.lnk" \
    "$INSTDIR\${PRODUCT_EXE}" "" \
    "$INSTDIR\${PRODUCT_EXE}" 0 SW_SHOWNORMAL

  ; Start Menu shortcut
  CreateDirectory "$SMPROGRAMS\${SHORTCUT_NAME}"
  CreateShortcut "$SMPROGRAMS\${SHORTCUT_NAME}\${SHORTCUT_NAME}.lnk" \
    "$INSTDIR\${PRODUCT_EXE}" "" \
    "$INSTDIR\${PRODUCT_EXE}" 0 SW_SHOWNORMAL
  CreateShortcut "$SMPROGRAMS\${SHORTCUT_NAME}\Uninstall ${SHORTCUT_NAME}.lnk" \
    "$INSTDIR\Uninstall.exe"

  ; Write uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Registry entries for Add/Remove Programs
  WriteRegStr HKLM "${UNINSTALL_KEY}" "DisplayName"          "${PRODUCT_NAME}"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "DisplayVersion"       "${PRODUCT_VERSION}"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "Publisher"            "${PRODUCT_PUBLISHER}"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "InstallLocation"      "$INSTDIR"
  WriteRegStr HKLM "${UNINSTALL_KEY}" "UninstallString"      '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKLM "${UNINSTALL_KEY}" "DisplayIcon"          '"$INSTDIR\${PRODUCT_EXE}"'
  WriteRegDWORD HKLM "${UNINSTALL_KEY}" "NoModify" 1
  WriteRegDWORD HKLM "${UNINSTALL_KEY}" "NoRepair" 1

SectionEnd

Section "Uninstall"
  ; Remove files
  RMDir /r "$INSTDIR"

  ; Remove shortcuts
  Delete "$DESKTOP\${SHORTCUT_NAME}.lnk"
  RMDir /r "$SMPROGRAMS\${SHORTCUT_NAME}"

  ; Remove registry entries
  DeleteRegKey HKLM "${UNINSTALL_KEY}"
SectionEnd
