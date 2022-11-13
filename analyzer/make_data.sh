cd data

# Download wrime dataset
curl -O https://raw.githubusercontent.com/ids-cv/wrime/master/wrime-ver1.tsv

# Fix column name
if sed --version > /dev/null 2>&1; then
  # Linux (GNU)
  sed -i -e '1s/Saddness/Sadness/g' wrime-ver1.tsv
else
  # Mac (BSD)
  sed -i '' -e '1s/Saddness/Sadness/g' wrime-ver1.tsv
fi
