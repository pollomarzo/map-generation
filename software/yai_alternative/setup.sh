#!/bin/bash

MY_DIR="`python -c "import os; print(os.path.realpath('$1'))"`"
cd $MY_DIR

# Run AIX server
cd aix
echo 'Setting up AIX server..'
virtualenv .env -p python3.7
source .env/bin/activate
pip install -U pip setuptools wheel twine
pip install -r requirements.txt
cd ..

# Run YAI server
cd yai
echo 'Setting up YAI server..'
virtualenv .env -p python3.7
source .env/bin/activate
pip install -U pip setuptools wheel twine
pip install -r requirements.txt
cd ..

# Run OKE Server
cd oke
echo 'Setting up OKE server..'
virtualenv .env -p python3.7
source .env/bin/activate
pip install -U pip setuptools wheel twine
# cd .env/lib
# git clone https://github.com/huggingface/neuralcoref.git
# cd neuralcoref
# pip install -r requirements.txt
# pip install -e .
# cd ..
# cd ../..
pip install -r requirements.txt
pip install -U wn==0.0.23 # fixing a bug with pywsd
python3 -m spacy download en_core_web_md
# python3 -m spacy download en_core_web_sm
python3 -m nltk.downloader stopwords punkt averaged_perceptron_tagger framenet_v17 wordnet brown
cd ..
