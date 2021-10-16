#!/usr/bin/env python3

from collections import defaultdict
from dataclasses import dataclass, field
from os import walk
from os.path import abspath, exists, join
from re import compile
from typing import Any, List, MutableMapping, Tuple

news_path = abspath(join(__file__, "..", "..", "docs", "news"))

news_path_regex = compile(r"(\d{4})/(\d{1,2})/(\d{1,2})$")


def _defaultdict_mid():
    return defaultdict(list)


@dataclass(frozen=True, order=True)
class Article:
    slug: str = field(compare=False)
    title: str

    @classmethod
    def from_slug(cls, year: int, month: int, day: int, slug: str):
        with open(join(news_path, str(year), str(month), str(day), slug), "r") as fp:
            first_line = fp.readline().strip().lstrip("# ")
        return cls(slug, first_line)


article_data: MutableMapping[int, MutableMapping[int, MutableMapping[int, List[Article]]]] = defaultdict(
    lambda: defaultdict(_defaultdict_mid))

for cd, folders, files in walk(news_path):
    if match := news_path_regex.search(cd):
        year, month, day = [int(group) for group in match.group(1, 2, 3)]
        for file in files:
            article_data[year][month][day].append(Article.from_slug(year, month, day, file))

file_data = ""

template_path = abspath(join(__file__, "..", "archives.template.md"))
if exists(template_path):
    with open(template_path, "r") as fp:
        file_data += fp.read().rstrip() + "\n\n"


def _first_item(item: Tuple[Any, Any]) -> Any:
    return item[0]


for year, year_data in sorted(article_data.items(), key=_first_item, reverse=True):
    file_data += f"# {year}\n"
    for month, month_data in sorted(year_data.items(), key=_first_item, reverse=True):
        file_data += f"## {month}\n"
        for day, items in sorted(month_data.items(), key=_first_item, reverse=True):
            file_data += f"### {day}\n"
            items.sort()
            for item in items:
                file_data += f"* [{item.title}]({year}/{month}/{day}/{item.slug})\n"

with open(join(news_path, "archives.md"), "w") as fp:
    fp.write(file_data)
