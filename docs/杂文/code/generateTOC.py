#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: RogerRordo
# Modified from https://github.com/amaiorano/md-to-toc/blob/master/md-to-toc.py

import re

DIR = 'docs'
SIDEBAR_FILE = '/_sidebar.md'
TOC_NAME = '_TOC.md'
TOC_LIST_PREFIX = "-"
INDENT = 4

HEADER_LINE_RE = re.compile(r"^(#+)\s*(.*?)\s*(#+$|$)", re.IGNORECASE)
LIST_RE = re.compile(r"^( *)- \[(.+)\]\((.*)\)$")


def to_github_anchor(title, anchors):
    '''
    Converts markdown header title (without #s) to GitHub-formatted anchor.
    Note that this function attempts to recreate GitHub's anchor-naming logic.
    '''

    # Convert to lower case and replace spaces with dashes
    anchor_name = title.strip().lower().replace(' ', '-')

    # Strip all invalid characters
    anchor_name = re.sub(r"[\[\]\"!#$%&'()*+,./:;<=>?@\^{|}~]", "",
                         anchor_name)

    # If we've encountered this anchor name before, append next instance count
    count = anchors.get(anchor_name)
    if count is None:
        anchors[anchor_name] = 0
    else:
        count = count + 1
        anchors[anchor_name] = count
        anchor_name = anchor_name + '-' + str(count)

    anchor_name = anchor_name.replace('`', '')

    return '#' + anchor_name


def toggles_block_quote(line):
    '''Returns true if line toggles block quotes on or off'''
    '''(i.e. finds odd number of ```)'''
    n = line.count("```")
    return n > 0 and line.count("```") % 2 != 0


def makeToc(path, tocFile):
    in_block_quote = False
    results = []  # list of (header level, title, anchor) tuples
    anchors = {}

    mdFile = open(DIR + path)
    for line in mdFile.readlines():
        if toggles_block_quote(line):
            in_block_quote = not in_block_quote
        if in_block_quote:
            continue

        header_level = 0
        m = HEADER_LINE_RE.match(line)
        if m is None:
            continue
        header_level = len(m.group(1))
        title = m.group(2)

        results.append((header_level, title, to_github_anchor(title, anchors)))

    # Compute min header level so we can offset output to be flush with
    # left edge
    min_header_level = min(results, key=lambda e: e[0])[0]

    for r in results:
        header_level = r[0]
        spaces = " " * INDENT * (header_level - min_header_level)
        print("> {}{} [{}]({})".format(
            spaces, TOC_LIST_PREFIX, r[1],
            path + r[2] if header_level > min_header_level else
            (path + r[2]).split('#')[0]),
              file=tocFile)


def main():
    with open(DIR + SIDEBAR_FILE) as f:
        inToc = False
        tocFile = None
        for line in f.readlines():
            m = LIST_RE.match(line)
            if m is None:
                continue
            level = len(m.group(1)) / INDENT
            title = m.group(2)
            path = m.group(3)

            if path.split('/')[-1] == TOC_NAME:  # 新TOC
                if inToc:  # 原来TOC未结束
                    tocFile.close()
                inToc = True
                tocLevel = level
                tocFile = open(DIR + path, 'w')
                print('# ' + title + '\n\n---\n', file=tocFile)
            elif inToc:
                if level <= tocLevel:  # TOC结束
                    tocFile.close()
                    inToc = False
                else:  # TOC继续
                    makeToc(path, tocFile)


if __name__ == "__main__":
    main()