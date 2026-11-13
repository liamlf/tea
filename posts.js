/* ============================================================
   TÉA'S POSTS — this is the only file you need to edit to blog.

   Newest goes at the TOP. Copy one of the blocks below, change
   the words, save, refresh the page. Three kinds of card:

   kind: "entry"  → a parchment page with a title and writing
   kind: "quote"  → chalk on slate. just `text` and `by`
   kind: "pin"    → a picture card. `art` is one of:
                    "moon" | "constellation" | "comet" | "star" | "rose"
                    or `image: "photos/whatever.jpg"` for a real photo
                    (put the photo in a folder next to this file)

   In `body`, leave a blank line between paragraphs.
   Lines starting with ">" become a pull-quote.
   Entries can also have `art` or `image` to show a picture on top.
   ============================================================ */

window.POSTS = [
  {
    id: "first-leaf",
    kind: "entry",
    title: "The First Leaf",
    date: "2026-11-12",
    tag: "diary",
    art: "moon",
    body: `
Here beginneth the book. Every codex has to start with a blank page and somebody brave enough to ruin it, so: hello. This is mine now.

I don't know yet what this will be. Maybe a diary. Maybe a pinboard for things too pretty to lose in a camera roll. Maybe just a place to be dramatic about the weather, the way the Romantics were, except with better fonts.

> Sample entry — replace me with your own words.
> (Open posts.js. It explains itself.)

Whatever it turns into, it is stuck with stars on purpose.
`
  },
  {
    id: "bright-star",
    kind: "quote",
    tag: "verses",
    text: "Bright star, would I were stedfast as thou art —",
    by: "John Keats, 1819"
  },
  {
    id: "moon-study",
    kind: "pin",
    title: "study of a moon, no. 1",
    date: "2026-11-10",
    tag: "pins",
    art: "moon"
  },
  {
    id: "for-tea",
    kind: "entry",
    title: "A Note Left in the Margin",
    date: "2026-11-11",
    tag: "love letters",
    art: "rose",
    body: `
Téa — I asked for a blog that was Pinterest and Y2K and stars and slate and an old manuscript and the Romantic era all at once, and I was told that made no sense. It makes perfect sense. It's you.

You're the only person I know who could be all of those things in the same afternoon, so you get a website that is too.

Write whatever you want here. I'll read every page.

<p class="sig">— yours (sign your name here, builder of this site)</p>
`
  },
  {
    id: "she-walks",
    kind: "quote",
    tag: "verses",
    text: "She walks in beauty, like the night / Of cloudless climes and starry skies",
    by: "Lord Byron, 1814"
  },
  {
    id: "constellation",
    kind: "pin",
    title: "a constellation i made up",
    date: "2026-11-08",
    tag: "pins",
    art: "constellation"
  },
  {
    id: "things-lately",
    kind: "entry",
    title: "Small Things, Lately",
    date: "2026-11-07",
    tag: "lists",
    body: `
A list, because lists are just poems that got organized.

One: the exact blue of the sky at 4:45 in November. Two: silver gel pens. Three: when a song from 2003 comes on and everyone knows the words. Four: wax seals on anything. Five: being read to.

> Another sample — swap in your own list.
`
  },
  {
    id: "chrome-star",
    kind: "pin",
    title: "★ lucky star ★",
    date: "2026-11-06",
    tag: "pins",
    art: "star"
  },
  {
    id: "shelley",
    kind: "quote",
    tag: "verses",
    text: "The desire of the moth for the star, / Of the night for the morrow",
    by: "Percy Bysshe Shelley, 1821"
  },
  {
    id: "comet",
    kind: "pin",
    title: "make a wish, quick",
    date: "2026-11-04",
    tag: "pins",
    art: "comet"
  }
];
