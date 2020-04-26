#!/usr/bin/env bash

if [[ -z TEST_PLATFORM ]]; then
  echo "${TEST_PLATFORM} variable is not set"
  exit 1
fi

UNITY_LICENSE_FILE="${UNITY_LICENSE_DIR}/Unity_v${UNITY_VERSION}.ulf"

if [[ ! -f "${UNITY_LICENSE_FILE}" ]]; then
  echo "Cannot find license file ${UNITY_LICENSE_FILE}"
  exit 1
fi

mkdir -p /root/.cache/unity3d
mkdir -p /root/.local/share/unity3d/Unity/
cat "${UNITY_LICENSE_FILE}" | tr -d '\r' > /root/.local/share/unity3d/Unity/Unity_lic.ulf

xvfb-run --auto-servernum --server-args='-screen 0 640x480x24' \
  /opt/Unity/Editor/Unity \
  -nographics \
  -batchmode \
  -verbose \
  -projectPath $(pwd) \
  -runTests \
  -testPlatform "${TEST_PLATFORM}" \
  -testResults "/test-results/${TEST_PLATFORM}-results.xml" \
  -logFile /dev/null \

cat "/test-results/${TEST_PLATFORM}-results.xml" > /dev/stdout
