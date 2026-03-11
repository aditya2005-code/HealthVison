#!/usr/bin/env bash
set -o errexit

echo "Updating packages..."
apt-get update

echo "Installing Poppler..."
apt-get install -y poppler-utils

echo "Installing Tesseract OCR..."
apt-get install -y tesseract-ocr

echo "Installing Python dependencies..."
pip install -r requirements.txt