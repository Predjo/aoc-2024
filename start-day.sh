if [[ "$1" == "" ]]
then
  read -r -p "Enter a day number: " number
else
  number=$1
fi

day=$(printf %02d $number)
echo "Advent of Code -- Day: $day";
./node_modules/tsx/dist/cli.mjs "./src/Day-$day/index.ts"