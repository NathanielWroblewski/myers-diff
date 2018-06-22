Myers Difference Algorithm
===

![Screenshot](https://github.com/NathanielWroblewski/myers-diff/blob/master/screenshot.png)

In 1986, Eugene Myers published [An O(ND) Difference Algorithm and Its Variations](http://www.xmailserver.org/diff2.pdf), which unified the problems of finding the longest common subsequence of two sequences (the LCS of "driftwood" and "artwork" is "two") and finding the shortest edit script for transforming one sequence into another.  Myers showed that these problems were equivalent to finding the shortest path over an "edit graph."

This repo contains an HTML document outlining his approach and explaining the algorithm visually.

Running locally
---

On a Mac,

```sh
$ git clone https://github.com/NathanielWroblewski/myers-diff.git
$ cd myers-diff
$ open http://localhost:8000 && python -m SimpleHTTPServer
```
