#!/usr/bin/env bash

if [[ -z "${UNITY_LICENSE_DIR}" ]]; then
  echo "UNITY_LICENSE_DIR variable is not set"
  exit 1
fi

/opt/Unity/Editor/Unity \
  -nographics \
  -batchmode \
  -logFile /dev/null \
  -createManualActivationFile

# Fail job if unity.alf is empty
mv *.alf "${UNITY_LICENSE_DIR}/"

exit $?
