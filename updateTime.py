#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: RogerRordo

import re
import os
from datetime import datetime
import hashlib

DIR = 'docs'
SIDEBAR_FILE = '/_sidebar.md'
TOC_NAME = '_TOC.md'
README_NAME = 'README.md'

LIST_RE = re.compile(r"^( *)- \[(.+)\]\((.*)\)$")
MD5_RE = re.compile(r"md5: *'(.*)'")


def main():
    with open(DIR + SIDEBAR_FILE, 'r', encoding='UTF-8') as f:
        for lineF in f.readlines():
            # 判断是不是list item
            m = LIST_RE.match(lineF)
            if m is None:
                continue
            path = m.group(3)

            # 判断是否文章
            if path[-3:] != '.md' or path[-7:] == TOC_NAME or path[
                    -9:] == README_NAME:
                continue

            # 读入
            with open(DIR + path, 'r', encoding='UTF-8') as mdFile:
                lines = []
                for lineMd in mdFile.readlines():
                    lines.append(lineMd)
            oldMD5 = ''
            if lines[0] == '---\n':
                m = MD5_RE.match(lines[3])
                oldMD5 = m.group(1)
                lines = lines[6:]

            # 检查MD5
            md5 = hashlib.md5()
            for line in lines:
                md5.update(line.encode('utf-8'))
            newMD5 = md5.hexdigest()
            if oldMD5 == newMD5:
                continue

            # 读取时间
            ctime = datetime.fromtimestamp(os.path.getctime(DIR +
                                                            path))  # 创建时间
            mtime = datetime.fromtimestamp(os.path.getmtime(DIR +
                                                            path))  # 修改时间
            if mtime < ctime:
                mtime = ctime

            # 输出
            with open(DIR + path, 'w', encoding='UTF-8') as mdFile:
                print('---', file=mdFile)
                print('date: ' + ctime.strftime('%Y-%m-%d %H:%M:%S'),
                      file=mdFile)
                print('updated: ' + mtime.strftime('%Y-%m-%d %H:%M:%S'),
                      file=mdFile)
                print("md5: '" + newMD5 + "'", file=mdFile)
                print('---\n', file=mdFile)
                for line in lines:
                    print(line, end='', file=mdFile)


if __name__ == "__main__":
    main()