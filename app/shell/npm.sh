#NPM Zeug
echo "Installing Node Depedencies"
npmp=(<% packets.npm %>)
for (( i = 0; i < ${#npmp[@]}; i++ )); do
	echo "\tInstalling Node Package:" ${npmp[i]}
	sudo npm install -d -g ${npmp[i]}
done
echo "Done ! Installing Node Depedencies"
#----------------------------------------