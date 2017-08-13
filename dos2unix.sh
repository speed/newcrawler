#! /bin/sh
#chmod +x dos2unix.sh


for x
do
    echo "Converting $x"
    tr -d '\015' < "$x" > "tmp.$x"
    mv "tmp.$x" "$x"
done
