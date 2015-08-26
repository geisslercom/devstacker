#!/bin/bash
echo "[o] Linux Stack Installing Script"
echo "[o] Adding Sources to Deb List"
#wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
mkdir deb src bin
sudo chmod 775 ./sub/*

echo "[o] Update and Upgrade packages"
sudo apt-get update
sudo apt-get upgrade

echo "Installing Repo Depedencies"
packages=( <% packets.shell %> )
for (( i = 0; i < ${#packages[@]}; i++ )); do
	echo "Installing Package:" ${packages[i]}
	sudo apt-get install -y ${packages[i]}
done


echo "[x] Installing All Local Deps Depedencies"
./sub/installBin.sh
<% packets.dpkg %>


echo "Installing Remote Depedencies"
<% packet.other.ohmyzsh.sh %>

<% packet.other.jd.sh %>

<% packet.other.composer.sh %>

<% packet.other.ruby.sh %>


echo "[*] Initzialize Private Project stuff"
languages=(
	python lamp angular firebase noob2hero chrome nodeapps customer
)

read -p "Enter pro" -i "projects" prhome
echo "Making Dir:"$prhome
mkdir ~/$prhome
if [[ $? ]]; then
	exit 
fi
cd ~/$prhome

<% packets.node %>

for (( i = 0; i < ${#languages[@]}; i++ )); do
	echo "\t Creating Project dir:" ${languages[i]}
	mkdir ${languages[i]}
done

#github repos
while true; do
    read -p "Do you want to add git repos?" yn
    case $yn in
        [Yy]* ) ./sub/git.sh; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done
