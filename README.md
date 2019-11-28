board will be a grid like zelda
each cell will have a static size (equal width and height)
character will always fit in one cell (as will enemies)
objects in the world can span multiple cells
collision detection will be limited to checking if objects are in the same cell

implementation
all game logic should be sparate from rendering
then build a renderer that can render purely based on game state
probably canvas in html
that means we need to be able to pack the JS so it can be consumed in html
webpack? parcel?