# Depends on ImageMagick.
echo "Now clearing existing cropped images..."
rm *-cropped-*
echo "Cropping large jpgs and pngs located in this directory..."
for f in *.png; do convert "$f" -crop x2000+0+0 "${f%.*}-cropped-lg.png"; done && for f in *.jpg; do convert "$f" -crop x2000+0+0 "${f%.*}-cropped-lg.jpg"; done
echo "Cropping small jpgs and pngs located in this directory."
for f in *.png; do convert "$f" -crop x1400+0+0 "${f%.*}-cropped-sm.png"; done && for f in *.jpg; do convert "$f" -crop x1400+0+0 "${f%.*}-cropped-sm.jpg"; done
# Remove any double-cropped, duplicated images last.
rm *-cropped-*-cropped*