---
title: Release remark-custom-container 1.2.0
date: 2022-11-27
categories:
- dev
tags:
- lib
description: Support multiple contents in the container directive
---

Until v1.2.0, [`remark-custom-container`][repo] only handle single-line element as a container child, since it relies on naive regular expression.  
Now it supports multiple elements as children of container directives.

### example

```markdown
::: info sample title

Container children
Container children

<details>
  <summary>HTML tag works too</summary>
  <p>:tada:</p>
</details>

:::
```

will be rendered as follows:

::: info sample title

Container children
Container children

<details>
  <summary>HTML tag works too</summary>
  <p>🎉</p>
</details>

:::

[repo]: https://github.com/koka831/remark-custom-container
