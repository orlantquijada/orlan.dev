for f in *.mdx; do
  # Extract the numeric part (remove leading zeros)
  num=$(echo "${f%.mdx}" | sed 's/^0*//')
  mv "$f" "$num.mdx"
done
