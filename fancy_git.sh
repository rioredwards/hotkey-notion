#!/bin/bash

git log --pretty=format:"%h%x09%s%x09%an%x09" -n 2 --shortstat | awk '
BEGIN {
  separator = "___________________________________________________________________________________________";
  print separator;
}

{
  if (NR % 3 != 3) {
    hash = $1;
    author = $NF;
    $1 = "";
    $NF = "";
    message = substr($0, 2, length($0)-2);
    if (length(message) > 58) {
      message = substr(message, 1, 58) "...";
    }
    printf("%-8s | %-61s | %s\n", hash, message, author);
  } else {
    changes = $0;
    printf("%21s | %-75s |\n", "", changes);
    print separator;
  }
}'
