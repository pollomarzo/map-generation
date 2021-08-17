# what this is
a conversion script from graphML to json, in the format this software expects it to be

# how do i use this
first run the `gml_to_json.py` passing input and output files, then run `inflate_json.js` with `node inflate_json.js`. Then move `labels.json`, `nodes.json`, `correct.json` to the conf directory.

# why python and javascript
graphML is easily handled by `networkx`, a python library. JSON handling is fastest for me in JS.