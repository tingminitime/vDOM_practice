export default function ($node, $target) {
  $target.replaceWith($node)
  return $node
}