# ADAPTED FROM https://gist.github.com/anderser/7432419
import sys
import argparse
import networkx as nx
from networkx.readwrite import json_graph
import json


def graphmltojson(graphfile, outfile):
    """
    Converts GraphML file to json. JSON output is usable with D3 force layout.
    Usage:
    >>> python convert.py -i mygraph.graphml -o outfile.json
    """
    G = nx.read_graphml(graphfile)

    node_link = json_graph.node_link_data(G)
    graph = json.dumps(node_link)

    # Write to file
    fo = open(outfile, "w")
    fo.write(graph)
    fo.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Convert from GraphML to json. ')
    parser.add_argument(
        '-i', '--input', help='Input file name (graphml)', required=True)
    parser.add_argument(
        '-o', '--output', help='Output file name/path', required=True)
    args = parser.parse_args()
    graphmltojson(args.input, args.output)
