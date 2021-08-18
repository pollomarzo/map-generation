# what this is
a conversion script from graphML to json, in the format this software expects it to be. Also, from txt list of nodes to nice JSON prepped for use

# how do i use this
first run the `gml_to_json.py` passing input and output files, then run `inflate_json.js` with `node inflate_json.js`. Then move `labels.json`, `nodes.json`, `correct.json` to the conf directory.
for the list of nodes, `node decoy_inflate.js` with list of decoys in the current directory. In the script the number of decoys may be configured.

# why python and javascript
graphML is easily handled by `networkx`, a python library. JSON handling is fastest for me in JS.