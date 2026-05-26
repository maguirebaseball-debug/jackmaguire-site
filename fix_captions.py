import re

file_path = "/Users/jackmaguire/Developer/jackmaguire-site/src/content/blog/top-1000-cocktails.mdx"
with open(file_path, "r") as f:
    content = f.read()

content = re.sub(r"\n\n\*\((.*?)\)\*\n", r'\n<span class="image-caption"><i>(\1)</i></span>\n\n', content)

with open(file_path, "w") as f:
    f.write(content)
